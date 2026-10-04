// V5 run monitor. The runner is a separate process from the Next app, so events go through
// an append-only JSONL file in the run directory and the SSE route tails it. No socket
// server, no extra dependency, and the log survives the process for post-mortems.
import fs from "node:fs";
import path from "node:path";

export function eventLogPath(runDir){ return path.join(runDir,"events.jsonl"); }

export function emit(runDir,event){
  if(!runDir) return;
  try{
    fs.appendFileSync(eventLogPath(runDir),JSON.stringify({ts:new Date().toISOString(),...event})+"\n");
  }catch{ /* monitoring must never break a run */ }
}

export function readEvents(runDir,{fromByte=0}={}){
  const p=eventLogPath(runDir);
  try{
    const stat=fs.statSync(p);
    if(stat.size<=fromByte) return {events:[],nextByte:stat.size};
    const fd=fs.openSync(p,"r");
    const buf=Buffer.alloc(stat.size-fromByte);
    fs.readSync(fd,buf,0,buf.length,fromByte);
    fs.closeSync(fd);
    const events=buf.toString("utf8").split("\n").filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
    return {events,nextByte:stat.size};
  }catch{ return {events:[],nextByte:fromByte}; }
}
