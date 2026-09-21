// Hledá obsah, který uteče za okraj okna. Vlastní posuvné pásy
// (štítky, technologie, náhledy) se přeskakují — ty přetékají
// schválně a mají vlastní posuvník.
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  let nalezeno = 0;
  for (const w of [320, 360, 390, 412, 430, 540, 620, 768, 940, 1024, 1280, 1440, 1920]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: 900 });
    await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
    await new Promise(r => setTimeout(r, 450));
    const ven = await p.evaluate(() => {
      const W = document.documentElement.clientWidth, out = [];
      /* posuvné pásy si přetékat smějí */
      const vlastniPas = e => {
        for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) {
          const o = getComputedStyle(x).overflowX;
          if (o === 'auto' || o === 'scroll') return true;
        }
        return false;
      };
      document.querySelectorAll('main *, header *, footer *, nav *').forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if ((r.right > W + 1 || r.left < -1) && !vlastniPas(e))
          out.push((e.tagName + '.' + (typeof e.className === 'string' ? e.className : '')).trim().slice(0, 44)
            + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']');
      });
      return out.slice(0, 6);
    });
    if (ven.length) nalezeno++;
    console.log(String(w).padStart(5) + ' px', ven.length ? JSON.stringify(ven) : 'ok');
    await p.close();
  }
  console.log(nalezeno ? '\n' + nalezeno + ' sirek s presahem' : '\nzadna sirka nepretece');
  await b.close();
})();
