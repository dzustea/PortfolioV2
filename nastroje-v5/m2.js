const puppeteer=require('puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox','--hide-scrollbars']});
const p=await b.newPage();await p.setViewport({width:390,height:844});
await p.goto('http://localhost:4173/',{waitUntil:'networkidle0'});
await p.evaluate(()=>document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')));
await new Promise(r=>setTimeout(r,400));
console.log(JSON.stringify(await p.evaluate(()=>{
 const g=s=>{const e=document.querySelector(s);return e?Math.round(e.getBoundingClientRect().height):null};
 const w=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>document.documentElement.clientWidth+1||r.left<-1)w.push(e.className+'|'+Math.round(r.left)+'..'+Math.round(r.right))});
 return {secHead:g('#expertise .sec-head'),art:g('.art-wrap'),facts:g('.facts'),
  ctHead:g('.ct-head'),ctSub:g('.ct-sub'),ctLinks:g('.ct-links'),ctLink:g('.ct-link'),form:g('#cform'),
  ctSecHead:g('#contact .sec-head'),fg:g('.fg'),ta:g('#fm'),
  clientW:document.documentElement.clientWidth,scrollW:document.documentElement.scrollWidth,
  presahujici:w.slice(0,12)};
},null,1)));
await b.close()})();
