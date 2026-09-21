const puppeteer=require('puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox','--hide-scrollbars']});
for(const w of [390,360,768,1440]){
const p=await b.newPage();await p.setViewport({width:w,height:844});
await p.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
const r=await p.evaluate(()=>{window.scrollTo(9999,0);return {x:window.scrollX,bodyScrollW:document.body.scrollWidth,cw:document.documentElement.clientWidth}});
console.log(w, JSON.stringify(r));await p.close();}
await b.close()})();
