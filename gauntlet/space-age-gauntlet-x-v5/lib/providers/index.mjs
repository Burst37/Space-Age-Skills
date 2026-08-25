import { callOpenAI } from "./openai.mjs";
import { callXAI } from "./xai.mjs";
import { callGemini } from "./gemini.mjs";
import { callOpenRouter } from "./openrouter.mjs";
import { callGeneric } from "./generic.mjs";

const providers={openai:callOpenAI,xai:callXAI,gemini:callGemini,openrouter:callOpenRouter,generic:callGeneric};

// V5: every adapter accepts `images` (data URLs). Only Gemini has native video
// understanding — everyone else is served keyframes. Kept explicit so a text-only
// provider fails loudly rather than silently discarding the evidence.
export const VISION_CAPABLE=new Set(["openai","xai","gemini","openrouter","generic"]);
export const VIDEO_CAPABLE=new Set(["gemini"]);

export async function callProvider(name,args){
  const fn=providers[name];
  if(!fn) throw new Error(`Unknown provider: ${name}`);
  if(args?.images?.length && !VISION_CAPABLE.has(name)) throw new Error(`Provider ${name} cannot accept image evidence`);
  if(args?.video && !VIDEO_CAPABLE.has(name)) throw new Error(`Provider ${name} cannot accept video evidence`);
  return fn(args);
}

/**
 * Route evidence to what a provider can actually consume. Video-capable providers get the
 * recording; the rest get the keyframes sampled from it. Never silently drops evidence —
 * the returned `degraded` flag is recorded on the round so a low motion score is
 * attributable to the adapter rather than to the build.
 */
export function adaptEvidence(name,{images=[],video=null,frames=[]}={}){
  if(video && VIDEO_CAPABLE.has(name)) return {images,video,degraded:false};
  if(video) return {images:[...images,...frames].slice(0,12),video:null,degraded:"video->frames"};
  return {images,video:null,degraded:false};
}

export function providerAvailable(name){
  return ({
    openai:!!process.env.OPENAI_API_KEY,
    xai:!!process.env.XAI_API_KEY,
    gemini:!!process.env.GEMINI_API_KEY,
    openrouter:!!process.env.OPENROUTER_API_KEY,
    generic:!!process.env.GENERIC_API_KEY&&!!process.env.GENERIC_BASE_URL
  })[name]||false;
}

const RETRYABLE=/\b(408|409|425|429|500|502|503|504)\b|ETIMEDOUT|ECONNRESET|fetch failed/i;

/**
 * V5 mid-run failover. V4 chose a provider once at startup; a 429 thirty minutes into a
 * run killed the whole gauntlet. Retries with backoff, then falls through the chain.
 */
export async function callWithFailover(chain,args,{retries=2,baseDelayMs=1500,onEvent=()=>{}}={}){
  const tried=[];
  let lastErr=null;
  for(const name of chain.filter(Boolean)){
    if(!providerAvailable(name)) { tried.push({provider:name,skipped:"missing_credentials"}); continue; }
    if(args?.images?.length && !VISION_CAPABLE.has(name)) { tried.push({provider:name,skipped:"no_vision"}); continue; }
    if(args?.video && !VIDEO_CAPABLE.has(name)) { tried.push({provider:name,skipped:"no_video"}); continue; }
    for(let attempt=0;attempt<=retries;attempt++){
      try{
        const r=await callProvider(name,args);
        return {...r,provider:name,tried};
      }catch(e){
        lastErr=e;
        const retryable=RETRYABLE.test(e.message||"");
        tried.push({provider:name,attempt,error:e.message?.slice(0,200),retryable});
        onEvent({type:"provider_error",provider:name,attempt,error:e.message?.slice(0,200)});
        if(!retryable) break;
        if(attempt<retries) await new Promise(r=>setTimeout(r,baseDelayMs*Math.pow(2,attempt)));
      }
    }
  }
  const err=new Error(`All providers failed (${chain.join(" -> ")}): ${lastErr?.message||"unknown"}`);
  err.tried=tried;
  throw err;
}
