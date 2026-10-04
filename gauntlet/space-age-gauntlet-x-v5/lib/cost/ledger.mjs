import { PRICE_TABLE, estimateCost as estimate } from "../../runner/token-budget.mjs";
export { PRICE_TABLE };

export function newLedger(){
  return { totalEstimatedUsd:0, totalInputTokens:0, totalOutputTokens:0, calls:[], byRole:{}, scoreGainPerDollar:[] };
}

function tokensOf(usage={}){
  return {
    input: usage?.input_tokens ?? usage?.prompt_tokens ?? usage?.promptTokenCount ?? 0,
    output: usage?.output_tokens ?? usage?.completion_tokens ?? usage?.candidatesTokenCount ?? 0,
  };
}

export function recordCall(ledger,{provider,model,role,usage={},estimatedUsd=0,round,degraded=false}){
  const t=tokensOf(usage);
  const entry={ts:new Date().toISOString(),provider,model,role,round,...t,estimatedUsd:Number(estimatedUsd||0),degraded};
  ledger.calls.push(entry);
  ledger.totalEstimatedUsd=Number((ledger.totalEstimatedUsd+entry.estimatedUsd).toFixed(6));
  ledger.totalInputTokens+=t.input;
  ledger.totalOutputTokens+=t.output;
  const r=ledger.byRole[role]||(ledger.byRole[role]={calls:0,input:0,output:0,usd:0});
  r.calls++; r.input+=t.input; r.output+=t.output;
  r.usd=Number((r.usd+entry.estimatedUsd).toFixed(6));
  return entry;
}

/**
 * V4 shipped a price registry of zeros, so every run reported cost≈$0 and nobody saw the
 * burn. Real per-1M rates live in runner/token-budget.mjs and are overrideable per config.
 */
export function estimateCost(args,table){ return estimate(args,table||PRICE_TABLE); }

export function mergePricing(overrides){
  return { ...PRICE_TABLE, ...(overrides||{}) };
}

export function ledgerSummary(ledger){
  return {
    usd:ledger.totalEstimatedUsd,
    inTok:ledger.totalInputTokens,
    outTok:ledger.totalOutputTokens,
    byRole:Object.fromEntries(Object.entries(ledger.byRole).map(([k,v])=>[k,`${v.calls}c ${v.input}in/${v.output}out $${v.usd}`])),
  };
}
