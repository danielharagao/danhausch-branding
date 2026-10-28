const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const artifacts=process.env.TEST_ARTIFACTS || '/tmp/danhausch-browser';fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=path.resolve(root,'.'+pathname);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/html');res.end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(8765,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {})});
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900}}); const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8765')&&r.status()>=400)failed.push(r.url());});
  await page.goto('http://127.0.0.1:8765/');await page.waitForSelector('#stepHeading');
  assert.equal(await page.locator('#heroFlow path').count(),19);
  assert.equal(await page.locator('#network circle').count(),25);
  assert.equal(await page.locator('#privacidade').count(),0);
  assert.equal(await page.locator('#como-trabalhamos .step').count(),4);
  assert.equal(await page.locator('#cenarios .pain-grid article').count(),3);
  await page.evaluate(()=>{window.testAnalytics=[];window.addEventListener('danhausch:analytics',e=>window.testAnalytics.push(e.detail));});
  await page.evaluate(()=>{const t=document.querySelector('.hero-scroll');scrollTo({top:(t.offsetHeight-innerHeight)*.75,behavior:'instant'});});
  await page.waitForFunction(()=>document.querySelector('#heroFlow').dataset.progress==='1.000');
  assert(Math.abs((await page.locator('.hero').boundingBox()).y)<1);
  await page.screenshot({path:`${artifacts}/${width}-aligned.png`});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('a[href="#contato"]').first().click();
  await page.locator('#next').click();assert((await page.locator('#formError').innerText()).includes('Escolha'));
  const questionNames=['goal','revenue','timeline','authority','investment'];
  for(let i=0;i<5;i++){
   assert.equal(await page.locator('.choices input').first().getAttribute('name'),questionNames[i]);
   if(i===1)assert.equal(await page.locator('.choices input').count(),11);
   await page.locator('.choices input').first().check();
   if(i===2){await page.locator('#languageSwitch').click();assert.equal(await page.locator('.choices input:checked').count(),1);await page.locator('#languageSwitch').click();}
   await page.locator('#next').click();
  }
  await page.locator('#next').click();assert((await page.locator('#formError').innerText()).includes('Revise'));
  await page.locator('#name').fill('Teste de interface');await page.locator('#company').fill('Empresa de teste');await page.locator('#email').fill('test@example.com');await page.locator('#whatsapp').fill('+55 19 99999-9999');await page.locator('[name="consent"]').check();
  await page.locator('#languageSwitch').click();assert.equal(await page.locator('#name').inputValue(),'Teste de interface');
  await page.locator('[name="consent"]').uncheck();await page.locator('#next').click();assert(await page.locator('#formError').isVisible());assert.equal(await page.locator('#whatsappHandoff').count(),0);
  await page.locator('[name="consent"]').check();await page.locator('#next').click();assert.equal(await page.locator('.summary div').count(),9);assert(await page.locator('#next').isHidden());
  const handoff=new URL(await page.locator('#whatsappHandoff').getAttribute('href'));
  assert.equal(handoff.origin,'https://wa.me');assert.equal(handoff.pathname,'/5519976298141');
  const message=handoff.searchParams.get('text');assert(message.includes('test@example.com'));assert(message.includes('Teste de interface'));assert(message.includes('Annual revenue')||message.includes('annual revenue'));assert.equal(message.split('\n').length,10);
  assert(!(await page.locator('body').innerText()).includes('[object Object]'));
  await page.locator('#languageSwitch').click();assert((await page.locator('#whatsappHandoff').getAttribute('href')).includes('Ol%C3%A1'));await page.locator('#languageSwitch').click();
  const analytics=await page.evaluate(()=>window.testAnalytics);assert(analytics.length>0);for(const event of analytics)assert.deepEqual(Object.keys(event).sort(),['event','language','step']);
  const stored=await page.evaluate(()=>({...localStorage}));assert.deepEqual(Object.keys(stored),['danhausch-language']);assert(!JSON.stringify(stored).includes('test@example.com'));
  await page.screenshot({path:`${artifacts}/${width}-funnel.png`,fullPage:false});
  await page.locator('#back').click();assert.equal(await page.locator('#email').inputValue(),'test@example.com');
  await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('.choices input:checked').count(),0);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';history.replaceState(null,'',location.pathname);scrollTo({top:0,behavior:"instant"});});await page.waitForTimeout(400);await page.screenshot({path:`${artifacts}/${width}-hero.png`});
  await page.evaluate(()=>{const j=document.querySelector('.journey');scrollTo({top:j.offsetTop+j.offsetHeight-innerHeight-10,behavior:"instant"});});await page.waitForTimeout(400);assert.match(await page.locator('#chapter').innerText(),/MOMENTUM/);assert(await page.locator('#back').isHidden());
  for(const url of ['sobre.html','privacidade.html']){await page.goto(`http://127.0.0.1:8765/${url}`);assert.equal(await page.locator('html').getAttribute('lang'),'en');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('#languageSwitch').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('html').getAttribute('lang'),'pt-BR');await page.keyboard.press('Space');assert.equal(await page.locator('html').getAttribute('lang'),'en');if(url==='sobre.html'){assert.equal(await page.locator('.values-grid article').count(),4);assert((await page.locator('.founder h2').innerText()).includes('Daniel'));}else{assert((await page.locator('.legal-content').innerText()).includes('64.283.135/0001-94'));}await page.screenshot({path:`${artifacts}/${width}-${url}.png`,fullPage:true});}
  for(const url of ['produtos/','profissionais/','empresas/','ai-portfolio/','form/']){
   await page.goto(`http://127.0.0.1:8765/${url}`);assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(url==='produtos/'){assert.equal(await page.locator('.ba-mentorship-product').count(),1);assert((await page.locator('.ba-mentorship-product').innerText()).includes('Mentoria de carreira'));assert((await page.locator('.ba-mentorship-product a').getAttribute('href')).startsWith('https://wa.me/'));}
   await page.screenshot({path:`${artifacts}/${width}-${url.replaceAll('/','')}.png`,fullPage:true});
  }
  assert.deepEqual(failed,[]);assert.deepEqual(errors,[]);console.log(`PASS ${width}px: layout, pinned hero, switch keyboard, funnel, translation, page navigation`);await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:8765/');assert.equal(await reduced.locator('.static-scenes h3').count(),2);console.log('PASS reduced motion: all three narrative stages readable');await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
