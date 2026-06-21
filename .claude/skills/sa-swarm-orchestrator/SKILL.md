---
name: sa-swarm-orchestrator
description: >
  Space Age 5-agent swarm system. Runs parallel website builds across DeepSeek V4 Pro,
  DeepSeek V4 Flash, Minimax 2.7, Gemini Flash, and Gemma simultaneously. Controlled via
  Hermes dashboard on VPS (146.190.78.120:3000). Load when running multi-site batches,
  parallel builds, or swarm generation. Cost per site ~$0.06-0.14.
---

# SA Swarm Orchestrator OS

## Swarm Architecture

```
Claude (Driver — stays in front of user)
├── Agent 1: DeepSeek V4 Pro    — architecture, complex code, primary builder
├── Agent 2: DeepSeek V4 Flash  — fast iteration, hot fixes
├── Agent 3: Minimax 2.7        — secondary builder, design-heavy sections
├── Agent 4: Gemini Flash        — tertiary builder, SEO + copy sections
└── Agent 5: Gemma              — QA agent, comparison + verification
```

## API Routing

```javascript
// DeepSeek V4 Pro
const deepseekPro = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});
const completion = await deepseekPro.chat.completions.create({
  model: 'deepseek-v4-pro',
  messages: [{ role: 'user', content: prompt }]
});

// DeepSeek V4 Flash (faster, cheaper)
const deepseekFlash = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});
await deepseekFlash.chat.completions.create({
  model: 'deepseek-v4-flash',
  messages: [...]
});

// Gemini Flash
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' });
const result = await model.generateContent(prompt);
```

## Task Routing Matrix

| Task Type | Primary | Secondary | QA |
|---|---|---|---|
| Full site build (Next.js) | DeepSeek Pro | Gemini Flash | Gemma |
| Hero section | DeepSeek Pro | Minimax 2.7 | Claude review |
| GSAP animations | DeepSeek Flash | Claude | Gemma |
| Copy + SEO content | Gemini Flash | Claude | sa-stop-slop |
| Shopify Liquid | DeepSeek Pro | DeepSeek Flash | Gemma |
| Supabase schema | DeepSeek Pro | Claude | Codex review |
| Credit letters | Claude (only) | — | sa-stop-slop |
| Artist content | Claude (only) | Gemini Flash | sa-stop-slop |

## Hermes Telegram Commands

Send from Telegram to Hermes Agent (VPS port 3400):

```
/build [client_name] [website_type]
  → Starts a new 5-agent website build

/status
  → Returns current build queue and agent status

/swarm [prompt]
  → Sends prompt to all 5 agents simultaneously

/compare
  → Runs all 5 on the same section, returns side-by-side output for review

/deploy [build_id]
  → Pushes approved build to Vercel

/pause
  → Stops current build queue

/resume
  → Resumes paused build

/log [build_id]
  → Returns build log for specific project
```

## Quality Gates

Every swarm build must pass before deploy:

```
GATE 1 — Visual Signature
[ ] Has jumbo typography (clamp-based hero size)
[ ] Has full-screen hero section (100vh+)
[ ] Has GSAP + Lenis initialized
[ ] Has scroll triggers on at least 3 sections
[ ] BG color is dark (not white default)

GATE 2 — Code Quality  
[ ] No console.log in production
[ ] No TODO comments
[ ] All images have alt text
[ ] Meta title and description present
[ ] No hardcoded API keys

GATE 3 — Performance
[ ] Hero image/video has poster attribute
[ ] Images use next/image with lazy loading
[ ] No render-blocking scripts in <head>
[ ] GSAP cleanup in all useEffect hooks

GATE 4 — Conversion
[ ] CTA above fold
[ ] Contact/booking mechanism present
[ ] Social proof in first 2 sections
[ ] Mobile CTA visible without scroll

GATE 5 — Motion
[ ] Reduced-motion fallback present
[ ] No infinite loops on body content
[ ] Hero entrance < 1.2s total
[ ] ScrollTrigger cleanup in useEffect return
```

## Cost Tracking

| Model | Input/1M | Output/1M | Full Site Est. |
|---|---|---|---|
| DeepSeek V4 Pro | $0.27 | $1.10 | ~$0.04-0.08 |
| DeepSeek V4 Flash | $0.07 | $0.28 | ~$0.01-0.02 |
| Minimax 2.7 | ~$0.10 | ~$0.40 | ~$0.02-0.04 |
| Gemini Flash | $0.075 | $0.30 | ~$0.01-0.02 |
| Gemma | Free/cheap | Free/cheap | ~$0.00-0.01 |
| **Total per site** | | | **~$0.06-0.14** |

## Swarm Prompt Template

```
SWARM BUILD REQUEST
Project: [CLIENT NAME]
Website Type: [TYPE]
Target Audience: [AUDIENCE]
Conversion Goal: [GOAL]

Brand Tokens:
[PASTE UNIVERSAL BUILD HANDOFF]

Build Task:
[SPECIFIC SECTION OR FULL SITE]

Output Requirements:
- Complete HTML/CSS/JS or Next.js component
- No placeholder content
- No TODO comments
- GSAP + Lenis initialized
- Reduced-motion fallback included
- Mobile-first responsive

Quality Gate:
After completion, self-check against the SA quality gates before submitting.
If any gate fails, fix it. Do not submit failing output.
```

## VPS Agent Dashboard

- Dashboard: `http://146.190.78.120:3000`
- API Proxy: `http://146.190.78.120:3400`
- PM2 process: `pm2 list` on VPS
- Logs: `pm2 logs hermes --lines 100`
