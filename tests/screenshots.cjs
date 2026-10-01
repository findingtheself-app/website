// Capture review images outside the repository, never in a deployment bundle.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.SELF_BROWSER_MODULES || process.env.SELF_TEST_MODULES,'playwright'));
(async()=>{
 const output=process.env.SELF_AUDIT_OUTPUT || path.join(require('os').tmpdir(),'self-website-audits');fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.SELF_CHROME_PATH});const geometry=[];
 for(const width of [390,768,1280]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  for(const [name,selector] of [['header','.header'],['hero','.hero'],['tiles','.now-next'],['privacy','.privacy-band'],['footer','.footer'],['food','.food-row'],['movement','.movement-row'],['stillness','.stillness-row']]){
   await page.locator(selector).screenshot({path:path.join(output,`${name}-${width}.png`)});
  }
  const result=await page.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
   const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
   const note=rect(document.querySelector('.floating-note'));
   const overlap=[...document.querySelectorAll('.today-phone p,.today-phone .entry,.today-phone .phone-nav')].filter(e=>intersects(note,rect(e))).map(e=>e.textContent);
   const phones=[...document.querySelectorAll('.screen-field .phone')].map(e=>({label:e.getAttribute('aria-label'),insideViewport:rect(e).left>=0&&rect(e).right<=innerWidth,fieldOverflow:getComputedStyle(e.parentElement).overflow,bodyOverflow:e.scrollHeight>e.clientHeight}));
   const detail=document.querySelector('.footer-details');
   const footerAligned=[...detail.children].every(e=>Math.abs(rect(e).left-rect(detail).left)<1);
   const captionOverlap=[...document.querySelectorAll('.illustration-label')].filter(c=>[...c.parentElement.querySelectorAll('.phone-nav')].some(n=>intersects(rect(c),rect(n)))).map(c=>c.textContent);
   return {overlap,phones,footerAligned,captionOverlap};
  });
  assert.deepEqual(result.overlap,[],`Hero note overlaps screen text at ${width}px`);
  assert.ok(result.phones.every(p=>p.insideViewport&&p.fieldOverflow==='visible'&&!p.bodyOverflow),`Phone clipping at ${width}px`);
  assert.deepEqual(result.captionOverlap,[],`Caption covers tab bar at ${width}px`);
  assert.ok(result.footerAligned,`Footer left edges do not align at ${width}px`);
  geometry.push({width,...result});await page.close();
 }
 await browser.close();fs.writeFileSync(path.join(output,'screen-geometry.json'),JSON.stringify(geometry,null,2));console.log('PASS: hero note avoids screen text, full phones are unclipped, and footer edges align at 390/768/1280px');
})().catch(error=>{console.error(error.message);process.exit(1)});
