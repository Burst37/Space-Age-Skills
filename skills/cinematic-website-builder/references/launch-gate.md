# Launch gate (G9)

Run against the **live production domain** right after DNS and deploy, and against the preview beforehand
(`--preview`) to see what has to flip.

```bash
node scripts/launch-check.mjs https://www.example.com --pages /,/services/respite-care,/contact --out handoff/launch-report.md
node scripts/launch-check.mjs https://example-git-main.vercel.app --domain example.com --preview
```

**Fails on**: robots.txt `Disallow: /` (for `*`, Googlebot or Bingbot) · `<meta name="robots|googlebot" content="noindex">`
· `X-Robots-Tag: noindex` · canonical on another host (old domain, `*.vercel.app`, `*.pages.dev`, `*.workers.dev`,
localhost) · sitemap missing or listing another host · `llms.txt` linking another host · no favicon · non-200 pages
· a redirect to another host. **Warns on**: AI retrieval bots blocked, no llms.txt, robots.txt not naming the sitemap,
no apple-touch-icon / theme-color / og:image, http not redirecting to https.

## Preview vs production checklist
| Item | Preview | Production |
|---|---|---|
| robots.txt | `Disallow: /` is fine (Vercel adds noindex to previews) | `Allow: /`, names the sitemap, AI retrieval bots allowed |
| X-Robots-Tag / meta robots | noindex expected | none |
| canonical | production domain (never the preview host) | production domain |
| sitemap.xml / llms.txt URLs | production domain | production domain |
| analytics / forms | test mode | live keys, test one submission |
| favicon set, theme-color, OG image | present | present (launch-check) |
| redirects | — | old URLs 301 → new; http → https; apex ↔ www chosen |
| Search Console / Bing | — | sitemap submitted, IndexNow ping |

Astonishing Touch preview (Nov 2026) fails exactly where expected: robots `Disallow: /`, X-Robots-Tag noindex,
meta noindex, no favicon. Those are fine on a preview, but each one has to flip before launch.

## Hosting
- **Vercel** (Chuma's default for Next.js).
- **Cloudflare Workers (free plan)** for static or Astro builds: `npx wrangler deploy` with static assets
  (`assets.directory = "./dist"` in `wrangler.toml`). The free plan covers small business sites. Set the custom domain in
  the dashboard, then run launch-check on it. A `*.workers.dev` canonical is a launch failure.
- Cloudflare Pages remains fine for existing projects; Workers static assets is the current path.
