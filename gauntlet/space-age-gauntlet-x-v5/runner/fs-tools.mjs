import fs from "node:fs/promises";
import path from "node:path";
import { createSnapshotCache, deltaSnapshot } from "./token-budget.mjs";
export { createSnapshotCache, deltaSnapshot };

export function safePath(workspace,rel,protectedPaths=[]){
  const cleaned=String(rel||"").replace(/\\/g,"/").replace(/^\/+/,"");
  if(!cleaned||cleaned.includes("..")) throw new Error(`Unsafe path: ${rel}`);
  if(protectedPaths.some(p=>cleaned===p||cleaned.startsWith(p+"/"))) throw new Error(`Protected path: ${rel}`);
  const base=path.resolve(workspace), target=path.resolve(base,cleaned);
  if(!target.startsWith(base+path.sep)&&target!==base) throw new Error(`Path escape: ${rel}`);
  return target;
}
export async function writeFiles(workspace,files,protectedPaths=[]){
  const written=[];
  for(const f of files||[]){
    const target=safePath(workspace,f.path,protectedPaths);
    await fs.mkdir(path.dirname(target),{recursive:true});
    await fs.writeFile(target,String(f.content??""),"utf8");
    written.push(f.path);
  }
  return written;
}

const SKIP=new Set(["node_modules",".git",".next","dist","build","runs"]);
const KEEP=/\.(tsx?|jsx?|mjs|cjs|json|css|html|md|py|go|rs|java|sql|yaml|yml)$/i;

/** V5: return the files, let the caller decide what to re-send. */
export async function collectFiles(workspace,{maxFiles=80}={}){
  const files=[];
  async function walk(dir,rel=""){
    for(const ent of await fs.readdir(dir,{withFileTypes:true}).catch(()=>[])){
      if(SKIP.has(ent.name)) continue;
      const abs=path.join(dir,ent.name), r=path.join(rel,ent.name);
      if(ent.isDirectory()) await walk(abs,r);
      else if(files.length<maxFiles && KEEP.test(ent.name)){
        files.push({path:r,content:await fs.readFile(abs,"utf8").catch(()=>"")});
      }
    }
  }
  await walk(path.resolve(workspace));
  return files;
}

/** Back-compat: full-body snapshot, unchanged semantics. */
export async function snapshot(workspace,{maxFiles=80,maxChars=140000}={}){
  const files=await collectFiles(workspace,{maxFiles});
  return deltaSnapshot(files,createSnapshotCache(),{full:true,maxChars});
}
