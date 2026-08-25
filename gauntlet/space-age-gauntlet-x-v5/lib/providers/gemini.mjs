import { checkedJson } from "./base.mjs";
import { uploadGeminiFile, waitForActive } from "./gemini-files.mjs";

/**
 * Gemini is the only adapter with native video understanding — it gets the real recording.
 * `video` may be {path, mimeType} (uploaded via Files API) or a data URL for small clips.
 */
export async function callGemini({prompt,system="",model,images=[],video=null,maxOutputTokens,apiKey=process.env.GEMINI_API_KEY}){
  if(!apiKey) throw new Error("GEMINI_API_KEY missing");
  const parts=[{text:prompt}];

  for(const url of images){
    const m=String(url).match(/^data:([^;]+);base64,(.+)$/);
    if(!m) throw new Error("Gemini image input must be a data URL");
    parts.push({inlineData:{mimeType:m[1],data:m[2]}});
  }

  if(video){
    if(typeof video==="string"&&video.startsWith("data:")){
      const m=video.match(/^data:([^;]+);base64,(.+)$/);
      parts.push({inlineData:{mimeType:m[1],data:m[2]}});
    }else if(video?.path){
      const mime=video.mimeType||"video/webm";
      const file=await waitForActive(await uploadGeminiFile(video.path,mime,apiKey),apiKey);
      parts.push({fileData:{mimeType:file.mimeType||mime,fileUri:file.uri}});
    }
  }

  const mdl=model||process.env.GEMINI_MODEL||"gemini-3.7-flash";
  const body={contents:[{role:"user",parts}]};
  if(system) body.systemInstruction={parts:[{text:system}]};
  if(maxOutputTokens) body.generationConfig={maxOutputTokens};
  const data=await checkedJson(await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent`,{
    method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify(body)
  }));
  const text=(data.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||"").join("");
  return {text,usage:data.usageMetadata||null,raw:data};
}
