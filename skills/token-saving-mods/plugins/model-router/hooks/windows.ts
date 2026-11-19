import type { EngineInterface } from 'claude-code'

// ---- Windows ----
// The Mac build runs /bin/sh and Unix tools, which Windows does not have. On Windows the
// same jobs run as PowerShell scripts: values go in through env (Windows argv quoting
// breaks on quotes), text goes in as base64 on stdin, and stdout comes back as UTF-8.
let win: boolean | undefined
export async function isWin($: EngineInterface): Promise<boolean> {
  if (win === undefined) win = (await $.env.get('OS').catch(() => undefined)) === 'Windows_NT'
  return win
}
export function b64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let raw = ''
  for (let i = 0; i < bytes.length; i += 1) raw += String.fromCharCode(bytes[i] ?? 0)
  return btoa(raw)
}
export function ps($: EngineInterface, script: string, env: Record<string, string> = {}, init: { stdin?: string; timeoutMs?: number } = {}) {
  const full = `$ErrorActionPreference='Stop'; [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); ${script}`
  let utf16 = ''
  for (let i = 0; i < full.length; i += 1) utf16 += String.fromCharCode(full.charCodeAt(i) & 255, full.charCodeAt(i) >> 8)
  return $.process.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', btoa(utf16)], { env, ...init })
}
// Windows paths as the Mac code compares them: forward slashes, drive letter upper case,
// and Git Bash's /c/... spelled C:/...
export const slashed = (p: string) =>
  p
    .replace(/\\/g, '/')
    .replace(/^\/([a-zA-Z])\//, (_, d: string) => `${d.toUpperCase()}:/`)
    .replace(/^([a-z]):\//, (_, d: string) => `${d.toUpperCase()}:/`)
export async function removeFile($: EngineInterface, path: string) {
  if (await isWin($)) await ps($, 'Remove-Item -LiteralPath $env:MODS_PATH -Force -ErrorAction SilentlyContinue', { MODS_PATH: path })
  else await $.process.run(['/bin/rm', '-f', path])
}
// Opens a file with its default app. Explorer wants backslashes in a file path.
export async function openFile($: EngineInterface, path: string) {
  if (await isWin($)) return ps($, 'Start-Process -FilePath $env:MODS_PATH', { MODS_PATH: path.replace(/\//g, '\\') }, { timeoutMs: 10_000 })
  return $.process.run(['/usr/bin/open', path], { timeoutMs: 10_000 })
}
// Appends text to a file, making its folder; waits while another writer holds the file.
export const PS_APPEND = `$p=$env:MODS_PATH; $d=[IO.Path]::GetDirectoryName($p); if ($d) { [void][IO.Directory]::CreateDirectory($d) }
$t=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd().Trim()))
for ($i=0; ; $i++) { try { [IO.File]::AppendAllText($p, $t, [Text.UTF8Encoding]::new($false)); break } catch { if ($i -ge 40) { throw }; Start-Sleep -Milliseconds 50 } }`
