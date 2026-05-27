import { spawn } from "child_process";
import { config } from "./config";

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  exitCode: number | null;
}

export async function run(
  agent: keyof typeof config & string,
  args: string[],
  opts: { timeoutMs?: number; input?: string } = {}
): Promise<RunResult> {
  const bin = (config as Record<string, string>)[agent] || agent;
  const start = Date.now();

  return new Promise((resolve) => {
    const proc = spawn(bin, args, {
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    if (opts.input) {
      proc.stdin.write(opts.input);
      proc.stdin.end();
    }

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
    }, opts.timeoutMs ?? 30_000);

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        stdout: stdout.slice(0, 8_000),
        stderr: stderr.slice(0, 2_000),
        durationMs: Date.now() - start,
        exitCode: code,
      });
    });

    proc.on("error", () => {
      clearTimeout(timer);
      resolve({
        ok: false,
        stdout: "",
        stderr: `binary not found: ${bin}`,
        durationMs: Date.now() - start,
        exitCode: -1,
      });
    });
  });
}
