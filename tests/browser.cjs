const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=(process.env.DANHAUSCH_BASE_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
const artifacts=process.env.TEST_ARTIFACTS||'/tmp/danhausch-ux';fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.webp')?'image/webp':'text/html');res.end(data);});
});
async function inView(page){
 await page.waitForFunction(()=>{
  const heading=document.getElementById('stepHeading');
  const rect=heading.getBoundingClientRect(),header=document.querySelector('header').getBoundingClientRect();
  return document.activeElement===heading&&rect.top>=header.bottom+8&&rect.bottom<innerHeight;
 });
}
async function noOverflow(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');}
(async()=>{
 if(!process.env.DANHAUSCH_BASE_URL)await new Promise(r=>server.listen(8765,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
 for(const width of (process.env.TEST_WIDTHS?process.env.TEST_WIDTHS.split(',').map(Number):[1440,390,320])){
  const page=await browser.newPage({viewport:{width,height:844}}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push(r.url());});
  await page.goto(base+'/');await page.waitForSelector('#stepHeading');await noOverflow(page);
  assert.equal(await page.locator('#heroFlow path').count(),19);
  assert.equal(await page.locator('#network circle').count(),25);
  assert(await page.evaluate(()=>document.getElementById('servicos').offsetTop<document.getElementById('cenarios').offsetTop));
  if(width<761){
   assert(await page.locator('#menuToggle').isVisible());assert(!await page.locator('.dh-nav').isVisible());
   await page.locator('#menuToggle').click();assert(await page.locator('.dh-nav').isVisible());
   await page.keyboard.press('Escape');assert(!await page.locator('.dh-nav').isVisible());assert(await page.locator('#menuToggle').evaluate(e=>document.activeElement===e));
   await page.locator('#menuToggle').click();await page.locator('.dh-nav a[href="/produtos/"]').click();await page.waitForURL(base+'/produtos/');
   await page.goto(base+'/');await page.waitForSelector('#stepHeading');
   assert.equal(await page.locator('.static-scenes h3').count(),2);
   assert(await page.evaluate(()=>document.getElementById('contato').offsetTop<6000),'Mobile home remains too long');
  }else{
   assert(await page.locator('.dh-nav a[href="/produtos/"]').isVisible());
   await page.evaluate(()=>{const track=document.querySelector('.hero-scroll');scrollTo({top:(track.offsetHeight-innerHeight)*.8,behavior:'instant'});});
   await page.waitForFunction(()=>document.getElementById('heroFlow').dataset.progress==='1.000');
  }
  await page.evaluate(()=>{window.testEvents=[];window.addEventListener('danhausch:analytics',e=>window.testEvents.push(e.detail));});
  await page.locator('.hero a[href="#contato"]').click();
  await page.locator('#next').click();assert((await page.locator('#formError').innerText()).includes('Escolha'));
  const names=['goal','revenue','timeline','authority','investment'];
  for(let i=0;i<5;i++){
   assert.equal(await page.locator('.choices input').first().getAttribute('name'),names[i]);
   if(i===1){
    assert.equal(await page.locator('.choices input').count(),11);
    assert(await page.locator('.choices label').first().evaluate(e=>e.getBoundingClientRect().height>=44));
    await page.locator('.choices input').last().check();
   }else await page.locator('.choices input').first().check();
   if(i===2){await page.locator('#languageSwitch').click();assert.equal(await page.locator('.choices input:checked').count(),1);await page.locator('#languageSwitch').click();}
   await page.locator('#next').click();await inView(page);
   if(i===0)await page.screenshot({path:`${artifacts}/${width}-revenue.png`});
  }
  await page.locator('#next').click();assert((await page.locator('#formError').innerText()).includes('Revise'));
  for(const [key,value] of Object.entries({name:'Teste UX',company:'Empresa de teste',email:'ux@example.com',whatsapp:'+55 11 99999-9999'}))await page.locator('#'+key).fill(value);
  assert(await page.locator('#email').getAttribute('required')!==null);assert(await page.locator('#whatsapp').getAttribute('required')!==null);
  await page.locator('#next').click();assert.equal(await page.locator('#whatsappHandoff').count(),0,'Consent must remain mandatory');
  await page.locator('[name="consent"]').check();await page.locator('#email').fill('');await page.locator('#next').click();assert.equal(await page.locator('#whatsappHandoff').count(),0,'Email must remain mandatory');
  await page.locator('#email').fill('ux@example.com');await page.locator('#next').click();await inView(page);
  assert.equal(await page.locator('.summary>div').count(),9);assert.equal(await page.locator('.edit-answer').count(),9);
  await page.locator('[data-edit-step="1"]').click();await inView(page);
  assert.equal(await page.locator('.choices input:checked').getAttribute('value'),'undisclosed');
  await page.locator('input[value="500k_1m"]').check();await page.locator('#next').click();await inView(page);
  assert((await page.locator('#progressText').innerText()).includes('7'));assert((await page.locator('.summary').innerText()).includes('R$ 500 mil'));
  await page.locator('.edit-answer[data-edit-step="5"]').first().click();await inView(page);
  assert.equal(await page.locator('#email').inputValue(),'ux@example.com');await page.locator('#email').fill('');await page.locator('#next').click();assert.equal(await page.locator('#whatsappHandoff').count(),0);
  await page.locator('#email').fill('ux-edited@example.com');await page.locator('#next').click();await inView(page);
  await page.locator('[data-edit-step="0"]').click();await page.locator('input[value="costs"]').check();await page.locator('#back').click();await inView(page);
  assert((await page.locator('.summary').innerText()).includes('Aumentar faturamento'),'Cancel should restore original answer');
  await page.locator('#languageSwitch').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  const handoff=new URL(await page.locator('#whatsappHandoff').getAttribute('href'));
  assert.equal(handoff.origin,'https://wa.me');assert.equal(handoff.pathname,'/5519976298141');
  const message=handoff.searchParams.get('text');assert(message.includes('ux-edited@example.com'));assert(message.includes('BRL 500k'));assert.equal(message.split('\n').length,10);
  const stored=await page.evaluate(()=>({...localStorage}));assert.deepEqual(Object.keys(stored),['danhausch-language']);assert(!JSON.stringify(stored).includes('example.com'));
  for(const event of await page.evaluate(()=>window.testEvents))assert.deepEqual(Object.keys(event).sort(),['event','language','step']);
  assert(!(await page.locator('body').innerText()).includes('[object Object]'));
  await page.screenshot({path:`${artifacts}/${width}-review.png`,fullPage:true});
  for(const url of ['produtos/','empresas/','profissionais/','sobre.html','privacidade.html']){
   await page.goto(base+'/'+url);await noOverflow(page);
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('html').getAttribute('lang'),'en');
   assert.equal(await page.locator('.dh-brand').first().textContent(),'danhausch.');assert.equal(await page.locator('.dh-nav a').count(),4);
   if(url==='produtos/'){assert((await page.locator('.ba-mentorship-product').innerText()).includes('Career mentoring'));assert((await page.locator('.product-condition').first().innerText()).includes('BRL'));assert((await page.locator('a[href*="lp.danhausch.com/ba"]').getAttribute('href')).includes('lang=en'));}
   await page.locator('#languageSwitch').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('html').getAttribute('lang'),'pt-BR');
   await page.keyboard.press('Space');assert.equal(await page.locator('html').getAttribute('lang'),'en');
   if(await page.locator('main .contact').count()){
    const contrast=await page.locator('main .contact h2').evaluate(node=>{
     const rgb=value=>value.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
     const luminance=value=>{const c=rgb(value);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
     const fg=luminance(getComputedStyle(node).color),bg=luminance(getComputedStyle(node.closest('.contact')).backgroundColor);
     return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
    });assert(contrast>=4.5,'Contact heading contrast is too low');
   }
   await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(image=>image.loading='eager'));
   await page.evaluate(()=>Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))));
   await page.screenshot({path:`${artifacts}/${width}-${url.replaceAll('/','')}.png`,fullPage:true});
  }
  await page.goto(base+'/');assert.equal(await page.locator('.choices input:checked').count(),0,'Answers must clear on navigation/reload');
  await page.screenshot({path:`${artifacts}/${width}-home.png`,fullPage:true});
  for(const url of ['ai-portfolio/','form/']){await page.goto(base+'/'+url);await noOverflow(page);}
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await page.close();console.log(`PASS ${width}px: menu, step visibility, dense ranges, edits, required email/phone/consent, translations, pages`);
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base+'/');assert.equal(await reduced.locator('.static-scenes h3').count(),2);assert.equal(await reduced.locator('.hero').evaluate(e=>getComputedStyle(e).position),'relative');await reduced.close();
 const lp=await browser.newPage({viewport:{width:390,height:844}}),posts=[];
 await lp.route('**/*',route=>{
  const url=route.request().url();
  if(!process.env.DANHAUSCH_BASE_URL&&url.startsWith('https://danhausch.com/assets/site-20261028-ux/')){const file=path.join(root,new URL(url).pathname);return route.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.css')?'text/css':'text/javascript'});}
  if(!url.startsWith(base)&&!url.startsWith('https://lp.danhausch.com/ba'))return route.abort();return route.continue();
 });
 lp.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await lp.goto(process.env.DANHAUSCH_BASE_URL?'https://lp.danhausch.com/ba':base+'/landing-pages/ba.html');
 assert.equal(await lp.locator('#checkoutButton').count(),0);assert.equal(await lp.locator('#interestLink').count(),1);assert((await lp.locator('#inscricao').innerText()).includes('ainda não foram definidos'));
 assert((await lp.locator('#interestLink').getAttribute('href')).startsWith('https://wa.me/'));assert.equal(await lp.locator('button').filter({hasText:/pagamento|checkout/i}).count(),0);
 await lp.locator('#languageSwitch').click();assert.equal(await lp.locator('html').getAttribute('lang'),'en');assert((await lp.locator('.dh-nav a').first().getAttribute('href')).includes('lang=en'));assert((await lp.locator('#inscricao').innerText()).includes('have not yet been set'));await lp.locator('#languageSwitch').click();
 await noOverflow(lp);await lp.screenshot({path:`${artifacts}/workshop-interest.png`,fullPage:true});assert.deepEqual(posts,[]);await lp.close();
 await browser.close();server.close();console.log('PASS reduced motion and undated workshop interest flow (no checkout or message submitted)');
})().catch(error=>{console.error(error);server.close();process.exit(1);});
