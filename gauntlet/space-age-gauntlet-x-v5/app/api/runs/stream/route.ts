import { NextRequest } from "next/server";
import path from "node:path";
import fs from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live run monitor (SSE). V4 had no way to watch a run in flight — you read the JSON after
// it finished. Tails the run's events.jsonl and pushes each new event to the browser.
export async function GET(req: NextRequest) {
  const run = req.nextUrl.searchParams.get("run");
  if (!run) return new Response("run query param required", { status: 400 });

  const runsRoot = path.resolve("runs");
  const runDir = path.resolve(runsRoot, run);
  // Never serve outside runs/ — the param comes from the browser.
  if (runDir !== runsRoot && !runDir.startsWith(runsRoot + path.sep)) {
    return new Response("invalid run", { status: 400 });
  }

  const file = path.join(runDir, "events.jsonl");
  const encoder = new TextEncoder();
  let cursor = 0;
  let timer: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => controller.enqueue(encoder.encode(data));
      send(`retry: 3000\n\n`);
      const tick = () => {
        try {
          const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
          if (size > cursor) {
            const fd = fs.openSync(file, "r");
            const buf = Buffer.alloc(size - cursor);
            fs.readSync(fd, buf, 0, buf.length, cursor);
            fs.closeSync(fd);
            cursor = size;
            for (const line of buf.toString("utf8").split("\n").filter(Boolean)) {
              send(`data: ${line}\n\n`);
            }
          } else {
            send(`: keep-alive\n\n`);
          }
        } catch {
          send(`: waiting\n\n`);
        }
      };
      tick();
      timer = setInterval(tick, 1000);
    },
    cancel() { clearInterval(timer); },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
