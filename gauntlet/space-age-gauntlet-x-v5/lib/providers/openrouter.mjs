import { checkedJson } from "./base.mjs";
// OpenAI-compatible chat/completions image parts.
function userContent(prompt,images){
  if(!images?.length) return prompt;
  return [{type:"text",text:prompt},...images.map(url=>({type:"image_url",image_url:{url}}))];
}
export async function callOpenRouter({prompt,system="",model,images=[],maxOutputTokens,apiKey=process.env.OPENROUTER_API_KEY}){
  if(!apiKey) throw new Error("OPENROUTER_API_KEY missing");
  const body={
    model:model||process.env.OPENROUTER_MODEL||"openai/gpt-5.6",
    messages:[...(system?[{role:"system",content:system}]:[]),{role:"user",content:userContent(prompt,images)}]
  };
  if(maxOutputTokens) body.max_tokens=maxOutputTokens;
  const data=await checkedJson(await fetch("https://openrouter.ai/api/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${apiKey}`,
      "HTTP-Referer":"http://localhost",
      "X-Title":"Space Age Gauntlet X V5"
    },
    body:JSON.stringify(body)
  }));
  return {text:data.choices?.[0]?.message?.content||"",usage:data.usage||null,raw:data};
}
