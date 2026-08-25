import { checkedJson } from "./base.mjs";
export async function callXAI({prompt,system="",model,images=[],maxOutputTokens,apiKey=process.env.XAI_API_KEY}){
  if(!apiKey) throw new Error("XAI_API_KEY missing");
  const content=[{type:"input_text",text:prompt},...images.map(url=>({type:"input_image",image_url:url,detail:"high"}))];
  const body={model:model||process.env.XAI_MODEL||"grok-4.6",input:[
    ...(system?[{role:"system",content:[{type:"input_text",text:system}]}]:[]),
    {role:"user",content}
  ]};
  if(maxOutputTokens) body.max_output_tokens=maxOutputTokens;
  const data=await checkedJson(await fetch("https://api.x.ai/v1/responses",{
    method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},body:JSON.stringify(body)
  }));
  const text=data.output_text ?? (data.output||[]).flatMap(o=>o.content||[]).map(c=>c.text||c.output_text||"").join("");
  return {text,usage:data.usage||null,raw:data};
}
