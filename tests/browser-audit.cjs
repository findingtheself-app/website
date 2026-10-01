// Audit tooling only. Website contains no scripts. Dependencies stay outside the repo.
const fs=require('fs'),path=require('path');
const {chromium}=require(path.join(process.env.SELF_BROWSER_MODULES || process.env.SELF_TEST_MODULES,'playwright'));
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.SELF_CHROME_PATH,args:['--remote-debugging-port=9222']});
const root=path.resolve(__dirname,'..');
const output=process.env.SELF_AUDIT_OUTPUT || path.join(require('os').tmpdir(),'self-website-audits');fs.mkdirSync(output,{recursive:true});
const results=[];
for(const width of [320,390,640,768,1280]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',bypassCSP:true});
 const external=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8765'))external.push(r.url())});
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
 const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,cookies:document.cookie,localStorage:localStorage.length,disabled:document.querySelector('fieldset').disabled,animated:[...document.querySelectorAll('svg')].some(e=>getComputedStyle(e).animationName!=='none')}));
 await page.addScriptTag({content:fs.readFileSync(path.join(process.env.SELF_TEST_MODULES,'axe-core/axe.min.js'),'utf8')});
 const audit=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));
 results.push({width,...layout,external,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:audit.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))});
 if([390,1280].includes(width))await page.screenshot({path:path.join(output,`home-${width}.png`),fullPage:true});
 await page.close();
}
for(const file of ['privacy.html','thank-you.html','signup-error.html','404.html']){
 const page=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce',bypassCSP:true});await page.goto('http://127.0.0.1:8765/'+file);
 await page.addScriptTag({content:fs.readFileSync(path.join(process.env.SELF_TEST_MODULES,'axe-core/axe.min.js'),'utf8')});
 const audit=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));
 results.push({file,violations:audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}))});
 await page.close();
}
fs.writeFileSync(path.join(output,'axe-layout.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
const {default:lighthouse}=await import(path.join(process.env.SELF_TEST_MODULES,'lighthouse/core/index.js'));
for(const mode of ['mobile','desktop']){
 const options={port:9222,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']};
 const config=mode==='desktop'?{extends:'lighthouse:default',settings:{formFactor:'desktop',screenEmulation:{mobile:false,width:1280,height:900,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}}:undefined;
 const report=await lighthouse('http://127.0.0.1:8765/',options,config);
 fs.writeFileSync(path.join(output,`lighthouse-${mode}.json`),report.report[0]);fs.writeFileSync(path.join(output,`lighthouse-${mode}.html`),report.report[1].replace(/[ \t]+$/gm,''));
 console.log(mode,JSON.stringify(Object.fromEntries(Object.entries(report.lhr.categories).map(([k,v])=>[k,v.score*100]))));
 console.log('failed',Object.entries(report.lhr.audits).filter(([k,v])=>v.score!==null&&v.score<1).map(([k,v])=>[k,v.title,v.score]));
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
