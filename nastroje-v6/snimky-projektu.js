// Nafotí nasazené projekty načisto: stejná šířka, dvojnásobná
// hustota bodů, stejný ořez. Výsledkem jsou dva formáty na projekt,
// AVIF pro prohlížeče, které ho umí, a WEBP jako záloha.
//
//   NODE_PATH=../nastroje-v5/node_modules node snimky-projektu.js
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const REPO = 'C:/Users/filda/PortfolioV2/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Šířka okna je schválně menší než u počítače: na snímku pak není
// sazba jako mravenci a v náhledu projektu zůstane čitelná.
const SIRKA = 1280;
const VYSKA = 800;

const projekty = [
  { nazev: 'motivo',     url: 'https://motivo.free.nf',            cekej: 2600 },
  { nazev: 'restovski',  url: 'https://restovski.vercel.app/',     cekej: 2200 },
  { nazev: 'vyhlidkar',  url: 'https://vyhlidkar.vercel.app/',     cekej: 3200 },
  { nazev: 'hrabalova',  url: 'https://denisa-hair.vercel.app/',   cekej: 2600 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });

  for (const p of projekty) {
    const page = await browser.newPage();
    await page.setViewport({ width: SIRKA, height: VYSKA, deviceScaleFactor: 2 });

    try {
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 45000 });
    } catch (chyba) {
      console.log(p.nazev, 'se nenačetl:', chyba.message);
      await page.close();
      continue;
    }

    // Prostor na doběhnutí písem a nástupních animací. Bez toho
    // se občas chytne stránka v půlce prolnutí.
    await new Promise(r => setTimeout(r, p.cekej));

    const syrovy = await page.screenshot({ type: 'png' });
    await page.close();

    const zaklad = sharp(syrovy).resize({ width: 1600 });
    await zaklad.clone().webp({ quality: 78 }).toFile(REPO + p.nazev + '.webp');
    await zaklad.clone().avif({ quality: 52 }).toFile(REPO + p.nazev + '.avif');

    const fs = require('fs');
    console.log(
      p.nazev,
      'webp', Math.round(fs.statSync(REPO + p.nazev + '.webp').size / 1024) + ' kB',
      'avif', Math.round(fs.statSync(REPO + p.nazev + '.avif').size / 1024) + ' kB'
    );
  }

  await browser.close();
})();
