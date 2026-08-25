import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

export async function tempDir(prefix="gx-ref-"){
  return fs.mkdtemp(path.join(os.tmpdir(),prefix));
}
export async function saveBuffer(dir,name,buffer){
  const safe=String(name||"asset").replace(/[^a-zA-Z0-9._-]/g,"_");
  const p=path.join(dir,safe);
  await fs.writeFile(p,buffer);
  return p;
}
export function run(cmd,args,cwd){
  return new Promise((resolve,reject)=>{
    const child=spawn(cmd,args,{cwd,env:process.env});
    let out="",err="";
    child.stdout.on("data",d=>out+=d);child.stderr.on("data",d=>err+=d);
    child.on("error",reject);
    child.on("close",code=>code===0?resolve({out,err}):reject(new Error(`${cmd} failed (${code}): ${err.slice(-2000)}`)));
  });
}
export async function extractVideoFrames(videoPath,outDir,{fps=2,maxFrames=12}={}){
  await fs.mkdir(outDir,{recursive:true});
  // fps sampling gives temporal evidence while bounding analysis cost.
  const pattern=path.join(outDir,"frame-%03d.jpg");
  await run("ffmpeg",["-y","-i",videoPath,"-vf",`fps=${fps},scale='min(1440,iw)':-2`,"-frames:v",String(maxFrames),"-q:v","3",pattern]);
  return (await fs.readdir(outDir))
    .filter(x=>x.endsWith(".jpg")).sort().map(x=>path.join(outDir,x));
}
export async function toDataUrl(filePath,mime="image/jpeg"){
  const b=await fs.readFile(filePath);
  return `data:${mime};base64,${b.toString("base64")}`;
}
