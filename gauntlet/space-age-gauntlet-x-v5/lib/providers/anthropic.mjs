import { checkedJson } from "./base.mjs";
// Direct Anthropic Messages API — so the Opus seat does not depend on OpenRouter.
export async function callAnthropic({prompt,system="",model,images=[],maxOutputTokens,apiKey=process.env.ANTHROPIC_API_KEY}){
  if(!apiKey) throw new Error("ANTHROPIC_API_KEY missing");
  const content=[];
  for(const url of images){
    const m=String(url).match(/^data:([^;]+);base64,(.+)$/);
    if(!m) throw new Error("Anthropic image input must be a data URL");
    content.push({type:"image",source:{type:"base64",media_type:m[1],data:m[2]}});
  }
  content.push({type:"text",text:prompt});
  const body={
    model:model||process.env.ANTHROPIC_MODEL||"claude-opus-5",
    max_tokens:maxOutputTokens||4096, // required by this API, unlike the others
    messages:[{role:"user",content}],
  };
  if(system) body.system=system;
  const data=await checkedJson(await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},
    body:JSON.stringify(body)
  }));
  const text=(data.content||[]).map(c=>c.text||"").join("");
  return {text,usage:data.usage||null,raw:data};
}
