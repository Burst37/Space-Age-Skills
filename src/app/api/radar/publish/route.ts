import { run } from "@/lib/runner";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { config } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_WORKSPACE = os.homedir();
const RADAR_DIR = path.join(os.homedir(), ".agentic-os", "radar");
const PUB_STATUS = path.join(RADAR_DIR, "publish-status.json");
const PUBLISHED_LOG = path.join(RADAR_DIR, "published.json");
const WP_CONFIG = path.join(os.homedir(), ".agentic-os", "wordpress.json");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

interface WpSite { base: string; user: string; app_pw: string; category: number | null }
interface PublishProfile { author?: string; bio?: string[]; ctas?: { label: string; url: string }[]; footerHtml?: string }
interface WpConfig { default: string; indexceptional: { email: string; key: string }; sites: Record<string, WpSite>; profile?: PublishProfile }
interface PubResult { site: string; url: string; editUrl: string; title: string }
interface PubStatus { running: boolean; phase?: string; headline?: string; sites?: string[]; status?: string; results?: PubResult[]; indexed?: boolean; error?: string; startedAt?: string; endedAt?: string }

async function readPub(): Promise<PubStatus> {
  try { return JSON.parse(await readFile(PUB_STATUS, "utf8")); } catch { return { running: false }; }
}
async function writePub(s: PubStatus) {
  try { await mkdir(RADAR_DIR, { recursive: true }); await writeFile(PUB_STATUS, JSON.stringify(s), "utf8"); } catch { /* best effort */ }
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 6).join("-").slice(0, 70);
}

function tweetEmbed(url: string): string {
  const m = String(url).match(/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,20})\/status\/(\d{5,25})/i);
  if (!m) return "";
  const tw = `https://twitter.com/${m[1]}/status/${m[2]}?ref_src=twsrc%5Etfw`;
  return `\n<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">See the original announcement on X 👇</p>&mdash; @${m[1]} <a href="${tw}">View the post on X →</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n`;
}

function withTweet(html: string, embed: string): string {
  if (!embed) return html.replace(/\[\[TWEET\]\]/gi, "");
  if (/\[\[TWEET\]\]/i.test(html)) return html.replace(/\[\[TWEET\]\]/i, embed);
  let n = 0;
  return html.replace(/<\/p>/gi, (m) => (++n === 2 ? m + embed : m));
}

async function wpPublish(site: WpSite, siteHost: string, a: { title: string; meta: string; html: string; slug: string }, status: string) {
  const auth = "Basic " + Buffer.from(`${site.user}:${site.app_pw}`).toString("base64");
  const body: Record<string, unknown> = { title: a.title, content: a.html, status, slug: a.slug, excerpt: a.meta };
  if (site.category) body.categories = [site.category];
  const r = await fetch(`${site.base}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth, "User-Agent": UA },
    body: JSON.stringify(body),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { message?: string })?.message || `WordPress returned ${r.status}`);
  const id = (d as { id: number }).id;
  return { url: (d as { link: string }).link, id, editUrl: `https://${siteHost}/wp-admin/post.php?post=${id}&action=edit` };
}

async function runPublish(sig: { headline: string; why_now: string; angle: string; hook: string; url: string }, hosts: string[], status: string) {
  const startedAt = new Date().toISOString();
  const results: PubResult[] = [];
  await writePub({ running: true, headline: sig.headline, sites: hosts, status, phase: "Starting…", results, startedAt });
  try {
    const cfg: WpConfig = JSON.parse(await readFile(WP_CONFIG, "utf8"));
    const slug = slugify(sig.headline) || `ai-news-${Date.now()}`;
    const embed = tweetEmbed(sig.url);
    const profile = cfg.profile || {};
    const author = profile.author || (config.userName && config.userName !== "You" ? config.userName : "the author");
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      const site = cfg.sites[host];
      if (!site) continue;
      await writePub({ running: true, headline: sig.headline, sites: hosts, status, phase: `Writing for ${host}…`, results, startedAt });
      const prompt = `You are ${author}'s SEO blog writer. Write a ~1,400 word publish-ready SEO article about this trending AI story.\n\nSTORY: ${sig.headline}\nWHY HOT: ${sig.why_now}\nANGLE: ${sig.angle}\n\nOUTPUT EXACTLY:\nTITLE: <=60 char CTR title\nMETA: 140-155 char meta description\n===HTML===\n<the article HTML>`;
      const res = await run("hermes", ["-z", prompt], { cwd: HERMES_WORKSPACE, timeoutMs: 300_000 });
      const raw = (res.stdout || "").replace(/```[a-z]*\n?/gi, "");
      const split = raw.split(/===HTML===/i);
      if (split.length < 2) throw new Error(`Writer returned malformed output for ${host}`);
      const title = (split[0].match(/^TITLE:\s*(.+)$/im)?.[1] || "").trim().slice(0, 120);
      const meta = (split[0].match(/^META:\s*(.+)$/im)?.[1] || "").trim().slice(0, 200);
      const html = withTweet(split.slice(1).join("===HTML===").trim(), embed);
      if (!title || !html || html.length < 400) throw new Error(`Malformed article for ${host}`);
      await writePub({ running: true, headline: sig.headline, sites: hosts, status, phase: `Publishing to ${host}…`, results, startedAt });
      const pub = await wpPublish(site, host, { title, meta, html, slug }, status);
      results.push({ site: host, url: pub.url, editUrl: pub.editUrl, title });
    }
    await writePub({ running: false, headline: sig.headline, sites: hosts, status, phase: "Done", results, startedAt, endedAt: new Date().toISOString() });
    if (results.length) {
      let log: unknown[] = [];
      try { log = JSON.parse(await readFile(PUBLISHED_LOG, "utf8")); } catch { /* first entry */ }
      if (!Array.isArray(log)) log = [];
      log.unshift({ at: new Date().toISOString(), headline: sig.headline, status, results });
      await mkdir(RADAR_DIR, { recursive: true });
      await writeFile(PUBLISHED_LOG, JSON.stringify(log.slice(0, 200), null, 2), "utf8");
    }
  } catch (e) {
    await writePub({ running: false, headline: sig.headline, sites: hosts, status, phase: "Failed", results, error: (e as Error).message, startedAt, endedAt: new Date().toISOString() });
  }
}

export async function GET() {
  return Response.json(await readPub(), { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const st = await readPub();
  if (st.running) return Response.json({ ok: true, already: true });
  let cfg: WpConfig;
  try { cfg = JSON.parse(await readFile(WP_CONFIG, "utf8")); }
  catch { return Response.json({ ok: false, error: "No WordPress config found at ~/.agentic-os/wordpress.json" }, { status: 400 }); }
  const hosts = body.sites === "all" ? Object.keys(cfg.sites) : (Array.isArray(body.sites) ? body.sites : [cfg.default]).filter(Boolean);
  if (!hosts.length) return Response.json({ ok: false, error: "No WordPress sites configured." }, { status: 400 });
  runPublish(body, hosts, body.status || "publish").catch(() => {});
  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}