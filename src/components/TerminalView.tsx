"use client";
import { useEffect, useRef, useState } from "react";

export default function TerminalView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<unknown>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let terminal: { open: (el: HTMLElement) => void; write: (d: string) => void; onData: (cb: (d: string) => void) => void; dispose: () => void } | null = null;

    async function init() {
      if (!containerRef.current) return;

      // Dynamically import xterm to avoid SSR issues
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      const { WebLinksAddon } = await import("@xterm/addon-web-links");

      terminal = new Terminal({
        theme: {
          background:  "#050508",
          foreground:  "#f0f4ff",
          cursor:      "#FF6B00",
          selectionBackground: "rgba(255,107,0,0.3)",
          black:       "#050508",
          brightBlack: "#3a3a4a",
          red:         "#ff4466",
          green:       "#00ff88",
          yellow:      "#f59e0b",
          blue:        "#7DF9FF",
          magenta:     "#bf5af2",
          cyan:        "#7DF9FF",
          white:       "#f0f4ff",
          brightWhite: "#ffffff",
        },
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        fontSize: 13,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: "block",
        scrollback: 10000,
      }) as typeof terminal;

      const fitAddon = new FitAddon();
      terminal!.loadAddon(fitAddon as unknown as Parameters<typeof terminal.loadAddon>[0]);
      terminal!.loadAddon(new WebLinksAddon() as unknown as Parameters<typeof terminal.loadAddon>[0]);
      terminal!.open(containerRef.current!);
      fitAddon.fit();
      termRef.current = terminal;

      // Resize observer
      const ro = new ResizeObserver(() => fitAddon.fit());
      ro.observe(containerRef.current!);

      // Welcome banner
      terminal!.write("\x1b[38;2;255;107;0m");
      terminal!.write("╔══════════════════════════════════════════════════╗\r\n");
      terminal!.write("║   SPACE AGE AGENT OS — VPS TERMINAL              ║\r\n");
      terminal!.write("║   Connecting to 146.190.78.120                   ║\r\n");
      terminal!.write("╚══════════════════════════════════════════════════╝\r\n");
      terminal!.write("\x1b[0m\r\n");

      // Connect WebSocket
      setStatus("connecting");
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const ws = new WebSocket(`${proto}//${window.location.host}/api/terminal/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        terminal!.write("\x1b[32m● Connected\x1b[0m\r\n\r\n");
      };

      ws.onmessage = (e) => {
        terminal!.write(typeof e.data === "string" ? e.data : new Uint8Array(e.data as ArrayBuffer));
      };

      ws.onclose = () => {
        setStatus("disconnected");
        terminal!.write("\r\n\x1b[33m● Connection closed\x1b[0m\r\n");
      };

      ws.onerror = () => {
        setError("WebSocket connection failed. Ensure the custom Next.js server is running (server.ts).");
        setStatus("disconnected");
        terminal!.write("\r\n\x1b[31m● WebSocket error — see console\x1b[0m\r\n");
        terminal!.write("\x1b[33mNote: SSH terminal requires custom server.ts. Run: npx ts-node server.ts\x1b[0m\r\n");
      };

      terminal!.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      });

      return () => { ro.disconnect(); };
    }

    init();

    return () => {
      wsRef.current?.close();
      if (termRef.current) (termRef.current as { dispose: () => void }).dispose();
    };
  }, []);

  const statusColor = status === "connected" ? "var(--green)" : status === "connecting" ? "var(--orange)" : "var(--red)";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px 24px" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 14, marginBottom: 2 }}>VPS TERMINAL</h1>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--fg-muted)" }}>
            root@146.190.78.120 · Hermes Agent
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`led ${status === "connected" ? "led--online" : status === "connecting" ? "led--busy" : "led--offline"}`} />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: statusColor }}>
            {status.toUpperCase()}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="btn-ghost"
            style={{ fontSize: 10, padding: "4px 10px" }}
          >RECONNECT</button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: 12, padding: "10px 14px",
          background: "var(--red-dim)", border: "1px solid var(--red)",
          borderRadius: 6, fontFamily: "DM Sans, sans-serif",
          fontSize: 12, color: "var(--fg)",
        }}>
          ⚠ {error}
          <div style={{ marginTop: 6, fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--fg-muted)" }}>
            Add <code>server.ts</code> to your project root and run with <code>npx ts-node server.ts</code>
          </div>
        </div>
      )}

      {/* Terminal */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          background: "#050508",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          padding: "8px",
        }}
      />
    </div>
  );
}
