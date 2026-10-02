// Run with Node and @php-wasm/node + @php-wasm/universal installed outside web root.
// SELF_TEST_MODULES can point to a temporary node_modules directory.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const modules=process.env.SELF_TEST_MODULES;
const {PHP}=require(modules?path.join(modules,'@php-wasm/universal'):'@php-wasm/universal');
const {loadNodeRuntime,createNodeFsMountHandler}=require(modules?path.join(modules,'@php-wasm/node'):'@php-wasm/node');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'self-signup-test-'));
const pub=path.join(root,'public_html'), priv=path.join(root,'self-private'),data=path.join(priv,'data');
fs.mkdirSync(pub);fs.mkdirSync(data,{recursive:true,mode:0o700});
for(const file of ['signup.php','mail-transport.php','index.html','signup-error.html'])fs.copyFileSync(new URL('../'+file,import.meta.url),path.join(pub,file));
const config=path.join(priv,'signup-config.php'),secret=crypto.randomBytes(32).toString('hex'),salt=crypto.randomBytes(32).toString('hex');
const goodConfig={enabled:true,owner_email:'owner@example.invalid',from_email:'sender@example.invalid',origin:'https://example.invalid',token_secret:secret,ip_salt:salt,data_dir:data};
const setConfig=(values)=>fs.writeFileSync(config,'<?php return json_decode('+JSON.stringify(JSON.stringify(values))+',true);',{mode:0o600});
const php=new PHP(await loadNodeRuntime('8.3',{emscriptenOptions:{processId:1}}));
php.mkdirTree(root);
await php.mount(root,createNodeFsMountHandler(root));
const request=async(method='GET',fields={},server={})=>{
 const r=await php.run({scriptPath:path.join(pub,'signup.php'),method,body:method==='POST'?new TextEncoder().encode(new URLSearchParams(fields).toString()):undefined,headers:{accept:server.HTTP_ACCEPT??'application/json','content-type':'application/x-www-form-urlencoded','content-length':method==='POST'?String(new TextEncoder().encode(new URLSearchParams(fields).toString()).length):'0',origin:server.HTTP_ORIGIN??'https://example.invalid'},$_SERVER:{DOCUMENT_ROOT:pub,REMOTE_ADDR:'192.0.2.1',HTTP_SEC_FETCH_SITE:'same-origin',...server}});
 assert.equal(r.exitCode,0,r.errors);return r;
};
const results=[];
const check=async(label,fn)=>{await fn();results.push(label);console.log('PASS '+label)};
const token=(age=4)=>{const payload=Math.floor(Date.now()/1000)-age+'.'+crypto.randomBytes(16).toString('hex');return payload+'.'+crypto.createHmac('sha256',secret).update(payload).digest('hex')};
const fields=(overrides={})=>({time_token:token(),email:'reader@example.invalid',first_name:'Reader',consent:'launch-v1',website:'',...overrides});
try{
 await check('Missing configuration fails closed',async()=>assert.equal((await request()).httpStatusCode,503));
 setConfig({...goodConfig,enabled:false});
 await check('Explicitly disabled configuration fails closed',async()=>assert.equal((await request()).httpStatusCode,503));
 setConfig({...goodConfig,token_secret:''});
 setConfig({...goodConfig,transport:'unknown'});
 await check('Unknown transport fails closed',async()=>assert.equal((await request()).httpStatusCode,503));
 setConfig({...goodConfig,transport:'smtp',smtp:{}});
 await check('Incomplete SMTP configuration fails closed',async()=>assert.equal((await request()).httpStatusCode,503));
 setConfig({...goodConfig,token_secret:''});
 await check('Incomplete configuration fails closed',async()=>assert.equal((await request()).httpStatusCode,503));
 setConfig({...goodConfig,data_dir:pub});
 await check('Storage within the web root is rejected',async()=>assert.equal((await request()).httpStatusCode,503));
 setConfig(goodConfig);
 await check('Enabled GET mints a signed token and native form',async()=>{const r=await request();assert.equal(r.httpStatusCode,200);assert.match(r.text,/<form method="post" action="signup.php"/);assert.match(r.text,/name="time_token" type="hidden" value="\d{10}\.[a-f0-9]{32}\.[a-f0-9]{64}"/);assert.ok(!r.text.includes('<fieldset disabled>'));assert.equal(r.headers['cache-control'][0],'no-store');assert.match(r.text,/© 2026 findingtheself/)});
 await check('Unsupported methods rejected',async()=>assert.equal((await request('PUT')).httpStatusCode,405));
 for(const [label,values,server,status] of [
  ['Cross-origin rejected',fields(),{HTTP_ORIGIN:'https://evil.example'},403],
  ['Missing Origin rejected',fields(),{HTTP_ORIGIN:''},403],
  ['Cross-site browser hint rejected',fields(),{HTTP_SEC_FETCH_SITE:'cross-site'},403],
  ['Token under three seconds rejected',fields({time_token:token(0)}),{},403],
  ['Expired token rejected',fields({time_token:token(86401)}),{},403],
  ['Future token rejected',fields({time_token:token(-10)}),{},403],
  ['Forged signature rejected',fields({time_token:token().slice(0,-64)+'0'.repeat(64)}),{},403],
  ['Missing token rejected',fields({time_token:''}),{},403],
  ['Invalid email rejected',fields({email:'invalid'}),{},422],
  ['Overlong email rejected',fields({email:'x'.repeat(255)}),{},422],
  ['Header newlines rejected',fields({email:'reader@example.invalid\r\nBcc: x@example.invalid'}),{},422],
  ['Name newlines rejected',fields({first_name:'Reader\nInjected'}),{},422],
  ['Overlong name rejected',fields({first_name:'x'.repeat(81)}),{},422],
  ['Honeypot rejected',fields({website:'filled'}),{},422],
  ['Consent required',fields({consent:''}),{},422],
  ['Consent version must match',fields({consent:'old'}),{},422],
  ['Oversized body rejected',fields({email:'x'.repeat(5000)}),{},413]
 ])await check(label,async()=>{const r=await request('POST',values,server);assert.equal(r.httpStatusCode,status,r.text);assert.ok(!r.text.includes('reader@example.invalid'))});
 const replay=fields();
 await check('Accepted interest is saved even when host mail is unavailable',async()=>{const r=await request('POST',replay);assert.equal(r.httpStatusCode,200,r.text);const rows=fs.readFileSync(path.join(data,'interest.jsonl'),'utf8').trim().split('\n').map(JSON.parse);assert.equal(rows.length,1);assert.equal(rows[0].consent_version,'launch-v1');assert.equal(fs.statSync(path.join(data,'interest.jsonl')).mode&0o777,0o600)});
 await check('Replayed token rejected',async()=>assert.equal((await request('POST',replay)).httpStatusCode,429));
 await check('Optional name and native redirect work',async()=>{const r=await request('POST',fields({first_name:''}),{HTTP_ACCEPT:'text/html'});assert.equal(r.httpStatusCode,303);assert.equal(r.headers.location[0],'thank-you.html')});
 await check('Third interest accepted, fourth rate limited',async()=>{assert.equal((await request('POST',fields())).httpStatusCode,200);assert.equal((await request('POST',fields())).httpStatusCode,429)});
 await check('Rate storage contains only salted hashes and timestamps',async()=>{const raw=fs.readFileSync(path.join(data,'rate.json'),'utf8');assert.ok(!raw.includes('192.0.2.1'));assert.ok(!raw.includes('reader@'));const state=JSON.parse(raw);assert.match(state.hits[0].h,/^[a-f0-9]{64}$/);assert.equal(fs.statSync(path.join(data,'rate.json')).mode&0o777,0o600)});
 await check('Expired rate and replay records are purged',async()=>{fs.writeFileSync(path.join(data,'rate.json'),JSON.stringify({hits:[{h:'old',t:Math.floor(Date.now()/1000)-86401}],tokens:{old:Math.floor(Date.now()/1000)-86401}}));assert.equal((await request('POST',fields())).httpStatusCode,200);assert.ok(!fs.readFileSync(path.join(data,'rate.json'),'utf8').includes('old'))});
 await check('Corrupt rate storage fails closed with no personal data in failure log',async()=>{fs.writeFileSync(path.join(data,'rate.json'),'invalid');assert.equal((await request('POST',fields())).httpStatusCode,503);const log=fs.readFileSync(path.join(data,'failures.log'),'utf8');assert.ok(!log.includes('reader@'));assert.ok(!log.includes('192.0.2.1'));assert.match(log,/storage_failed/)});
 console.log(JSON.stringify({runtime:'PHP 8.3 WebAssembly; host mail unavailable; isolated local temporary files',passed:results.length,results},null,2));
}finally{php.exit();fs.rmSync(root,{recursive:true,force:true})}
