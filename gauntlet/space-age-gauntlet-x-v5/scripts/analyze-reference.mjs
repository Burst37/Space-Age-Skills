import fs from "node:fs/promises";
import path from "node:path";
import { REFERENCE_ANALYST_SYSTEM, referencePrompt } from "../lib/reference/prompt.mjs";
import { extractVideoFrames,toDataUrl } from "../lib/reference/media.mjs";
import { analyzeImagesOpenAI,analyzeImagesXAI,analyzeImagesGemini,analyzeVideoGemini } from "../lib/reference/analyzer.mjs";

const args=process.argv.slice(2);
if(!args.length){console.error("Usage: npm run analyze:reference -- <image-or-video> [more assets]");process.exit(1)}
const names=args.map(x=>path.basename(x));
const prompt=referencePrompt(process.env.GX_STYLE_NOTES||"",names);
const videos=args.filter(x=>/\.(mp4|webm|mov|m4v)$/i.test(x));
const images=args.filter(x=>/\.(png|jpe?g|webp)$/i.test(x));
let out;
if(videos.length===1&&!images.length&&process.env.GEMINI_API_KEY){
  const ext=path.extname(videos[0]).toLowerCase();
  const mime=ext===".webm"?"video/webm":ext===".mov"?"video/quicktime":"video/mp4";
  out=await analyzeVideoGemini({videoPath:videos[0],mimeType:mime,prompt,system:REFERENCE_ANALYST_SYSTEM});
}else{
  const urls=[];
  for(const img of images){
    const ext=path.extname(img).toLowerCase();const mime=ext===".png"?"image/png":ext===".webp"?"image/webp":"image/jpeg";
    urls.push(await toDataUrl(img,mime));
  }
  for(const [i,v] of videos.entries()){
    const dir=path.resolve(".gauntlet-ref-frames",String(i));
    for(const frame of await extractVideoFrames(v,dir,{fps:2,maxFrames:12})) urls.push(await toDataUrl(frame,"image/jpeg"));
  }
  if(process.env.OPENAI_API_KEY) out=await analyzeImagesOpenAI({images:urls,prompt,system:REFERENCE_ANALYST_SYSTEM});
  else if(process.env.XAI_API_KEY) out=await analyzeImagesXAI({images:urls,prompt,system:REFERENCE_ANALYST_SYSTEM});
  else if(process.env.GEMINI_API_KEY) out=await analyzeImagesGemini({images:urls,prompt,system:REFERENCE_ANALYST_SYSTEM});
  else throw new Error("Configure OPENAI_API_KEY, XAI_API_KEY, or GEMINI_API_KEY");
}
await fs.writeFile("reference-dna.json",JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
