// Vygeneruje náhled odkazu pro sdílení (1200×630) ve světě webu:
// uhlově černý papír, kostěná sazba a rytá vlna s rudým moaré.
// Stejné tvary i odstíny jako na stránce, aby náhled a web
// vypadaly jako jedna věc.
//
// Písmo je vložené přímo v dokumentu, takže se nic nestahuje ze
// sítě a výsledek vypadá stejně na každém stroji.
//
// Spouští se s cestou k balíčkům z předchozí sady nástrojů:
//   NODE_PATH=../nastroje-v5/node_modules node gen-og.js
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const fs = require('fs');

const REPO = 'C:/Users/filda/PortfolioV2/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const font = f => fs.readFileSync(REPO + 'fonts/' + f).toString('base64');

const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>
@font-face{font-family:'Geist';font-weight:200 800;src:url(data:font/woff2;base64,${font('geist-latin.woff2')}) format('woff2')}
@font-face{font-family:'Geist';font-weight:200 800;src:url(data:font/woff2;base64,${font('geist-latin-ext.woff2')}) format('woff2');unicode-range:U+0100-024F}
@font-face{font-family:'Geist Mono';font-weight:400;src:url(data:font/woff2;base64,${font('geist-mono-latin.woff2')}) format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0b0b0c;color:#f2efe9;
  font-family:'Geist',sans-serif;overflow:hidden;position:relative}

/* rytá pole, stejná jako v úvodu webu */
.ryt{position:absolute;inset:-6%;}
.ryt svg{position:absolute;inset:0;width:100%;height:100%}
.bila{-webkit-mask-image:radial-gradient(52% 64% at 78% 46%,#000 0%,#000 30%,transparent 78%)}
.rud{-webkit-mask-image:radial-gradient(24% 30% at 73% 50%,#000 0%,#000 14%,transparent 74%);
  transform:translateY(10px)}

.obsah{position:absolute;inset:0;padding:0 78px;display:flex;
  flex-direction:column;justify-content:center}

.znacka{font-size:28px;font-weight:600;letter-spacing:-.05em}
.znacka span{color:#ef3a3a}

h1{margin-top:30px;font-size:82px;font-weight:500;line-height:.98;
  letter-spacing:-.045em}
h1 b{font-weight:500;color:#ef3a3a}

.pod{margin-top:34px;padding-top:24px;max-width:560px;
  border-top:1px solid rgba(242,239,233,.16);
  display:flex;gap:28px;
  font-family:'Geist Mono',monospace;font-size:16px;letter-spacing:.12em;
  text-transform:uppercase;color:#8b8882}
.web{margin-top:14px;font-family:'Geist Mono',monospace;font-size:16px;
  letter-spacing:.1em;color:#f2efe9}
</style></head><body>
<div class="ryt">
  <svg class="bila" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="v" width="148" height="52" patternUnits="userSpaceOnUse">
      <path d="M0 26 Q 37 3 74 26 T 148 26" fill="none" stroke="rgba(242,239,233,.16)" stroke-width="1"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>
  <svg class="rud" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="r" width="148" height="52" patternUnits="userSpaceOnUse">
      <path d="M0 26 Q 37 3 74 26 T 148 26" fill="none" stroke="#e0242c" stroke-width="1.2"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#r)"/>
  </svg>
</div>
<div class="obsah">
  <div class="znacka">FL<span>.</span></div>
  <h1>Filip Lochman<br><b>full-stack developer</b></h1>
  <div class="pod"><span>Weby</span><span>Aplikace</span><span>Databáze</span></div>
  <div class="web">filiplochman.cz</div>
</div>
</body></html>`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluateHandle('document.fonts.ready');
  const syrovy = await page.screenshot({ type: 'png' });
  await browser.close();

  // Osm bitů na paletu stačí: obrázek je černá, bílá a jedna rudá.
  const hotovo = await sharp(syrovy).png({ palette: true, colours: 128, effort: 10 }).toBuffer();
  fs.writeFileSync(REPO + 'og-image.png', hotovo);
  console.log('og-image.png:', Math.round(hotovo.length / 1024), 'kB');
})();
