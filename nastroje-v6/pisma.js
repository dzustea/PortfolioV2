// Stáhne proměnná písma z Google Fonts a uloží je do repa, aby
// ležela na vlastní doméně. Návštěvníkova IP adresa se tím nikam
// neodesílá a obsahová politika může zůstat přísná.
//
// Bere jen znakové sady latin a latin-ext: bez latin-ext by
// v češtině chyběly háčky a kroužky.
//
//   NODE_PATH=../nastroje-v5/node_modules node pisma.js
const fs = require('fs');
const path = require('path');

const CIL = 'C:/Users/filda/PortfolioV2/fonts/';

// Prohlížeč, kterému Google pošle woff2. Bez toho vrátí starší formát.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const rodiny = [
  { url: 'https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&display=swap',
    nazev: 'archivo' },
  { url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..700&display=swap',
    nazev: 'jetbrains' },
];

(async () => {
  for (const r of rodiny) {
    const css = await (await fetch(r.url, { headers: { 'User-Agent': UA } })).text();

    // Google vypíše bloky po znakových sadách; komentář nad blokem
    // říká, o kterou jde.
    const bloky = css.split('/*').slice(1);

    for (const blok of bloky) {
      const sada = blok.slice(0, blok.indexOf('*/')).trim();
      if (sada !== 'latin' && sada !== 'latin-ext') continue;

      const odkaz = (blok.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
      const rozsah = (blok.match(/unicode-range:\s*([^;]+);/) || [])[1];
      if (!odkaz) continue;

      const soubor = r.nazev + '-' + sada + '.woff2';
      const data = Buffer.from(await (await fetch(odkaz)).arrayBuffer());
      fs.writeFileSync(path.join(CIL, soubor), data);

      console.log(soubor, Math.round(data.length / 1024) + ' kB');
      console.log('  unicode-range:' + rozsah);
    }
  }
})();
