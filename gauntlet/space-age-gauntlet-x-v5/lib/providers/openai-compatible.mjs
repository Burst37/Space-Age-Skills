import { checkedJson } from "./base.mjs";
// Shared client for the many labs that expose an OpenAI-compatible /chat/completions.
// One implementation, several direct providers — no broker in the middle.
export function userContent(prompt,images){
  if(!images?.length) return prompt;
  return [{type:"text",text:prompt},...images.map(url=>({type:"image_url",image_url:{url}}))];
}
export function makeOpenAICompatible({name,baseUrl,keyEnv,modelEnv,defaultModel,extraHeaders={}}){
  return async function call({prompt,system="",model,images=[],maxOutputTokens,apiKey=process.env[keyEnv]}){
    if(!apiKey) throw new Error(`${keyEnv} missing`);
    const base=(process.env[`${name.toUpperCase()}_BASE_URL`]||baseUrl).replace(/\/$/,"");
    const body={
      model:model||process.env[modelEnv]||defaultModel,
      messages:[...(system?[{role:"system",content:system}]:[]),{role:"user",content:userContent(prompt,images)}],
    };
    if(maxOutputTokens) body.max_tokens=maxOutputTokens;
    const data=await checkedJson(await fetch(`${base}/chat/completions`,{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`,...extraHeaders},
      body:JSON.stringify(body)
    }));
    return {text:data.choices?.[0]?.message?.content||"",usage:data.usage||null,raw:data};
  };
}
export const callDeepSeek=makeOpenAICompatible({
  name:"deepseek",baseUrl:"https://api.deepseek.com/v1",keyEnv:"DEEPSEEK_API_KEY",
  modelEnv:"DEEPSEEK_MODEL",defaultModel:"deepseek-chat",
});
export const callMoonshot=makeOpenAICompatible({
  name:"moonshot",baseUrl:"https://api.moonshot.ai/v1",keyEnv:"MOONSHOT_API_KEY",
  modelEnv:"MOONSHOT_MODEL",defaultModel:"kimi-k3",
});
