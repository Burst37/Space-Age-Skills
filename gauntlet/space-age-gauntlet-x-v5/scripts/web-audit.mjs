import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const url=process.argv[2]||"http://127.0.0.1:3000";
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
const response=await page.goto(url,{waitUntil:"networkidle",timeout:45000});
const axe=await new AxeBuilder({page}).analyze();
console.log(JSON.stringify({
  url,status:response?.status()||0,title:await page.title(),consoleErrors:errors,
  accessibility:{violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,help:v.help}))}
},null,2));
await browser.close();
