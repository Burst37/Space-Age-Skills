import fs from "node:fs/promises";
import path from "node:path";
import { extractJson } from "../providers/base.mjs";
import { uploadGeminiFile, waitForActive } from "../providers/gemini-files.mjs";

function textOfResponses(data){
  return data.output_text ?? (data.output||[]).flatMap(o=>o.content||[]).map(c=>c.text||c.output_text||"").join("");
}

export async function analyzeImagesOpenAI({images,prompt,system,model="",apiKey=process.env.OPENAI_API_KEY}){
  if(!apiKey) throw new Error("OPENAI_API_KEY missing");
  const content=[{type:"input_text",text:prompt},...images.map(url=>({type:"input_image",image_url:url,detail:"high"}))];
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},body:JSON.stringify({
    model:model||process.env.OPENAI_VISION_MODEL||process.env.OPENAI_MODEL||"gpt-5.6",
    input:[{role:"system",content:[{type:"input_text",text:system}]},{role:"user",content}]
  })});
  const txt=await r.text(); if(!r.ok) throw new Error(`OpenAI ${r.status}: ${txt.slice(0,1200)}`);
  const data=JSON.parse(txt); return {dna:extractJson(textOfResponses(data)),usage:data.usage||null,provider:"openai"};
}

export async function analyzeImagesXAI({images,prompt,system,model="",apiKey=process.env.XAI_API_KEY}){
  if(!apiKey) throw new Error("XAI_API_KEY missing");
  const content=[{type:"input_text",text:prompt},...images.map(url=>({type:"input_image",image_url:url,detail:"high"}))];
  const r=await fetch("https://api.x.ai/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},body:JSON.stringify({
    model:model||process.env.XAI_VISION_MODEL||process.env.XAI_MODEL||"grok-4.6",
    input:[{role:"system",content:[{type:"input_text",text:system}]},{role:"user",content}]
  })});
  const txt=await r.text(); if(!r.ok) throw new Error(`xAI ${r.status}: ${txt.slice(0,1200)}`);
  const data=JSON.parse(txt); return {dna:extractJson(textOfResponses(data)),usage:data.usage||null,provider:"xai"};
}

export async function analyzeImagesGemini({images,prompt,system,model="",apiKey=process.env.GEMINI_API_KEY}){
  if(!apiKey) throw new Error("GEMINI_API_KEY missing");
  const parts=[{text:prompt},...images.map(url=>{
    const m=url.match(/^data:([^;]+);base64,(.+)$/); if(!m) throw new Error("Gemini image input must be data URL");
    return {inlineData:{mimeType:m[1],data:m[2]}};
  })];
  const m=model||process.env.GEMINI_VISION_MODEL||process.env.GEMINI_MODEL||"gemini-3.7-flash";
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,{
    method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},
    body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:"user",parts}]})
  });
  const txt=await r.text(); if(!r.ok) throw new Error(`Gemini ${r.status}: ${txt.slice(0,1200)}`);
  const data=JSON.parse(txt); const text=(data.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||"").join("");
  return {dna:extractJson(text),usage:data.usageMetadata||null,provider:"gemini"};
}

export async function analyzeVideoGemini({videoPath,mimeType,prompt,system,model="",apiKey=process.env.GEMINI_API_KEY}){
  if(!apiKey) throw new Error("GEMINI_API_KEY missing");
  const file=await waitForActive(await uploadGeminiFile(videoPath,mimeType,apiKey),apiKey);
  const m=model||process.env.GEMINI_VIDEO_MODEL||process.env.GEMINI_MODEL||"gemini-3.7-flash";
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,{
    method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},
    body:JSON.stringify({
      systemInstruction:{parts:[{text:system}]},
      contents:[{role:"user",parts:[{fileData:{mimeType:file.mimeType||mimeType,fileUri:file.uri}},{text:prompt}]}]
    })
  });
  const txt=await r.text(); if(!r.ok) throw new Error(`Gemini video analyze ${r.status}: ${txt.slice(0,1200)}`);
  const data=JSON.parse(txt); const text=(data.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||"").join("");
  return {dna:extractJson(text),usage:data.usageMetadata||null,provider:"gemini-video"};
}
