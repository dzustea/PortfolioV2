// Celostránkový snímek webu pro kontrolu vzhledu. Náhled v panelu
// editoru umí zamrznout (skrytá záložka staví přechody), tohle
// kreslí ve vlastním Chrome, takže je snímek vždycky aktuální.
//
//   NODE_PATH=../nastroje-v5/node_modules node snimek.js [sirka] [nazev]
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = process.env.PORT || 4173;
const sirka = Number(process.argv[2]) || 1440;
const nazev = process.argv[3] || 'shots/stranka-' + sirka + '.png';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: sirka, height: 900 });
  await page.goto('http://localhost:' + PORT + '/', { waitUntil: 'networkidle0' });

  // Odhalovací efekty se spouštějí až posunem. Pro snímek celé
  // stránky se prostě zapnou všechny najednou, jinak by dolní
  // polovina byla průhledná.
  await page.evaluate(() => {
    document.documentElement.classList.add('ready', 'ready-hned', 'je-odhrnuto');
    document.querySelectorAll('.rv').forEach(p => p.classList.add('bez-prechodu', 'in'));
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: nazev, fullPage: true });
  await browser.close();
  console.log('ulozeno:', nazev);
})();
