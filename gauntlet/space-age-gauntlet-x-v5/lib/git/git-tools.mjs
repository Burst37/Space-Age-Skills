import { spawn } from "node:child_process";
function run(cmd,args,cwd){
  return new Promise(resolve=>{
    const p=spawn(cmd,args,{cwd});
    let out="",err="";
    p.stdout.on("data",d=>out+=d);p.stderr.on("data",d=>err+=d);
    p.on("close",code=>resolve({ok:code===0,code,out,err}));
  });
}
export async function ensureCheckpoint(cwd,label="pre-gauntlet"){
  const status=await run("git",["rev-parse","--is-inside-work-tree"],cwd);
  if(!status.ok) return {enabled:false,reason:"not_git_repo"};
  const branch=await run("git",["branch","--show-current"],cwd);
  const add=await run("git",["add","-A"],cwd);
  const diff=await run("git",["diff","--cached","--quiet"],cwd);
  let commit=null;
  if(diff.code!==0) commit=await run("git",["commit","-m",label],cwd);
  const name=`gauntlet/${new Date().toISOString().replace(/[:.]/g,"-")}`;
  const create=await run("git",["checkout","-b",name],cwd);
  return {enabled:true,baseBranch:branch.out.trim(),gauntletBranch:name,checkpoint:commit?.out||"",branchCreated:create.ok};
}
export async function commitRound(cwd,round,score){
  await run("git",["add","-A"],cwd);
  const diff=await run("git",["diff","--cached","--quiet"],cwd);
  if(diff.code===0) return {ok:true,skipped:true};
  return run("git",["commit","-m",`gauntlet round ${round} score ${score}`],cwd);
}

/**
 * V5: opt-in branch push. Only fires when config.git.pushOnShip is true and only after the
 * gauntlet has actually passed its gate. Never pushes to the base branch, never force-pushes,
 * and never opens a PR on its own — the handoff to a human stays deliberate.
 */
export async function pushBranch(cwd,remote="origin"){
  const branch=(await run("git",["branch","--show-current"],cwd)).out.trim();
  if(!branch) return {ok:false,reason:"detached_head"};
  if(!/^gauntlet\//.test(branch)) return {ok:false,reason:"refusing_to_push_non_gauntlet_branch",branch};
  const r=await run("git",["push","-u",remote,branch],cwd);
  return {ok:r.ok,branch,remote,out:(r.out||r.err||"").slice(-500)};
}
