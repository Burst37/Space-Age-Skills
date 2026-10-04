import { healthMatrix } from "../lib/health/providers.mjs";
const providers=["openai","gemini","xai","openrouter","generic"].map(provider=>({provider,model:""}));
console.log(JSON.stringify(await healthMatrix(providers),null,2));
