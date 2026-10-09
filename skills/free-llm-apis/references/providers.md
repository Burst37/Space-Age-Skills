# Free LLM API providers — generated reference

Snapshot of `data/data.json` (`lastUpdated: 2026-10-05`) from `mnfst/awesome-free-llm-apis` (CC0). **Free tiers change weekly — treat every limit as a hint and re-check the provider page before depending on it.** Regenerate with `python3 -I scripts/generate_providers_md.py`.

Key variable names below are the Space Age convention (names only; values never enter chat, repos or memory notes).

| Provider | Type | Key needed? | Env var | OpenAI-compatible base URL |
|---|---|---|---|---|
| [Aion Labs](https://www.aionlabs.ai/app/api-keys/) 🇮🇱 | Provider API | Yes (free) | `AIONLABS_API_KEY` | `https://api.aionlabs.ai/v1` |
| [Cohere](https://dashboard.cohere.com/api-keys) 🇨🇦 | Provider API | Yes (free) | `COHERE_API_KEY` | `https://api.cohere.com/v2` |
| [Google Gemini](https://aistudio.google.com/app/apikey) 🇺🇸 | Provider API | Yes (free) | `GEMINI_API_KEY` | `https://generativelanguage.googleapis.com/v1beta/openai` |
| [Mistral AI](https://console.mistral.ai/api-keys) 🇫🇷 | Provider API | Yes (free) | `MISTRAL_API_KEY` | `https://api.mistral.ai/v1` |
| [Z AI (Zhipu AI)](https://open.bigmodel.cn/usercenter/apikeys) 🇨🇳 | Provider API | Yes (free) | `ZAI_API_KEY` | `https://open.bigmodel.cn/api/paas/v4` |
| [Cloudflare Workers AI](https://dash.cloudflare.com/profile/api-tokens) 🇺🇸 | Inference provider | Yes (free) | `CLOUDFLARE_API_TOKEN` | `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1` |
| [Groq](https://console.groq.com/keys) 🇺🇸 | Inference provider | Yes (free) | `GROQ_API_KEY` | `https://api.groq.com/openai/v1` |
| [Hugging Face](https://huggingface.co/settings/tokens) 🇺🇸 | Inference provider | Yes (free) | `HF_TOKEN` | `https://router.huggingface.co/v1` |
| [Kilo Code](https://app.kilo.ai/profile) 🇺🇸 | Inference provider | No (anonymous tier) | `KILO_API_KEY` | `https://api.kilo.ai/api/gateway` |
| [LLM7.io](https://token.llm7.io) 🇬🇧 | Inference provider | No (anonymous tier) | `LLM7_API_KEY` | `https://api.llm7.io/v1` |
| [ModelScope](https://modelscope.cn/my/myaccesstoken) 🇨🇳 | Inference provider | Yes (free) | `MODELSCOPE_API_KEY` | `https://api-inference.modelscope.cn/v1` |
| [NVIDIA NIM](https://build.nvidia.com/explore/discover) 🇺🇸 | Inference provider | Yes (free) | `NVIDIA_API_KEY` | `https://integrate.api.nvidia.com/v1` |
| [Ollama Cloud](https://ollama.com/settings/keys) 🇺🇸 | Inference provider | Yes (free) | `OLLAMA_API_KEY` | `https://ollama.com/v1` |
| [OpenRouter](https://openrouter.ai/keys) 🇺🇸 | Inference provider | Yes (free) | `OPENROUTER_API_KEY` | `https://openrouter.ai/api/v1` |
| [OVHcloud AI Endpoints](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) 🇫🇷 | Inference provider | No (anonymous tier) | `OVH_AI_ENDPOINTS_ACCESS_TOKEN` | `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1` |
| [SiliconFlow](https://cloud.siliconflow.cn/account/ak) 🇨🇳 | Inference provider | Yes (free) | `SILICONFLOW_API_KEY` | `https://api.siliconflow.cn/v1` |

---

## Aion Labs 🇮🇱

Permanent free tier, no credit card required. 15 RPM, 20K tokens/day. Specialized for roleplay and storytelling.

- Get a key / sign up: https://www.aionlabs.ai/app/api-keys/
- Catalog base URL (data.json): `https://api.aionlabs.ai/v1`
- OpenAI-style chat base URL: `https://api.aionlabs.ai/v1`
- Env var: `AIONLABS_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `aion-labs/aion-2.0` | 128K | 32K | Text (reasoning) | 15 RPM, 20K TPD |
| `aion-labs/aion-rp-llama-3.1-8b` | 32K | 32K | Text | 15 RPM, 20K TPD |
| `aion-labs/aion-3.0` | 128K | 32K | Text (reasoning) | 15 RPM, 20K TPD |
| `aion-labs/aion-3.0-mini` | 128K | 32K | Text (reasoning) | 15 RPM, 20K TPD |

## Cohere 🇨🇦

Free "Trial" API key, no credit card. 1,000 API calls/month. Non-commercial use only.

- Get a key / sign up: https://dashboard.cohere.com/api-keys
- Catalog base URL (data.json): `https://api.cohere.com/v2`
- OpenAI-style chat base URL: `https://api.cohere.com/v2`
- Env var: `COHERE_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `command-a-plus-05-2026` | 128K | 64K | Text + Image | 20 RPM |
| `command-a-03-2025` | 256K | 8K | Text | 20 RPM |
| `command-r-plus-08-2024` | 128K | 4K | Text | 20 RPM |
| `command-r-08-2024` | 128K | 4K | Text | 20 RPM |
| `command-r7b-12-2024` | 128K | 4K | Text | 20 RPM |
| `command-a-reasoning-08-2025` | 256K | 32K | Text (reasoning) | 20 RPM |
| `command-a-translate-08-2025` | 8K | 8K | Text | 20 RPM |
| `command-a-vision-07-2025` | 128K | 8K | Text + Image | 20 RPM |
| `command-r7b-arabic-02-2025` | 128K | ~4K | Text | 20 RPM |
| `c4ai-aya-expanse-32b` | 128K | 4K | Text | 20 RPM |
| `c4ai-aya-vision-32b` | 16K | 4K | Text + Image | 20 RPM |

## Google Gemini 🇺🇸

Free tier, no credit card. Free-tier prompts may be used by Google to improve products.

- Get a key / sign up: https://aistudio.google.com/app/apikey
- Catalog base URL (data.json): `https://generativelanguage.googleapis.com/v1beta`
- OpenAI-style chat base URL: `https://generativelanguage.googleapis.com/v1beta/openai`
- Env var: `GEMINI_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `gemini-3.8-flash` | 1M | 65K | Text + Image + Audio + Video | — |
| `gemini-3.7-flash` | 1M | 65K | Text + Image + Audio + Video | — |
| `gemini-3.6-flash` | 1M | 65K | Text + Image + Audio + Video | 15 RPM, 1,500 RPD |
| `gemini-3.5-flash` | 1M | 65K | Text + Image + Audio + Video | 15 RPM, 1,500 RPD |
| `gemini-3.5-flash-lite` | 1M | 65K | Text + Image + Audio + Video | 30 RPM, 1,500 RPD |
| `gemini-3.1-flash-lite` | 1M | 65K | Text + Image + Audio + Video | 30 RPM, 1,500 RPD |
| `gemini-2.5-flash` | 1M | 65K | Text + Image + Audio + Video | 15 RPM, 1,500 RPD |
| `gemini-2.5-flash-lite` | 1M | 65K | Text + Image + Audio + Video | 30 RPM, 1,500 RPD |
| `gemini-2.5-pro` | 1M | 65K | Text + Image + Audio + Video | 5 RPM, 50 RPD |
| `gemma-4-31b-it` | 256K | 32K | Text | — |
| `gemma-4-26b-a4b-it` | 256K | 32K | Text | — |

> **Note 1:** The Gemini API free tier is available to developers in the EU, UK, and Switzerland; the [available regions](https://ai.google.dev/gemini-api/docs/available-regions) page lists these regions. The [terms](https://ai.google.dev/gemini-api/terms) still require you to use only Paid Services when you make an API Client available to users in the European Economic Area, Switzerland, or the UK. Google no longer publishes per-model free-tier rate limits; check your quotas in [AI Studio](https://aistudio.google.com/). Free-tier prompts may be used by Google to improve products, except for users in the EEA, Switzerland and the UK, where the paid-services data terms also govern the unpaid quota, so those prompts are not used to improve Google products. `gemini-3.1-flash-lite` is on the [deprecation schedule](https://ai.google.dev/gemini-api/docs/deprecations), with a shutdown date of May 7, 2027 and `gemini-3.5-flash-lite` as its replacement; the row stays because the model is live and free today.

## Mistral AI 🇫🇷

Free mode, enabled by default, no credit card required. $10/month in API credits, and free-mode prompts may be used to train Mistral models unless you opt out.

- Get a key / sign up: https://console.mistral.ai/api-keys
- Catalog base URL (data.json): `https://api.mistral.ai/v1`
- OpenAI-style chat base URL: `https://api.mistral.ai/v1`
- Env var: `MISTRAL_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `mistral-medium-3-5` | 256K | — | Text + Image + Code | ~1 RPS, 500K TPM |
| `mistral-small-2603` | 256K | — | Text + Image + Code | ~1 RPS, 500K TPM |
| `mistral-large-2512` | 256K | — | Multimodal | ~1 RPS, 500K TPM |
| `ministral-8b-2512` | 256K | — | Text + Vision | ~1 RPS, 500K TPM |
| `codestral-2508` | 128K | — | Code | ~1 RPS, 500K TPM |
| `ministral-3b-2512` | 256K | — | Text + Vision | ~1 RPS, 500K TPM |
| `ministral-14b-2512` | 256K | — | Text + Vision | ~1 RPS, 500K TPM |

> **Note 13:** Mistral plans are global: the monthly allowance is shared across Studio, the API, and Vibe Code, so CLI usage eats the same budget ([subscriptions](https://docs.mistral.ai/admin/billing-usage/subscriptions)). Free mode is the default for new accounts and needs no credit card ([quickstart](https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key)), and the Free plan card on the [pricing page](https://mistral.ai/pricing) is what carries the $10/month in API credits figure quoted in the description. Free-mode inputs and outputs may be used to train Mistral models, and you can opt out at any time ([data usage](https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models)). Mistral no longer publishes numeric free-tier rate limits and points you at the Limits page of the admin panel instead ([rate limits](https://help.mistral.ai/en/articles/698531-why-am-i-hitting-api-rate-limits-and-how-do-i-increase-them)); the rate limit column is kept from the last published values.

## Z AI (Zhipu AI) 🇨🇳

Permanent free models, no credit card required.

- Get a key / sign up: https://open.bigmodel.cn/usercenter/apikeys
- Catalog base URL (data.json): `https://open.bigmodel.cn/api/paas/v4`
- OpenAI-style chat base URL: `https://open.bigmodel.cn/api/paas/v4`
- Env var: `ZAI_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `glm-4.7-flash` | 200K | 128K | Text (reasoning) | 1 concurrent request |
| `glm-4.5-flash` | 128K | 96K | Text (reasoning) | 1 concurrent request |
| `glm-4.6v-flash` | 128K | 32K | Multimodal | 1 concurrent request |

> **Note 12:** Registration accepts overseas phone numbers ([registration FAQ](https://docs.bigmodel.cn/cn/faq/registration-login.md)) and the chat API does not require real-name verification: 目前调用 API 并不强制要求实名认证 ([authentication FAQ](https://docs.bigmodel.cn/cn/faq/authentication-issues.md)). The Batch API does require it ([batch FAQ](https://docs.bigmodel.cn/cn/faq/batch-api-issues.md)). The same free models are served from the international platform at `https://api.z.ai/api/paas/v4` ([endpoint](https://docs.z.ai/guides/develop/http/introduction)), where GLM-4.7-Flash, GLM-4.5-Flash and GLM-4.6V-Flash are all priced Free ([pricing](https://docs.z.ai/guides/overview/pricing.md)). Z AI has announced that GLM-4.5-Flash will be retired and its requests auto-routed to GLM-4.7-Flash ([model page](https://docs.bigmodel.cn/cn/guide/models/free/glm-4.5-flash.md)); the announced date has already passed while the model is still catalogued and still priced Free, so treat that row as living on borrowed time.

## Cloudflare Workers AI 🇺🇸

10,000 Neurons/day free, no credit card required. 60+ models available on the free tier.

- Get a key / sign up: https://dash.cloudflare.com/profile/api-tokens
- Catalog base URL (data.json): `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run`
- OpenAI-style chat base URL: `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1`
- Env var: `CLOUDFLARE_API_TOKEN`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | 24K | Shared w/ context | Text | 10K neurons/day (shared) |
| `@cf/meta/llama-4-scout-17b-16e-instruct` | 131K | Shared w/ context | Multimodal | 10K neurons/day (shared) |
| `@cf/openai/gpt-oss-120b` | 128K | Shared w/ context | Text | 10K neurons/day (shared) |
| `@cf/google/gemma-4-26b-a4b-it` | 256K | Shared w/ context | Text + Vision | 10K neurons/day (shared) |
| `@cf/zai-org/glm-4.7-flash` | 131K | Shared w/ context | Text | 10K neurons/day (shared) |
| `@cf/mistralai/mistral-small-3.1-24b-instruct` | 128K | Shared w/ context | Text + Vision | 10K neurons/day (shared) |
| `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` | 80K | Shared w/ context | Text (reasoning) | 10K neurons/day (shared) |
| `None` | Varies | Varies | Text, Image, Audio, Embeddings | 10K neurons/day (shared) |

> **Note 11:** The 10,000 free Neurons are shared across all Workers AI usage, not per model, and all limits reset daily at 00:00 UTC. Going over does not bill you, the request fails. Seven models are excluded from Workers Free billing and need the Workers Paid plan or prepaid AI Gateway credits: `@cf/moonshotai/kimi-k2.6`, `@cf/moonshotai/kimi-k2.7-code`, `@cf/zai-org/glm-5.2`, `@cf/zai-org/glm-5.3`, `@cf/zai-org/glm-5.3-flash`, `@cf/deepseek-ai/deepseek-v4-flash-0731`, `@cf/deepseek-ai/deepseek-v4-pro-0813` ([pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)).

## Groq 🇺🇸

Free tier, no credit card. Ultra-fast LPU inference.

- Get a key / sign up: https://console.groq.com/keys
- Catalog base URL (data.json): `https://api.groq.com/openai/v1`
- OpenAI-style chat base URL: `https://api.groq.com/openai/v1`
- Env var: `GROQ_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `openai/gpt-oss-120b` | 131K | 65K | Text | 30 RPM, 1,000 RPD |
| `openai/gpt-oss-20b` | 131K | 65K | Text | 30 RPM, 1,000 RPD |
| `qwen/qwen3.8-27b` | 131K | 16K | Text | 30 RPM, 1,000 RPD |

> **Note 2:** Groq shut down qwen/qwen3.6-27b on September 14, 2026 (replaced by qwen/qwen3.8-27b) and groq/compound and groq/compound-mini on September 21, 2026 ([deprecations](https://console.groq.com/docs/deprecations)). Free-plan limits vary by model; the chat models listed get 1,000 RPD ([rate limits](https://console.groq.com/docs/rate-limits)).

## Hugging Face 🇺🇸

$0.10/month in Inference Provider credits for free users (subject to change). Routes to Fireworks, Together, Hyperbolic, Nebius, Novita, DeepInfra and others. Thousands of models.

- Get a key / sign up: https://huggingface.co/settings/tokens
- Catalog base URL (data.json): `https://router.huggingface.co/v1`
- OpenAI-style chat base URL: `https://router.huggingface.co/v1`
- Env var: `HF_TOKEN`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `meta-llama/Llama-3.1-8B-Instruct` | 128K | ~4K | Text | Credit-metered |
| `google/gemma-3-4b-it` | 131K | ~4K | Text | Credit-metered |
| `microsoft/phi-4` | 16K | ~4K | Text | Credit-metered |
| `Qwen/Qwen2.5-Coder-7B-Instruct` | 131K | ~4K | Text | Credit-metered |
| `Qwen/Qwen2.5-7B-Instruct` | 131K | ~4K | Text | Credit-metered |
| `None` | Varies | Varies | Text, Image, Audio, Embeddings | Credit-metered |

## Kilo Code 🇺🇸

Free models with no credit card and no API key required. `kilo-auto/free` auto-router dynamically routes to models in the free pool.

- Get a key / sign up: https://app.kilo.ai/profile
- Catalog base URL (data.json): `https://api.kilo.ai/api/gateway`
- OpenAI-style chat base URL: `https://api.kilo.ai/api/gateway`
- Env var: `KILO_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1M | 65K | Text | 200 req/hr |
| `stepfun/step-3.7-flash:free` | 262K | 262K | Text + Vision | 200 req/hr |
| `nvidia/nemotron-3-super-120b-a12b:free` | 262K | 262K | Text | 200 req/hr |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 256K | 65K | Multimodal | 200 req/hr |
| `poolside/laguna-s-2.1:free` | 262K | 32K | Text (code) | 200 req/hr |
| `poolside/laguna-xs-2.1:free` | 262K | 32K | Text (code) | 200 req/hr |
| `cohere/north-mini-code:free` | 256K | 64K | Text (code) | 200 req/hr |
| `openrouter/free` | Varies | Varies | Text | 200 req/hr |
| `tencent/hy3:free` | 262K | 128K | Text | 200 req/hr |
| `nvidia/nemotron-3.5-lightning:free` | 1M | 65K | Text | 200 req/hr |
| `liquid/lfm-2.5-2.6b:free` | 64K | 8K | Text | 200 req/hr |
| `kilo-auto/free` | 256K | 32K | Text | 200 req/hr |
| `inclusionai/ling-3.1-flash` | 262K | 32K | Text | 200 req/hr |
| `inclusionai/ling-3.0-flash-sante:free` | 262K | 32K | Text | 200 req/hr |
| `apodex/apodex-1.1-mini:free` | 262K | 235K | Text | 200 req/hr |
| `qwen/qwen3.8-27b:free` | 262K | 235K | Multimodal | 200 req/hr |
| `dots-studio/dots-3-note-preview:free` | 512K | 460K | Text + Vision | 200 req/hr |

> **Note 5:** Kilo Code's free pool changes frequently, and the /api/gateway/models catalog can lag what is actually served: probe results have confirmed models absent from the catalog still answering. Rows through liquid/lfm-2.5-2.6b:free answered a live request between 2026-08-19 and 2026-08-21; the rows after it were added on 2026-10-05 from the catalog, where they are priced at $0, and have not been probed. Free models are reachable with no API key, at 200 requests per hour per IP ([authentication](https://kilo.ai/docs/gateway/authentication)). The kilo-auto/free router picks a model from the free pool, and Kilo's docs warn it "may route your requests to providers that log prompts and outputs". The NVIDIA free endpoints carry NVIDIA's own condition, quoted on Kilo's [models page](https://kilo.ai/docs/gateway/models-and-providers): "Trial use only - do not submit personal or confidential data. Your use is logged for security purposes and to improve NVIDIA products and services."

## LLM7.io 🇬🇧

API gateway with a free tier. Anonymous access needs no key and reaches the `turbo` models; a free token from token.llm7.io raises the rate and token limits but reaches the same models.

- Get a key / sign up: https://token.llm7.io
- Catalog base URL (data.json): `https://api.llm7.io/v1`
- OpenAI-style chat base URL: `https://api.llm7.io/v1`
- Env var: `LLM7_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `gpt-oss:20b` | 128K | — | Text | 60 RPM, 250 req/hr (free token) |
| `mistral-Nemo-Instruct-2407` | 128K | — | Text | 60 RPM, 250 req/hr (free token) |
| `minimax-m2.7` | 180K | — | Text (reasoning) | 60 RPM, 250 req/hr (free token) |
| `DeepSeek-V4-Flash-0731` | 400K | — | Text (reasoning) | 60 RPM, 250 req/hr (free token) |

> **Note 10:** LLM7.io rotates its catalog frequently, so the model list changes between checks. Access is tier-based, not token-based: `turbo` models are reachable anonymously or with a free token, `pro` models need the paid plan ([models API](https://docs.llm7.io/guides/models-api)). A free token is capped at 1 RPS, 60 RPM, 250 requests per hour and 100,000 tokens per 24 hours, and the free quota may be reduced without notice ([limits](https://docs.llm7.io/limits)). A paid Pro plan is available at $12/month. The docs no longer list anonymous (no-key) limits; anonymous access was last confirmed by live request on 2026-08-21.

## ModelScope 🇨🇳

Free API-Inference for registered users. Requires Alibaba Cloud account binding + real-name verification.

- Get a key / sign up: https://modelscope.cn/my/myaccesstoken
- Catalog base URL (data.json): `https://api-inference.modelscope.cn/v1`
- OpenAI-style chat base URL: `https://api-inference.modelscope.cn/v1`
- Env var: `MODELSCOPE_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `Qwen/Qwen3.5-35B-A3B` | 256K | — | Text | 2,000 RPD total; <=500 RPD/model (dynamic) |
| `Qwen/Qwen3.5-27B` | 256K | — | Text | 2,000 RPD total; <=500 RPD/model (dynamic) |
| `None` | Varies | Varies | LLM, MLLM | Dynamic quotas + dynamic concurrency |

> **Note 6:** API-Inference is free for registered users. Current published limits are 2,000 requests/day per user (total across models), with per-model daily quotas dynamically adjusted and capped at 500; concurrency is also dynamically rate-limited. Requires Alibaba Cloud account binding and real-name verification ([limits](https://modelscope.cn/docs/model-service/API-Inference/limits), [intro](https://modelscope.cn/docs/model-service/API-Inference/intro)).

## NVIDIA NIM 🇺🇸

Free with NVIDIA Developer Program membership. 100+ models. Rate-limited per model.

- Get a key / sign up: https://build.nvidia.com/explore/discover
- Catalog base URL (data.json): `https://integrate.api.nvidia.com/v1`
- OpenAI-style chat base URL: `https://integrate.api.nvidia.com/v1`
- Env var: `NVIDIA_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `nvidia/nemotron-3-super-120b-a12b` | 1M | 262K | Text | 40 RPM, 10,000 RPD |
| `nvidia/llama-3.1-nemotron-ultra-253b-v1` | 128K | 4K | Text | 40 RPM, 10,000 RPD |
| `google/gemma-4-31b-it` | 262K | 8K | Text | 40 RPM, 10,000 RPD |
| `mistralai/mistral-large-2-instruct` | 128K | 4K | Text | 40 RPM, 10,000 RPD |
| `nvidia/nemotron-3-ultra-550b-a55b` | 1M | 262K | Text | 40 RPM, 10,000 RPD |
| `openai/gpt-oss-20b` | 131K | 131K | Text | 40 RPM, 10,000 RPD |
| `None` | Varies | Varies | Text, Image, Video, Speech, Embeddings | 40 RPM, 10,000 RPD |

## Ollama Cloud 🇺🇸

Free tier with usage limits. 16 cloud model families from the Ollama library. OpenAI SDK-compatible via https://ollama.com/v1.

- Get a key / sign up: https://ollama.com/settings/keys
- Catalog base URL (data.json): `https://ollama.com/api`
- OpenAI-style chat base URL: `https://ollama.com/v1`
- Env var: `OLLAMA_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `deepseek-v4-pro` | 1M | Model-dependent | Text | Session/weekly limits (unpublished) |
| `deepseek-v4-flash` | 1M | Model-dependent | Text | Session/weekly limits (unpublished) |
| `minimax-m3` | 512K | Model-dependent | Text | Session/weekly limits (unpublished) |
| `kimi-k3` | 1M | Model-dependent | Text | Session/weekly limits (unpublished) |
| `gpt-oss:120b` | 128K | Model-dependent | Text | Session/weekly limits (unpublished) |
| `gpt-oss:20b` | 131K | Model-dependent | Text | Session/weekly limits (unpublished) |
| `nemotron-3-ultra` | 262K | Model-dependent | Text | Session/weekly limits (unpublished) |
| `mistral-large-3:675b` | 256K | Model-dependent | Text | Session/weekly limits (unpublished) |
| `qwen3.5:397b` | 256K | Model-dependent | Text | Session/weekly limits (unpublished) |
| `None` | Varies | Varies | Text | Session/weekly limits (unpublished) |

> **Note 3:** Ollama Cloud measures usage by input, cached input, and output tokens weighted per model ([FAQ](https://docs.ollama.com/cloud)). Free tier has session limits resetting every 5 hours and weekly limits resetting every 7 days. Cloud models are also served through Ollama's OpenAI-compatible endpoint at ollama.com/v1.

## OpenRouter 🇺🇸

17 free models (marked with `:free` suffix). OpenAI SDK-compatible.

- Get a key / sign up: https://openrouter.ai/keys
- Catalog base URL (data.json): `https://openrouter.ai/api/v1`
- OpenAI-style chat base URL: `https://openrouter.ai/api/v1`
- Env var: `OPENROUTER_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `nvidia/nemotron-3-super-120b-a12b:free` | 262K | 262K | Text | 20 RPM, 50 RPD |
| `cohere/north-mini-code:free` | 256K | 64K | Text (code) | 20 RPM, 50 RPD |
| `google/gemma-4-26b-a4b-it:free` | 262K | 32K | Text + Image | 20 RPM, 50 RPD |
| `google/gemma-4-31b-it:free` | 262K | 32K | Text + Image | 20 RPM, 50 RPD |
| `nvidia/nemotron-nano-9b-v2:free` | 128K | — | Text | 20 RPM, 50 RPD |
| `nvidia/nemotron-nano-12b-v2-vl:free` | 128K | 128K | Text + Image | 20 RPM, 50 RPD |
| `poolside/laguna-s-2.1:free` | 262K | 32K | Text (code) | 20 RPM, 50 RPD |
| `poolside/laguna-xs-2.1:free` | 262K | 32K | Text (code) | 20 RPM, 50 RPD |
| `apodex/apodex-1.1-mini:free` | 262K | 235K | Text | 20 RPM, 50 RPD |
| `inclusionai/ling-3.0-flash-sante:free` | 262K | 32K | Text | 20 RPM, 50 RPD |
| `qwen/qwen3.8-27b:free` | 262K | 235K | Text + Image + Video | 20 RPM, 50 RPD |
| `dots-studio/dots-3-note-preview:free` | 512K | 460K | Text + Image | 20 RPM, 50 RPD |
| `liquid/lfm-2.5-2.6b:free` | 64K | 8K | Text | 20 RPM, 50 RPD |
| `nvidia/nemotron-3.5-lightning:free` | 1M | 65K | Text | 20 RPM, 50 RPD |
| `thinkingmachines/inkling:free` | 1M | 262K | Text + Image + Audio | 20 RPM, 50 RPD |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1M | 65K | Text | 20 RPM, 50 RPD |
| `None` | Varies | Varies | Text / Image | 20 RPM, 50 RPD |

> **Note 4:** Free models default to 50 RPD per model. A one-time purchase of $10+ in credits unlocks 1,000 RPD for free models. OpenRouter also offers a [Free Models Router](https://openrouter.ai/docs/guides/routing/routers/free-models-router) (`openrouter/free`) and [model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks) for chaining models in priority order. Free providers may log prompts for training.

## OVHcloud AI Endpoints 🇫🇷

Free anonymous tier (no API key, no signup): 2 RPM per IP per model. 20+ open-weight models hosted in EU. OpenAI SDK-compatible.

- Get a key / sign up: https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/
- Catalog base URL (data.json): `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1`
- OpenAI-style chat base URL: `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1`
- Env var: `OVH_AI_ENDPOINTS_ACCESS_TOKEN`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `Qwen3.5-397B-A17B` | 262K | ~32K | Text + Vision | 2 RPM (anonymous) |
| `gpt-oss-120b` | 128K | ~32K | Text | 2 RPM (anonymous) |
| `gpt-oss-20b` | 128K | ~8K | Text | 2 RPM (anonymous) |
| `Meta-Llama-3_3-70B-Instruct` | 131K | ~4K | Text | 2 RPM (anonymous) |
| `Qwen3.8-27B` | 262K | — | Text + Vision | 2 RPM (anonymous) |
| `Qwen3.6-27B` | 262K | ~32K | Text + Vision | 2 RPM (anonymous) |
| `Qwen3.5-9B` | 262K | ~8K | Text + Vision | 2 RPM (anonymous) |
| `Qwen3-32B` | 131K | ~32K | Text | 2 RPM (anonymous) |
| `Qwen2.5-VL-72B-Instruct` | 32K | ~8K | Text + Vision | 2 RPM (anonymous) |
| `Mistral-Small-3.2-24B-Instruct-2506` | 128K | ~4K | Text | 2 RPM (anonymous) |
| `Mistral-Nemo-Instruct-2407` | 128K | ~4K | Text | 2 RPM (anonymous) |

> **Note 7:** OVHcloud AI Endpoints offers a permanent free anonymous tier (2 requests per minute per IP, per model) with no signup or API key required. Higher rate limits (400 RPM per Public Cloud project per model) require an API key and are billed pay-as-you-go per token; new Public Cloud accounts get up to $200 in free trial credits. Models are hosted in EU data centers.

## SiliconFlow 🇨🇳

Permanently free models, no credit card required. Identity verification required. 100+ models in the catalog, most of them paid.

- Get a key / sign up: https://cloud.siliconflow.cn/account/ak
- Catalog base URL (data.json): `https://api.siliconflow.cn/v1`
- OpenAI-style chat base URL: `https://api.siliconflow.cn/v1`
- Env var: `SILICONFLOW_API_KEY`

| Model id | Context | Max out | Modality | Limit |
|---|---|---|---|---|
| `Qwen/Qwen3-8B` | 128K | — | Text | 1,000 RPM, 50,000 TPM |

> **Note 9:** SiliconFlow requires real-name identity verification to use free models (effective May 15, 2026, per the [release notes](https://api-docs.siliconflow.cn/docs/release-notes/overview)). Verification supports mainland-Chinese documents; international users must contact support.

## Glossary

- **RPM** — Requests per minute
- **RPD** — Requests per day
- **TPM** — Tokens per minute
- **TPD** — Tokens per day
- **RPS** — Requests per second
