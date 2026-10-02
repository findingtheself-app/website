import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url), modules=process.env.SELF_TEST_MODULES;
const {PHP}=require(path.join(modules,'@php-wasm/universal'));const {loadNodeRuntime}=require(path.join(modules,'@php-wasm/node'));
const php=new PHP(await loadNodeRuntime('8.3',{emscriptenOptions:{processId:1}}));php.writeFile('/mailer.php',fs.readFileSync(new URL('../mail-transport.php',import.meta.url)));
try{
 const r=await php.run({code:`<?php require '/mailer.php';
 $passed=0;
 foreach ([['250 accepted\\r\\n',[250],true],['250-one\\r\\n250 accepted\\r\\n',[250],true],['550 rejected\\r\\n',[250],false],['250-truncated\\r\\n',[250],false],['',[250],false],[str_repeat('250-line\\r\\n',101),[250],false]] as [$input,$expected,$ok]) {
  $input=str_replace(['\\\\r','\\\\n'],["\\r","\\n"],$input);$stream=fopen('php://memory','w+');fwrite($stream,$input);rewind($stream);
  try {self_smtp_response($stream,$expected);if (!$ok) throw new Exception('expected rejection');} catch(RuntimeException $e) {if ($ok) throw $e;if(str_contains($e->getMessage(),'rejected'))throw new Exception('server reply leaked');}
  fclose($stream);$passed++;
 }
 try {self_send_smtp([], 'synthetic@example.invalid','test','test','synthetic@example.invalid');throw new Exception('bad configuration accepted');} catch(RuntimeException $e) {if($e->getMessage()!=='smtp_config_invalid')throw $e;$passed++;}
 echo $passed;
 `});assert.equal(r.exitCode,0,r.errors);assert.equal(r.text,'7');console.log('PASS: 7 SMTP response/config cases, multiline replies, failure privacy, truncation and response limits');
}finally{php.exit()}
