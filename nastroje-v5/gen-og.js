// Vygeneruje náhled odkazu pro sdílení (1200×630) ve světě
// rozvaděče: broušená čelní deska, gravírovaný názevník, typový
// štítek a doutnavka. Stejné materiály jako na webu, aby náhled
// a stránka vypadaly jako jedna věc.
//
// Písmo je vložené přímo v dokumentu, takže se nic nestahuje ze
// sítě a výsledek vypadá stejně na každém stroji.
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const fs = require('fs');
const REPO = 'C:/Users/filda/PortfolioV2/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const font = f => fs.readFileSync(REPO + 'fonts/' + f).toString('base64');

const html = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>
@font-face{font-family:'Saira';font-weight:300 800;src:url(data:font/woff2;base64,${font('saira-latin.woff2')}) format('woff2')}
@font-face{font-family:'Saira';font-weight:300 800;src:url(data:font/woff2;base64,${font('saira-latin-ext.woff2')}) format('woff2');unicode-range:U+0100-024F}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0c0b0d;color:#e4dfd4;
  font-family:'Saira',sans-serif;overflow:hidden;position:relative;
  display:grid;place-items:center}

/* světlo v místnosti, stejné jako na stránce */
body::before{content:'';position:absolute;inset:0;
  background:radial-gradient(80% 60% at 50% -18%,rgba(255,45,63,.12),transparent 64%)}

/* čelní deska s broušeným povrchem a šrouby v rozích */
.celo{position:relative;width:1080px;height:510px;border-radius:16px;
  background-color:#17161a;
  background-image:repeating-linear-gradient(90deg,
    rgba(255,255,255,.055) 0 1px,rgba(0,0,0,.065) 1px 2px,transparent 2px 5px);
  background-size:5px 100%;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.085),inset 0 -1px 0 rgba(0,0,0,.6),
    inset 0 0 0 1px rgba(255,255,255,.07);
  display:grid;grid-template-columns:1.18fr .82fr;gap:44px;
  align-items:center;padding:52px 48px}
.sroub{position:absolute;width:11px;height:11px;border-radius:50%;
  background:radial-gradient(circle at 34% 28%,#55545f,#26252c 58%,#111014);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.3),inset 0 -1px 0 rgba(0,0,0,.6)}
.s1{top:16px;left:16px}.s2{top:16px;right:16px}
.s3{bottom:16px;left:16px}.s4{bottom:16px;right:16px}

/* gravírovaný názevník */
.nazevnik{display:inline-block;padding:24px 30px 20px;border-radius:8px;
  background:linear-gradient(180deg,#131218,#0d0c10);
  box-shadow:inset 0 2px 5px rgba(0,0,0,.85),inset 0 -1px 0 rgba(255,255,255,.05),
    inset 0 0 0 1px rgba(0,0,0,.6)}
h1{font-size:76px;font-weight:800;letter-spacing:-.035em;line-height:.95;
  text-transform:uppercase;
  text-shadow:0 -1px 0 rgba(0,0,0,.85),0 -2px 3px rgba(0,0,0,.6),0 1px 0 rgba(255,255,255,.09)}
h1 span{display:block}
.prouzek{display:block;margin-top:16px;padding-top:13px;
  border-top:1px solid rgba(255,255,255,.08);
  font-size:15px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#a8a49b}

/* typový štítek */
.stitek{border-radius:14px;padding:22px 24px 20px;position:relative;
  background:linear-gradient(168deg,#1e1d22,#17161a 72%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 0 0 1px rgba(255,255,255,.07)}
.stitek .hl{margin-bottom:14px;padding-bottom:11px;border-bottom:1px solid rgba(255,255,255,.07);
  font-size:13px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#8d8982;text-align:center}
.r{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:8px 0;
  font-variant-numeric:tabular-nums}
.r + .r{border-top:1px solid rgba(255,255,255,.045)}
.r b{font-size:15px;font-weight:400;color:#8d8982}
.r i{font-size:17px;font-weight:700;font-style:normal;color:#e4dfd4}

/* doutnavka */
.lampa{display:inline-flex;align-items:center;gap:11px;margin-top:18px;
  padding:9px 18px 9px 13px;border-radius:999px;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);background:rgba(255,45,63,.05);
  font-size:13px;font-weight:600;letter-spacing:.15em;text-transform:uppercase}
.lampa u{width:8px;height:8px;border-radius:50%;text-decoration:none;
  background:radial-gradient(circle at 40% 36%,#ff8a7e,#ff2d3f 58%,#8c0d19);
  box-shadow:0 0 9px 1px rgba(255,45,63,.8),inset 0 0 0 1px rgba(255,255,255,.25)}
.pravy{display:flex;flex-direction:column;align-items:stretch}
</style></head><body>
<div class="celo">
  <span class="sroub s1"></span><span class="sroub s2"></span>
  <span class="sroub s3"></span><span class="sroub s4"></span>
  <div>
    <div class="nazevnik">
      <h1><span>Filip</span><span>Lochman</span></h1>
      <span class="prouzek">Full-stack developer</span>
    </div>
  </div>
  <div class="pravy">
    <div class="stitek">
      <p class="hl">Typový štítek</p>
      <div class="r"><b>Nasazené projekty</b><i>4</i></div>
      <div class="r"><b>Cizí skripty</b><i>0</i></div>
      <div class="r"><b>Frameworky</b><i>0</i></div>
      <div class="r"><b>Porušení CSP</b><i>0</i></div>
      <div class="r"><b>Lighthouse, počítač</b><i>100</i></div>
    </div>
    <p class="lampa"><u></u>Otevřen nabídkám</p>
  </div>
</div>
</body></html>`;

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 300));
  const buf = await p.screenshot({ type: 'png' });
  await b.close();

  // Osm bitů na pixel stačí: plocha je tmavá a barev je málo.
  await sharp(buf).png({ palette: true, colors: 128, quality: 88, effort: 10 })
    .toFile(REPO + 'og-image.png');
  console.log('og-image.png', (fs.statSync(REPO + 'og-image.png').size / 1024).toFixed(1) + ' kB');
})();
