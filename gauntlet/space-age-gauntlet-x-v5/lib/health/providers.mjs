import { callProvider, providerAvailable } from "../providers/index.mjs";
export async function probeProvider(name,model){
  const start=Date.now();
  if(!providerAvailable(name)) return {provider:name,available:false,latencyMs:null,error:"missing_credentials"};
  try{
    const r=await callProvider(name,{model,prompt:"Reply with exactly OK",system:"Health check."});
    return {provider:name,available:true,latencyMs:Date.now()-start,ok:/OK/i.test(r.text||""),error:null};
  }catch(e){
    return {provider:name,available:true,latencyMs:Date.now()-start,ok:false,error:e.message};
  }
}
export async function healthMatrix(items){
  return Promise.all(items.map(x=>probeProvider(x.provider,x.model)));
}
