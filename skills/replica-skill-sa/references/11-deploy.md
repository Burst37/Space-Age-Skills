# 11 Deploy: ship on the user's domain
Reads all of `replica/`. Writes `replica/deploy.md` (template `templates/preflight.md`, filled).

## Rules
- **Nothing goes live without the user's explicit go.** Show preflight results, then ask.
- User buys and signs in. Agent never buys domains, enters cards, types passwords, pastes live keys; it writes exact DNS records, env var names, commands.
- Not until rebranded: sweep must be clean. No exceptions.

## 1. Preflight (any failure stops the deploy; say which and why)
```bash
npx playwright test                                                      # stage 6
python3 $S/scripts/parity.py replica/features.csv --gate --fail-under 80 # stage 7
python3 $S/scripts/sweep.py . --config replica/brand.json                # stage 9, exit 0
python3 $S/scripts/listing.py replica/launch/listing.json --config replica/brand.json  # if stores
npm run build
```
Paste each command's real output + exit code into `deploy.md`. By hand: no open S1/S2; privacy + terms live listing every processor; EU/UK cookie banner if non-essential cookies; account deletion works; favicon, titles, OG image are yours.

## 2. Production services
- Separate production DB project (never dev), backups on, migrations run by the deploy.
- Host env vars match `.env.example`; live keys only here.
- Stripe live: recreate products/prices, production webhook + signing secret, one real purchase then refund.
- OAuth: production domain in every provider's redirect URIs + origins; Google sensitive scopes approved, else only test users can sign in.
- Email sending domain verified.

## 3. Host + domain
Default Vercel (else Netlify, Cloudflare Pages, Fly, Render); repo connected, `main` deploys, PRs get previews. After the user buys the domain:

| record | name | value |
|---|---|---|
| A | @ | host apex IP (Vercel: domain settings) |
| CNAME | www | host target (Vercel: `cname.vercel-dns.com`) |
| TXT | @ / sub | host verification, if asked |

Email DNS from provider: SPF (TXT), DKIM (CNAME/TXT), DMARC `v=DMARC1; p=none; rua=mailto:you@yourdomain` -> `quarantine` once reports clean. Missing = mail goes to spam. One canonical host (apex or www), redirect the other. Check HTTPS.

## 4. Watch
Error tracking, uptime checks (home + core-flow API), logs, privacy-friendly analytics, alerts to user. Do the core flow on live yourself; user does it on their phone.

## 5. Mobile (if any)
Expo: `eas build` -> `eas submit` (TestFlight, Play internal). Native: Xcode archive -> App Store Connect; Gradle bundle -> Play Console. User owns dev accounts (Apple $99/yr, Google $25 once). Beta first, then review with the stage-10 listing.

Output: `deploy.md` with every check + result, live URL, DNS set, first-week watch list.
