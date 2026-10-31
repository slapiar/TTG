const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const base=path.resolve(__dirname,'..');
test('Widget: consent, text, private enquiry, minimize, keyboard position and language fallback',async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:900}});const sent=[];
  await page.route('http://ttg.test/**',async route=>{
   const u=new URL(route.request().url());
   if(u.pathname.startsWith('/api/')){
    const data=route.request().postDataJSON();sent.push({route:u.pathname,data});
    const bodies={'/api/session':{session:'f'.repeat(64)},'/api/text':{text:'Prosím, uveďte termín a počet hostí.'},'/api/inquiry':{id:42}};
    return route.fulfill({contentType:'application/json',body:JSON.stringify(bodies[u.pathname]||{})});
   }
   if(u.pathname==='/widget.js'||u.pathname==='/widget.css')return route.fulfill({contentType:u.pathname.endsWith('js')?'text/javascript':'text/css',body:fs.readFileSync(path.join(base,'assets',u.pathname.slice(1)),'utf8')});
   const panel=fs.readFileSync(path.join(base,'panel.php'),'utf8').split('\n').slice(1).join('\n');
   return route.fulfill({contentType:'text/html',body:`<link rel="stylesheet" href="/widget.css"><main><h1>TOPTOUR</h1><p>Obsah stránky</p></main>${panel}<script>window.TTGVoice={api:'http://ttg.test/api/',worklet:'/capture.js',position:'right'}</script><script src="/widget.js"></script>`});
  });
  await page.goto('http://ttg.test/');await page.locator('.ttgv-launch').click();
  await page.locator('.ttgv-text textarea').fill('Chcem program pre hotel.');await page.locator('.ttgv-text button').click();
  await page.waitForFunction(()=>document.querySelector('.ttgv-status').textContent.includes('Potvrďte'));
  assert.equal(sent.length,0,'No API call without consent');
  await page.locator('.ttgv-consent input').check();await page.locator('.ttgv-text button').click();
  await page.waitForFunction(()=>document.querySelector('.ttgv-log').textContent.includes('uveďte termín'));
  assert.equal(sent.filter(x=>x.route==='/api/text').length,1);
  await page.locator('.ttgv-min').click();assert.equal(await page.locator('#ttgv-panel').isVisible(),false);
  await page.locator('.ttgv-launch').click();assert.match(await page.locator('.ttgv-log').textContent(),/hotel/);
  const x=await page.locator('#ttg-voice').evaluate(el=>el.getBoundingClientRect().x);
  await page.locator('header').focus();await page.keyboard.press('ArrowLeft');
  assert.ok((await page.locator('#ttg-voice').evaluate(el=>el.getBoundingClientRect().x))<x);
  await page.locator('.ttgv-language').click();assert.equal(await page.locator('.ttgv-languages').isVisible(),true);
  await page.locator('.ttgv-languages select').selectOption('es');await page.locator('.ttgv-write').click();
  assert.match(await page.locator('.ttgv-status').textContent(),/Prepáčte/);
  await page.locator('.ttgv-inquiry summary').click();await page.locator('input[name=email]').fill('hotel@example.com');
  await page.locator('textarea[name=message]').fill('Prosím o ponuku.');await page.locator('input[name=confirmed]').check();await page.locator('.ttgv-inquiry button').click();
  await page.waitForFunction(()=>document.querySelector('.ttgv-status').textContent.includes('#42'));
  const saved=sent.find(x=>x.route==='/api/inquiry');assert.equal(saved.data.confirmed,true);assert.equal(saved.data.transcript.length,2);
  assert.equal(await page.locator('.ttgv-inquiry button').isDisabled(),true);
  await page.setViewportSize({width:375,height:700});
  const rect=await page.locator('#ttgv-panel').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=375);
 }finally{await browser.close();}
});
