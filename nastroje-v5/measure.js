// Změří výšku jednotlivých sekcí na telefonu i na počítači
const puppeteer = require('puppeteer-core');
const URL = 'http://localhost:4173/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const b = await puppeteer.launch({executablePath:CHROME, headless:'new',
    args:['--no-sandbox','--force-device-scale-factor=1','--hide-scrollbars']});
  for (const v of [{n:'telefon 390x844',w:390,h:844},{n:'pocitac 1440x900',w:1440,h:900}]) {
    const p = await b.newPage();
    await p.setViewport({width:v.w,height:v.h,deviceScaleFactor:1});
    await p.goto(URL,{waitUntil:'networkidle0'});
    await p.evaluate(()=>document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')));
    await new Promise(r=>setTimeout(r,400));
    const d = await p.evaluate((vh)=>{
      const g = s => { const e=document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : null; };
      return {
        doc: Math.round(document.documentElement.scrollHeight),
        obrazovek: +(document.documentElement.scrollHeight/vh).toFixed(2),
        hero: g('#hero'), expertise: g('#expertise'), projekty: g('#projects'),
        kontakt: g('#contact'), paticka: g('footer'),
        bArt: g('.b-art'), bOne: g('.b-one'), bTwo: g('.b-two'), bStack: g('.b-stack'),
        presah: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    }, v.h);
    console.log(v.n, JSON.stringify(d,null,1));
    await p.close();
  }
  await b.close();
})();
