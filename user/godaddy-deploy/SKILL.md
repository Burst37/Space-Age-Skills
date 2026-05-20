---
name: godaddy-deploy
display_name: SPACE AGE — GoDaddy Deploy
version: 1.0.0
last_updated: 2026-05
description: >
  Deploy a website to GoDaddy shared hosting (cPanel/FTP) and manage DNS records
  via the GoDaddy REST API. Covers the full pipeline: build → FTP upload to
  public_html → DNS verification/update. Works with any static site, WordPress
  export, or PHP project targeting GoDaddy's cPanel hosting.
trigger_phrases:
  - deploy to godaddy
  - upload to godaddy
  - godaddy hosting
  - godaddy ftp
  - godaddy dns
  - point domain to
  - configure dns godaddy
  - publish to my domain
  - godaddy deploy
---

# GODADDY DEPLOY SKILL
## Space Age AI Solutions — GoDaddy Hosting + DNS Automation

Full deployment pipeline for GoDaddy-hosted websites: FTP file upload + DNS
management via the GoDaddy REST API. The GoDaddy MCP handles domain discovery;
this skill handles the actual upload and DNS wiring.

---

## PREREQUISITES

Collect these before running any step:

| Item | Where to Find It |
|------|-----------------|
| `GODADDY_API_KEY` | GoDaddy Developer Portal → My Keys |
| `GODADDY_API_SECRET` | Same page as API key |
| `GODADDY_DOMAIN` | The domain you own (e.g. `example.com`) |
| FTP Host | cPanel → FTP Accounts, or use `ftp.yourdomain.com` |
| FTP Username | Your cPanel username |
| FTP Password | Your cPanel password |
| Upload path | Usually `/public_html/` for the root domain |

Export as env vars (never hardcode):

```bash
export GODADDY_API_KEY="your_key_here"
export GODADDY_API_SECRET="your_secret_here"
export GODADDY_DOMAIN="yourdomain.com"
export GODADDY_FTP_HOST="ftp.yourdomain.com"
export GODADDY_FTP_USER="your_cpanel_user"
export GODADDY_FTP_PASS="your_cpanel_password"
export GODADDY_FTP_PATH="/public_html/"
```

---

## MCP TOOLS (GoDaddy MCP — already connected)

| Tool | When to Use |
|------|-------------|
| `domains_check_availability` | Confirm a domain is registered before deploying |
| `domains_suggest` | Find alternative domains if the target is taken |

Use `domains_check_availability` at the start of every deploy workflow to
confirm the domain exists and is active before touching DNS or uploading files.

---

## STEP 1 — VERIFY DOMAIN IS ACTIVE

```bash
# Check domain status via GoDaddy API
curl -s -X GET \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  -H "Content-Type: application/json" \
  | jq '{domain: .domain, status: .status, expires: .expires, nameServers: .nameServers}'
```

Expected `status`: `ACTIVE`. If not active, stop and alert the user.

---

## STEP 2 — CHECK CURRENT DNS RECORDS

```bash
# List all A and CNAME records
curl -s -X GET \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records/A/@" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  | jq .

curl -s -X GET \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records/CNAME/www" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  | jq .
```

---

## STEP 3 — UPDATE DNS TO POINT TO GODADDY HOSTING

GoDaddy shared hosting uses their parked IP. If the domain is already on
GoDaddy's nameservers (ns1.domaincontrol.com / ns2.domaincontrol.com), DNS is
pre-configured. Only run this if you need to update records manually.

```bash
# Update the root A record to a specific IP (replace HOSTING_IP)
HOSTING_IP="YOUR_SERVER_IP"  # From cPanel → Server Information

curl -s -X PUT \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records/A/@" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d "[{\"data\": \"${HOSTING_IP}\", \"ttl\": 600}]"

# Update www CNAME
curl -s -X PUT \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records/CNAME/www" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d "[{\"data\": \"@\", \"ttl\": 600}]"
```

To point to an external host (Vercel, Cloudflare, etc.) instead, update the
`data` field to the external host's IP or CNAME target.

---

## STEP 4 — BUILD YOUR SITE

Run whatever build command your project uses:

```bash
# Static site (no build)
# Skip to Step 5 — upload the files directly

# Next.js static export
npm run build && npm run export   # output: ./out/

# Vite / React
npm run build                     # output: ./dist/

# Generic
npm run build                     # check package.json for output dir
```

Note the **output directory** — you'll upload its contents in Step 5.

---

## STEP 5 — FTP UPLOAD TO GODADDY HOSTING

Use `lftp` for reliable recursive FTP upload. Install if needed: `apt-get install lftp`.

```bash
# Upload entire build output directory to public_html
LOCAL_BUILD_DIR="./dist"   # change to your actual output dir

lftp -c "
  open -u ${GODADDY_FTP_USER},${GODADDY_FTP_PASS} ${GODADDY_FTP_HOST}
  set ssl:verify-certificate no
  mirror --reverse --delete --verbose \
    ${LOCAL_BUILD_DIR}/ \
    ${GODADDY_FTP_PATH}
  bye
"
```

Flags:
- `--reverse` — upload local → remote (not download)
- `--delete` — remove files on server that no longer exist locally
- `--verbose` — show each file being transferred

For a single file or subdirectory:
```bash
lftp -c "
  open -u ${GODADDY_FTP_USER},${GODADDY_FTP_PASS} ${GODADDY_FTP_HOST}
  put -O ${GODADDY_FTP_PATH} ./index.html
  bye
"
```

---

## STEP 6 — VERIFY DEPLOYMENT

```bash
# Check HTTP response from the domain
curl -sI "https://${GODADDY_DOMAIN}" | head -5

# Or check the raw content
curl -s "https://${GODADDY_DOMAIN}" | head -20
```

DNS propagation can take up to 24h for new records, but GoDaddy's own nameservers
usually propagate within minutes. Use a propagation checker if the site doesn't
resolve immediately.

---

## FULL WORKFLOW (one-shot)

```bash
# 1. Export credentials (do this first in every session)
export GODADDY_API_KEY="..." GODADDY_API_SECRET="..."
export GODADDY_DOMAIN="..." GODADDY_FTP_HOST="..."
export GODADDY_FTP_USER="..." GODADDY_FTP_PASS="..."
export GODADDY_FTP_PATH="/public_html/"

# 2. Verify domain active
curl -s "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" | jq .status

# 3. Build
npm run build

# 4. Upload
LOCAL_BUILD_DIR="./dist"
lftp -c "open -u ${GODADDY_FTP_USER},${GODADDY_FTP_PASS} ${GODADDY_FTP_HOST}; mirror --reverse --delete ${LOCAL_BUILD_DIR}/ ${GODADDY_FTP_PATH}; bye"

# 5. Verify
curl -sI "https://${GODADDY_DOMAIN}"
```

---

## ROUTING: GODADDY vs VERCEL HOSTING

| Situation | Use |
|-----------|-----|
| GoDaddy cPanel/shared hosting | This skill — FTP upload |
| Static site on Vercel | `deploy_to_vercel` MCP → update GoDaddy DNS to Vercel IP |
| WordPress on GoDaddy | FTP upload + MySQL import via cPanel phpMyAdmin |
| Just need DNS changes only | Steps 2–3 of this skill only |

---

## DNS RECORD REFERENCE

Common DNS updates via GoDaddy API:

```bash
# Add a TXT record (for SSL, Google verification, etc.)
curl -s -X PATCH \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '[{"type":"TXT","name":"@","data":"google-site-verification=XXXXX","ttl":600}]'

# List all records
curl -s "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" | jq .

# Delete a specific record type/name
curl -s -X DELETE \
  "https://api.godaddy.com/v1/domains/${GODADDY_DOMAIN}/records/TXT/@" \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}"
```

---

## NEVER DO
- Never hardcode `GODADDY_API_KEY` or FTP credentials in skill files or code
- Never run `--delete` on FTP mirror without confirming the build output is complete
- Never overwrite `/public_html/` without backing up existing content first (use `mirror` without `--delete` on first deploy)
- Never push to production domain before testing on a staging subdomain
- Never expose GoDaddy API key in curl output — pipe to `jq` or `/dev/null` as needed

---

## SKILL CONNECTIONS
- **sa-orchestrator** — routes "deploy", "publish", "upload to domain" triggers here
- **vercel-deploy** — alternative if user prefers Vercel hosting over GoDaddy cPanel
- **brand-extractor** — verify live site renders brand correctly post-deploy
