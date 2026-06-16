# 17 · Extra AI Models — GLM 5.2 & Fusion (Optional)

Two more brains you can chat with, each in its own sidebar tab. They're simple: paste one API key and the tab works — no app to install.

- **GLM 5.2** — Zhipu's GLM-5.2 model (strong, great value).
- **Fusion** — OpenRouter's "Fusion" model (it blends several top models for one strong answer).

Use the one(s) you like, skip the rest. A tab with no key just stays quiet.

## A · GLM 5.2
1. Get a key from **https://z.ai** (Zhipu) — sign up and copy your **API key**. *(You do this yourself — never let an AI enter your card.)*
2. Save it:
   ```bash
   mkdir -p ~/.hermes/profiles/glm-5-2
   echo 'GLM_API_KEY=your_key_here' > ~/.hermes/profiles/glm-5-2/.env
   chmod 600 ~/.hermes/profiles/glm-5-2/.env
   ```
3. Restart the dashboard → open the **GLM 5.2** tab and chat.

> Power-user note: the dashboard also accepts the key as a `GLM_API_KEY`, `ZAI_API_KEY`, or `Z_AI_API_KEY` environment variable if you prefer that over the profile file.

## B · Fusion
Fusion runs through **OpenRouter** — so if you already set up Hermes (`4-HERMES.md`), **you're done**; it reuses that same `OPENROUTER_API_KEY`.

If you haven't:
1. Get a key from **https://openrouter.ai** (add a few dollars of credit).
2. Save it:
   ```bash
   mkdir -p ~/.hermes/profiles/main
   echo 'OPENROUTER_API_KEY=your_key_here' > ~/.hermes/profiles/main/.env
   chmod 600 ~/.hermes/profiles/main/.env
   ```
3. Restart the dashboard → open the **Fusion** tab and chat.

## Try it
Open either tab and ask the same question you'd ask Claude — compare the answers. Different models have different strengths; it's handy to have a second (and third) opinion on tap.

## Done?
That's the extra models. For the installed coding agents (Claude, Codex, Gemini, etc.), see **`7-AGENT-CLIS.md`**; for Kimi, **`16-KIMI-CODE.md`**.
