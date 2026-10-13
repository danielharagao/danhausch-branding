const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const file=path.join(root,req.url==='/'?'index.html':req.url.split('?')[0]);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data);});});
(async()=>{
 await new Promise(r=>server.listen(8765,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true});
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/');await page.waitForSelector('#stepHeading');
  assert.equal(await page.locator('#heroFlow path').count(),19);
  assert.equal(await page.locator('#network circle').count(),25);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('a[href="#contato"]').first().click();
  await page.locator('#next').click();assert((await page.locator('#formError').innerText()).includes('Escolha'));
  for(let i=0;i<5;i++){
   await page.locator('.choices input').first().check();
   if(i===2){await page.locator('[data-lang="en"]').click();assert.equal(await page.locator('.choices input:checked').count(),1);await page.locator('[data-lang="pt"]').click();}
   await page.locator('#next').click();
  }
  await page.locator('#next').click();assert((await page.locator('#formError').innerText()).includes('Revise'));
  await page.locator('#name').fill('Teste de interface');await page.locator('#company').fill('Empresa de teste');await page.locator('#email').fill('test@example.com');await page.locator('#whatsapp').fill('+55 19 99999-9999');await page.locator('[name="consent"]').check();
  await page.locator('[data-lang="en"]').click();assert.equal(await page.locator('#name').inputValue(),'Teste de interface');
  await page.locator('#next').click();assert.equal(await page.locator('.summary div').count(),9);assert(await page.locator('#next').isDisabled());
  await page.screenshot({path:`/tmp/avenor-${width}-funnel.png`,fullPage:false});
  await page.locator('#back').click();assert.equal(await page.locator('#email').inputValue(),'test@example.com');
  await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('.choices input:checked').count(),0);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';history.replaceState(null,'',location.pathname);scrollTo({top:0,behavior:"instant"});});await page.waitForTimeout(400);await page.screenshot({path:`/tmp/avenor-${width}-hero.png`});
  await page.evaluate(()=>{const j=document.querySelector('.journey');scrollTo({top:j.offsetTop+j.offsetHeight-innerHeight-10,behavior:"instant"});});await page.waitForTimeout(400);assert.match(await page.locator('#chapter').innerText(),/MOMENTUM/);assert(await page.locator('#back').isHidden());
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px: layout, effects, validation, translation, review, persistence`);await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:8765/');assert.equal(await reduced.locator('.static-scenes h3').count(),2);console.log('PASS reduced motion: all three narrative stages readable');await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
