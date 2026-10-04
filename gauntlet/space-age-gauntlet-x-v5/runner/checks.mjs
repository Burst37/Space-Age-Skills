import { spawn } from "node:child_process";

export async function runCheck(command,cwd,timeoutMs=180000){
  return new Promise(resolve=>{
    const child=spawn(command,{cwd,shell:true,env:process.env});
    let stdout="",stderr="",done=false;
    const timer=setTimeout(()=>{if(!done){child.kill("SIGKILL");resolve({command,ok:false,code:-1,stdout:stdout.slice(-4000),stderr:stderr.slice(-4000)+"\nTIMEOUT"});}},timeoutMs);
    child.stdout.on("data",d=>stdout+=d);child.stderr.on("data",d=>stderr+=d);
    child.on("close",code=>{
      done=true;clearTimeout(timer);
      const ok=code===0;
      // V5: a passing check is one bit of information. V4 carried 40k chars of green
      // build output into three separate prompts every round.
      resolve({command,ok,code,stdout:ok?"":stdout.slice(-4000),stderr:ok?"":stderr.slice(-4000)});
    });
  });
}
export async function runChecks(commands,cwd){
  const results=[];
  for(const c of commands||[]) results.push(await runCheck(c,cwd));
  return results;
}
