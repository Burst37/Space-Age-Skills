import { execSync } from "child_process";
import path from "path";
import fs from "fs";

function which(bin: string): string | null {
  try {
    return execSync(`which ${bin}`, { stdio: ["pipe", "pipe", "pipe"] })
      .toString()
      .trim() || null;
  } catch {
    return null;
  }
}

function expandHome(p: string): string {
  if (p.startsWith("~")) return path.join(process.env.HOME || "/root", p.slice(1));
  return p;
}

function findVault(): string {
  const env = process.env.AGENTIC_OS_VAULT;
  if (env) return expandHome(env);
  const candidates = [
    "~/Documents/Obsidian Vault",
    "~/Obsidian",
    "~/Obsidian Vault",
    "~/vault",
  ];
  for (const c of candidates) {
    const p = expandHome(c);
    if (fs.existsSync(p)) return p;
  }
  return expandHome("~/Obsidian Vault");
}

export const config = {
  // ─── CLI Agents ────────────────────────────────────────────────────────────
  claude:      process.env.AGENTIC_OS_CLAUDE_BIN      || which("claude")      || "claude",
  hermes:      process.env.AGENTIC_OS_HERMES_BIN      || which("hermes")      || "hermes",
  gemini:      process.env.AGENTIC_OS_GEMINI_BIN      || which("gemini")      || "gemini",
  antigravity: process.env.AGENTIC_OS_ANTIGRAVITY_BIN || which("agy")         || "agy",
  codex:       process.env.AGENTIC_OS_CODEX_BIN       || which("codex")       || "codex",
  openclaw:    process.env.AGENTIC_OS_OPENCLAW_BIN    || which("openclaw")    || "openclaw",

  // ─── API Agents (OpenRouter) ──────────────────────────────────────────────
  openrouterApiKey:  process.env.OPENROUTER_API_KEY || "",
  deepseekApiKey:    process.env.DEEPSEEK_API_KEY   || "",
  geminiApiKey:      process.env.GEMINI_API_KEY     || "",
  openaiApiKey:      process.env.OPENAI_API_KEY     || "",
  minimaxApiKey:     process.env.MINIMAX_API_KEY    || "",

  // ─── VPS / SSH ────────────────────────────────────────────────────────────
  vpsHost:    process.env.VPS_HOST     || "146.190.78.120",
  vpsUser:    process.env.VPS_USER     || "root",
  vpsPort:    parseInt(process.env.VPS_PORT || "22", 10),
  vpsKeyPath: expandHome(process.env.VPS_KEY_PATH || "~/.ssh/id_rsa"),

  // ─── Obsidian ─────────────────────────────────────────────────────────────
  vaultRoot:        findVault(),
  vaultName:        process.env.OBSIDIAN_VAULT_NAME || "Space Age",
  openclawAgent:    process.env.AGENTIC_OS_OPENCLAW_AGENT || "main",
  goalCategories:   ["Pipeline", "Clients", "Content", "Dev", "Health", "Finance"],
  locationLabel:    process.env.AGENTIC_OS_LOCATION || "Dallas",

  // ─── Model routing ────────────────────────────────────────────────────────
  apiAgents: {
    deepseek: {
      id: "deepseek",
      label: "DeepSeek V4 Pro",
      model: "deepseek/deepseek-prover-v2",
      baseUrl: "https://api.deepseek.com/v1",
      keyEnv: "DEEPSEEK_API_KEY",
      color: "#7DF9FF",
      use: "Primary coding — 1.6T params, 1M context",
    },
    minimax: {
      id: "minimax",
      label: "Minimax 2.7",
      model: "minimax/minimax-text-01",
      baseUrl: "https://openrouter.ai/api/v1",
      keyEnv: "OPENROUTER_API_KEY",
      color: "#A855F7",
      use: "Long-context, creative tasks",
    },
    gemma: {
      id: "gemma",
      label: "Gemma 3",
      model: "google/gemma-3-27b-it",
      baseUrl: "https://openrouter.ai/api/v1",
      keyEnv: "OPENROUTER_API_KEY",
      color: "#00ff88",
      use: "Fast, cheap — batch tasks",
    },
  },
} as const;

export type ApiAgentId = keyof typeof config.apiAgents;
