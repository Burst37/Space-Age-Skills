import fs from "node:fs/promises";
import path from "node:path";
export async function createRun(config){
  const id=new Date().toISOString().replace(/[:.]/g,"-");
  const dir=path.resolve("runs",`${config.name}-${id}`);
  await fs.mkdir(dir,{recursive:true});
  const state={id,startedAt:new Date().toISOString(),round:0,status:"running",scores:[],ledger:{},events:[],config};
  await saveState(dir,state);return {dir,state};
}
export async function saveState(dir,state){
  await fs.writeFile(path.join(dir,"state.json"),JSON.stringify(state,null,2));
}
export async function saveRound(dir,round,data){
  await fs.writeFile(path.join(dir,`round-${String(round).padStart(2,"0")}.json`),JSON.stringify(data,null,2));
}
