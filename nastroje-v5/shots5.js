const puppeteer = require('puppeteer-core');
const URL = 'http://localhost:4173/';
(async () => {
  const b = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--hide-scrollbars']});
  const z = [
    {n:'v5-hero',    w:1440,h:900},
    {n:'v5-exp',     w:1440,h:900,k:'#expertise'},
    {n:'v5-proj',    w:1440,h:900,k:'#projects'},
    {n:'v5-dlg',     w:1440,h:900,k:'#projects',dlg:0},
    {n:'v5-contact', w:1440,h:900,k:'#contact'},
    {n:'v5-m-hero',  w:390,h:844},
    {n:'v5-m-exp',   w:390,h:844,k:'#expertise'},
    {n:'v5-m-proj',  w:390,h:844,k:'#projects'},
    {n:'v5-m-contact',w:390,h:844,k:'#contact'},
  ];
  for (const s of z) {
    const p = await b.newPage();
    await p.setViewport({width:s.w,height:s.h,deviceScaleFactor:1});
    await p.goto(URL,{waitUntil:'networkidle0'});
    await p.evaluate(()=>document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')));
    if (s.k) await p.evaluate(k=>window.scrollTo({top:document.querySelector(k).offsetTop-80,behavior:'instant'}), s.k);
    if (typeof s.dlg==='number') { await p.evaluate(i=>document.querySelectorAll('[data-dialog]')[i].click(), s.dlg); }
    await new Promise(r=>setTimeout(r,1000));
    await p.screenshot({path:`shots/${s.n}.png`});
    console.log(s.n);
    await p.close();
  }
  await b.close();
})();
