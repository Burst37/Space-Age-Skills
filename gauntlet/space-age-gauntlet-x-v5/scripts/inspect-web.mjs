import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const configPath=process.argv[2];
if(!configPath){console.error("Usage: node scripts/inspect-web.mjs <runner-config.json>");process.exit(1)}
const config=JSON.parse(await fs.readFile(configPath,"utf8"));
if(!config.web?.enabled){console.log(JSON.stringify({enabled:false}));process.exit(0)}
const browser=await chromium.launch({headless:true});
const results=[];
for(const vp of config.web.viewports){
  const page=await browser.newPage({viewport:{width:vp.width,height:vp.height}});
  const consoleErrors=[];page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text())});
  const res=await page.goto(config.web.url,{waitUntil:"networkidle",timeout:45000}).catch(e=>null);
  const shot=`${vp.name}.png`;await page.screenshot({path:shot,fullPage:true}).catch(()=>{});
  const title=await page.title().catch(()=>"");
  const bodyText=await page.locator("body").innerText().catch(()=>"");
  results.push({viewport:vp,status:res?.status()||0,title,consoleErrors:consoleErrors.slice(0,20),bodyExcerpt:bodyText.slice(0,3000),screenshot:shot});
  await page.close();
}
await browser.close();
console.log(JSON.stringify({enabled:true,url:config.web.url,results},null,2));
