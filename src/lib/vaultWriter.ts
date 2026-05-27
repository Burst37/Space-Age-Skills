import { run } from "./runner";
import { config } from "./config";
import path from "path";
import fs from "fs";

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Direct file write fallback when obsidian CLI unavailable
function vaultPath(...segments: string[]): string {
  return path.join(config.vaultRoot, ...segments);
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export async function appendJournalEntry(content: string): Promise<void> {
  const date = todayISO();
  const notePath = `Journal/${date}.md`;

  // Try obsidian CLI first
  const r = await run("obsidian", [
    config.vaultName,
    "note",
    "append",
    `path=${notePath}`,
    `content=${content}`,
  ], { timeoutMs: 5000 });

  if (!r.ok) {
    // Fallback: direct file write
    const fp = vaultPath("Journal", `${date}.md`);
    ensureDir(fp);
    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, `# Journal — ${date}\n\n`);
    }
    fs.appendFileSync(fp, `\n${content}\n`);
  }
}

export async function readJournal(date: string): Promise<string> {
  const notePath = `Journal/${date}.md`;
  const r = await run("obsidian", [config.vaultName, "note", "get", `path=${notePath}`], { timeoutMs: 5000 });
  if (r.ok && r.stdout) return r.stdout;

  const fp = vaultPath("Journal", `${date}.md`);
  return fs.existsSync(fp) ? fs.readFileSync(fp, "utf-8") : "";
}

export async function listJournalDays(): Promise<string[]> {
  const dir = vaultPath("Journal");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".md"))
    .map(f => f.replace(".md", ""))
    .sort()
    .reverse();
}

export async function appendToVault(notePath: string, content: string): Promise<void> {
  const r = await run("obsidian", [
    config.vaultName,
    "note",
    "append",
    `path=${notePath}`,
    `content=${content}`,
  ], { timeoutMs: 5000 });

  if (!r.ok) {
    const fp = vaultPath(notePath);
    ensureDir(fp);
    fs.appendFileSync(fp, `\n${content}\n`);
  }
}

export async function appendDailyLog(content: string): Promise<void> {
  const date = todayISO();
  const r = await run("obsidian", [
    config.vaultName,
    "daily",
    "append",
    `content=${content}`,
  ], { timeoutMs: 5000 });

  if (!r.ok) {
    const fp = vaultPath("Daily Notes", `${date}.md`);
    ensureDir(fp);
    if (!fs.existsSync(fp)) {
      fs.writeFileSync(fp, `# ${date}\n\n`);
    }
    fs.appendFileSync(fp, `\n${content}\n`);
  }
}
