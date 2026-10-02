// Read-only browser verification; never sends mail or fills personal details.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.SELF_BROWSER_MODULES||process.env.SELF_TEST_MODULES,'playwright'));
(async()=>{
 const root=path.resolve(__dirname,'..'),origin=JSON.parse(fs.readFileSync(path.join(root,'config/site.json'))).CANONICAL_ORIGIN;
 assert.ok(origin?.startsWith('https://'));const output=process.env.SELF_AUDIT_OUTPUT;assert.ok(output);fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.SELF_CHROME_PATH});const results=[];
 for(const width of [390,1280]){
  for(const [label,route] of [['home','/'],['privacy','/privacy.html'],['thanks','/thank-you.html'],['signup','/signup.php']]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',bypassCSP:true});const insecure=[],errors=[];
   page.on('request',r=>{if(r.url().startsWith('http://'))insecure.push(r.url())});page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(origin+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
   const headers=response.headers();assert.match(headers['x-robots-tag'],/noindex/);assert.equal(headers['x-content-type-options'],'nosniff');assert.match(headers['content-security-policy'],/script-src 'none'/);
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,cookies:document.cookie,localStorage:localStorage.length,fieldsEmpty:[...document.querySelectorAll('input[type=email],input[name=first_name]')].every(i=>!i.value)}));
   assert.equal(layout.overflow,false);assert.equal(layout.cookies,'');assert.equal(layout.localStorage,0);assert.ok(layout.fieldsEmpty);assert.deepEqual(insecure,[]);assert.deepEqual(errors,[]);
   await page.addScriptTag({content:fs.readFileSync(path.join(process.env.SELF_TEST_MODULES,'axe-core/axe.min.js'),'utf8')});
   const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}}));
   const violations=audit.violations.map(v=>({id:v.id,impact:v.impact}));assert.deepEqual(violations,[],`${label} at ${width}px`);
   await page.screenshot({path:path.join(output,`${label}-${width}.png`),fullPage:true});
   if(label==='home')for(const [name,selector] of [['header','.header'],['hero','.hero'],['tiles','.now-next'],['footer','.footer'],['signup-card','.early-access']])await page.locator(selector).screenshot({path:path.join(output,`${name}-${width}.png`)});
   results.push({page:label,width,status:response.status(),...layout,mixedContent:false,violations});await page.close();
  }
 }
 await browser.close();fs.writeFileSync(path.join(output,'live-browser.json'),JSON.stringify(results,null,2));console.log('PASS: HTTPS pages and signed form at 390/1280px; security headers/noindex; zero axe violations; no mixed content, overflow, cookies or local storage; screenshots saved outside repository');
})().catch(e=>{console.error(e.message);process.exit(1)});
