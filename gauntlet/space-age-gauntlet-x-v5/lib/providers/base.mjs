export function extractJson(text){
  const cleaned=String(text||"").trim().replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"");
  try{return JSON.parse(cleaned)}catch{}
  const a=cleaned.indexOf("{"), b=cleaned.lastIndexOf("}");
  if(a>=0&&b>a) return JSON.parse(cleaned.slice(a,b+1));
  throw new Error("Provider did not return parseable JSON.");
}
export async function checkedJson(res){
  const txt=await res.text();
  if(!res.ok) throw new Error(`HTTP ${res.status}: ${txt.slice(0,1000)}`);
  try{return JSON.parse(txt)}catch{throw new Error(`Invalid JSON response: ${txt.slice(0,500)}`)}
}
