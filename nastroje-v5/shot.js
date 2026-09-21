const puppeteer=require('puppeteer-core');
const arg=process.argv.slice(2);
(async()=>{const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox','--force-device-scale-factor=1','--hide-scrollbars']});
const z=[{n:'m-exp',w:390,h:844,k:'#expertise'},{n:'m-hero',w:390,h:844},{n:'m-proj',w:390,h:844,k:'#projects'},{n:'m-contact',w:390,h:844,k:'#contact'},
 {n:'d-hero',w:1440,h:900},{n:'d-exp',w:1440,h:900,k:'#expertise'},{n:'d-proj',w:1440,h:900,k:'#projects'},{n:'d-contact',w:1440,h:900,k:'#contact'},{n:'t-exp',w:768,h:900,k:'#expertise'}];
for(const s of z){ if(arg.length&&!arg.includes(s.n))continue;
 const p=await b.newPage();await p.setViewport({width:s.w,height:s.h,deviceScaleFactor:1});
 await p.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
 await p.evaluate(()=>document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')));
 if(s.k)await p.evaluate(k=>window.scrollTo({top:document.querySelector(k).offsetTop-70,behavior:'instant'}),s.k);
 await new Promise(r=>setTimeout(r,900));
 await p.screenshot({path:`shots/${s.n}.png`});console.log(s.n);await p.close();}
await b.close()})();
