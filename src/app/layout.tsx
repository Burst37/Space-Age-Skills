import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Space Age Agent OS",
  description: "Mission Control — All agents. One dashboard. Zero data leaves.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* VL-01 Standard: Fontsource CDN only — no Google Fonts */}
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5.0.20/index.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5.0.18/index.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.1.0/index.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css" rel="stylesheet" />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
