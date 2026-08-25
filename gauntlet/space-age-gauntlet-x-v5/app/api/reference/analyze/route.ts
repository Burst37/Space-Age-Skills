import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { REFERENCE_ANALYST_SYSTEM, referencePrompt } from "@/lib/reference/prompt";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req:NextRequest){
  let tmp="";
  try{
    const form=await req.formData();
    const files=form.getAll("files").filter(x=>x instanceof File) as File[];
    if(!files.length) return NextResponse.json({error:"At least one screenshot or video is required."},{status:400});
    if(files.length>12) return NextResponse.json({error:"Maximum 12 reference assets per analysis."},{status:400});
    const styleNotes=String(form.get("styleNotes")||"");
    const provider=String(form.get("provider")||"auto");
    const { tempDir,saveBuffer,extractVideoFrames,toDataUrl } = await import("@/lib/reference/media.mjs");
    const { analyzeImagesOpenAI,analyzeImagesXAI,analyzeImagesGemini,analyzeVideoGemini } = await import("@/lib/reference/analyzer.mjs");
    tmp=await tempDir();
    const saved:{file:File,path:string}[]=[];
    for(const f of files){
      if(f.size>100*1024*1024) throw new Error(`${f.name} exceeds 100MB upload limit.`);
      saved.push({file:f,path:await saveBuffer(tmp,f.name,Buffer.from(await f.arrayBuffer()))});
    }
    const videos=saved.filter(x=>x.file.type.startsWith("video/"));
    const images=saved.filter(x=>x.file.type.startsWith("image/"));
    const prompt=referencePrompt(styleNotes,files.map(f=>f.name));

    // Direct Gemini video understanding is preferred for exactly one video because it preserves temporal information.
    if(videos.length===1 && images.length===0 && (provider==="auto"||provider==="gemini") && process.env.GEMINI_API_KEY){
      const out=await analyzeVideoGemini({videoPath:videos[0].path,mimeType:videos[0].file.type||"video/mp4",prompt,system:REFERENCE_ANALYST_SYSTEM});
      return NextResponse.json({...out,assetCount:files.length,analysisMode:"direct-video"});
    }

    // Mixed assets / fallback: convert videos to sampled temporal keyframes, then use an image-capable analyst.
    const urls:string[]=[];
    for(const img of images) urls.push(await toDataUrl(img.path,img.file.type||"image/jpeg"));
    for(const [i,v] of videos.entries()){
      const frameDir=path.join(tmp,`frames-${i}`);
      const frames=await extractVideoFrames(v.path,frameDir,{fps:2,maxFrames:12});
      for(const f of frames) urls.push(await toDataUrl(f,"image/jpeg"));
    }
    if(urls.length>40) urls.splice(40);

    let out;
    if((provider==="openai"||provider==="auto")&&process.env.OPENAI_API_KEY) out=await analyzeImagesOpenAI({images:urls,prompt,system:REFERENCE_ANALYST_SYSTEM});
    else if((provider==="xai"||provider==="auto")&&process.env.XAI_API_KEY) out=await analyzeImagesXAI({images:urls,prompt,system:REFERENCE_ANALYST_SYSTEM});
    else if((provider==="gemini"||provider==="auto")&&process.env.GEMINI_API_KEY) out=await analyzeImagesGemini({images:urls,prompt,system:REFERENCE_ANALYST_SYSTEM});
    else return NextResponse.json({error:"No compatible vision provider API key is configured. Add OPENAI_API_KEY, XAI_API_KEY, or GEMINI_API_KEY."},{status:400});

    return NextResponse.json({...out,assetCount:files.length,frameCount:urls.length,analysisMode:videos.length?"keyframe-sequence":"screenshots"});
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:"Reference analysis failed."},{status:500});
  }finally{
    if(tmp) await fs.rm(tmp,{recursive:true,force:true}).catch(()=>{});
  }
}
