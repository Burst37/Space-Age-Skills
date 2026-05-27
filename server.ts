/**
 * Custom Next.js server — adds WebSocket SSH bridge for /api/terminal/ws
 * Run: npx ts-node --project tsconfig.server.json server.ts
 * Or:  npx tsx server.ts
 */
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import { Client as SshClient } from "ssh2";
import fs from "fs";
import path from "path";

const dev  = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const app  = next({ dev });
const handle = app.getRequestHandler();

// SSH config
const VPS_HOST    = process.env.VPS_HOST     || "146.190.78.120";
const VPS_USER    = process.env.VPS_USER     || "root";
const VPS_PORT    = parseInt(process.env.VPS_PORT || "22", 10);
const VPS_KEY_PATH = (process.env.VPS_KEY_PATH || "~/.ssh/id_rsa")
  .replace("~", process.env.HOME || "/root");

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "");
    if (pathname === "/api/terminal/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    const ssh = new SshClient();

    let stream: NodeJS.ReadWriteStream | null = null;

    // Try to read the SSH private key
    let privateKey: Buffer | undefined;
    try {
      privateKey = fs.readFileSync(VPS_KEY_PATH);
    } catch {
      ws.send("\x1b[31mSSH key not found at: " + VPS_KEY_PATH + "\x1b[0m\r\n");
      ws.send("\x1b[33mSet VPS_KEY_PATH in .env.local\x1b[0m\r\n");
    }

    ssh.on("ready", () => {
      ws.send("\x1b[32mSSH connection established\x1b[0m\r\n");
      ssh.shell({ term: "xterm-256color" }, (err, s) => {
        if (err) { ws.send(`\x1b[31mShell error: ${err.message}\x1b[0m\r\n`); return; }
        stream = s;
        s.on("data", (data: Buffer) => { if (ws.readyState === WebSocket.OPEN) ws.send(data); });
        s.on("close", () => { ws.close(); ssh.end(); });
        ws.on("message", (msg: Buffer | string) => { s.write(msg); });
        ws.on("close", () => { s.end(); ssh.end(); });
      });
    });

    ssh.on("error", (err) => {
      ws.send(`\x1b[31mSSH error: ${err.message}\x1b[0m\r\n`);
    });

    if (privateKey) {
      ssh.connect({
        host:       VPS_HOST,
        port:       VPS_PORT,
        username:   VPS_USER,
        privateKey: privateKey,
        readyTimeout: 10000,
      });
    }
  });

  server.listen(port, () => {
    console.log(`> Space Age Agent OS ready on http://localhost:${port}`);
    console.log(`> VPS Terminal WebSocket active — SSH target: ${VPS_USER}@${VPS_HOST}:${VPS_PORT}`);
  });
});
