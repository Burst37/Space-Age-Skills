import { checkedJson } from "./base.mjs";
function userContent(prompt,images){
  if(!images?.length) return prompt;
  return [{type:"text",text:prompt},...images.map(url=>({type:"image_url",image_url:{url}}))];
}
export async function callGeneric({prompt,system="",model,images=[],maxOutputTokens,apiKey=process.env.GENERIC_API_KEY}){
  const base=(process.env.GENERIC_BASE_URL||"").replace(/\/$/,"");
  if(!base) throw new Error("GENERIC_BASE_URL missing");
  if(!apiKey) throw new Error("GENERIC_API_KEY missing");
  const body={model:model||process.env.GENERIC_MODEL,messages:[...(system?[{role:"system",content:system}]:[]),{role:"user",content:userContent(prompt,images)}]};
  if(maxOutputTokens) body.max_tokens=maxOutputTokens;
  const data=await checkedJson(await fetch(`${base}/v1/chat/completions`,{
    method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},body:JSON.stringify(body)
  }));
  return {text:data.choices?.[0]?.message?.content||"",usage:data.usage||null,raw:data};
}
