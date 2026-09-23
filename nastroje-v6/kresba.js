// Vygeneruje kresbu do úvodu webu: blok kódu.
//
// Řádky nejsou napsaný text, ale úsečky s délkou a odsazením
// podle skutečné stavby programu. Je z nich poznat zanoření,
// prázdné řádky i konce bloků, přitom se nedá nic přečíst
// a do souboru se nemusí balit písmo.
//
// Kresba je schválně rovná, bez perspektivy: kód drží levá
// svislice a stupně odsazení, a jakmile se blok nakloní, obojí
// se ztratí a zbydou šikmé pruhy. Hloubku proto dělá slabší
// kopie odsazená za hlavním blokem, ne otočení.
//
// Doplňky jsou ty, podle kterých se kód pozná na první pohled:
// pruh s ryskami místo čísel řádků, svislé vodítka odsazení
// a rudý kurzor na jednom řádku.
//
// Všechno se počítá, nic se nekreslí ručně: kompozici i stavbu
// kódu se dá přeladit čísly níž. Výsledek je SVG, ostré v každém
// rozlišení, leží na vlastní doméně a projde přísnou obsahovou
// politikou.
//
//   node kresba.js
const fs = require('fs');

const CIL = 'C:/Users/filda/PortfolioV2/kresba.svg';
const W = 1200, H = 860;

/* ── rozměry ───────────────────────────────────────────────── */

const LEVY = 266;        // kde začíná kód
const KROK = 35;         // rozteč řádků
const PRVNI = 128;       // účaří prvního řádku
const ODSAZENI = 52;     // šířka jednoho stupně odsazení
const DELKA = 940;       // délka nejdelšího možného řádku
const SILA = 13;         // tloušťka řádku

const STIN_X = 26, STIN_Y = 26;   // posun kopie za blokem

/* ── stavba kódu ───────────────────────────────────────────────
   Dvojice [odsazení, délka]. Nula v délce je prázdný řádek, který
   odděluje bloky. Rozvrh je jako u skutečné funkce: hlavička,
   tělo se zanořením, návrat, prázdno, další funkce.
   ─────────────────────────────────────────────────────────── */

const RADKY = [
  [0, 0.52], [1, 0.38], [1, 0.62], [2, 0.44], [2, 0.30],
  [2, 0.50], [1, 0.18], [1, 0.40], [0, 0.11], [0, 0],
  [0, 0.47], [1, 0.58], [1, 0.34], [2, 0.41], [2, 0.54],
  [3, 0.29], [2, 0.15], [1, 0.25], [0, 0.10],
];

// Řádky, které nese rudá: vrchol zanoření a dvě místa, kde se
// v kódu něco děje. Vybrané, ne náhodné.
const RUDE = new Set([3, 11, 15]);
const KURZOR = 15;

const y = i => PRVNI + i * KROK;
const x1 = i => LEVY + RADKY[i][0] * ODSAZENI;
const x2 = i => x1(i) + RADKY[i][1] * DELKA;

const usecka = (a, b, c, d) => `M${a} ${b}L${c} ${d}`;

/* ── řádky ─────────────────────────────────────────────────── */

const hlavni = [], rude = [], stin = [];

for (let i = 0; i < RADKY.length; i++) {
  if (RADKY[i][1] === 0) continue;
  const c = usecka(x1(i), y(i), x2(i), y(i));
  (RUDE.has(i) ? rude : hlavni).push(c);
  stin.push(usecka(x1(i) + STIN_X, y(i) + STIN_Y, x2(i) + STIN_X, y(i) + STIN_Y));
}

/* ── pruh s čísly řádků ────────────────────────────────────────
   Krátké rysky místo číslic: v téhle velikosti by byla čísla
   nečitelná a musel by se kvůli nim do souboru vložit font.
   ─────────────────────────────────────────────────────────── */

const cisla = RADKY.map((_, i) => usecka(LEVY - 96, y(i), LEVY - 58, y(i)));
const delici = usecka(LEVY - 34, y(0) - 26, LEVY - 34, y(RADKY.length - 1) + 26);

/* ── vodítka odsazení ──────────────────────────────────────────
   Svislice u každého stupně zanoření, přesně jak je kreslí
   editor. Táhnou se jen tam, kam sahá blok na daném stupni.
   ─────────────────────────────────────────────────────────── */

const voditka = [];
for (let stupen = 1; stupen <= 3; stupen++) {
  let od = null;
  for (let i = 0; i < RADKY.length; i++) {
    const uvnitr = RADKY[i][1] !== 0 && RADKY[i][0] >= stupen;
    if (uvnitr && od === null) od = i;
    if ((!uvnitr || i === RADKY.length - 1) && od !== null) {
      const konec = uvnitr ? i : i - 1;
      voditka.push(usecka(
        LEVY + stupen * ODSAZENI - 20, y(od) - 14,
        LEVY + stupen * ODSAZENI - 20, y(konec) + 14
      ));
      od = null;
    }
  }
}

/* ── sestavení souboru ─────────────────────────────────────── */

const cesty = pole => pole.map(d => `<path d="${d}"/>`).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Blok kódu s odsazením, číslováním řádků a kurzorem">
<defs>
<radialGradient id="z" cx="48%" cy="50%" r="58%">
<stop offset="0" stop-color="#e0242c" stop-opacity=".28"/>
<stop offset="1" stop-color="#e0242c" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#0b0b0c"/>
<rect width="${W}" height="${H}" fill="url(#z)"/>
<g fill="none" stroke-linecap="round">

<g stroke="#f2efe9" stroke-opacity=".07" stroke-width="${SILA}">${cesty(stin)}</g>

<g stroke="#f2efe9" stroke-opacity=".2" stroke-width="3">${cesty(cisla)}</g>
<path d="${delici}" stroke="#f2efe9" stroke-opacity=".14" stroke-width="2"/>
<g stroke="#f2efe9" stroke-opacity=".1" stroke-width="2">${cesty(voditka)}</g>

<g stroke="#f2efe9" stroke-opacity=".58" stroke-width="${SILA}">${cesty(hlavni)}</g>
<g stroke="#ef3a3a" stroke-opacity=".95" stroke-width="${SILA}">${cesty(rude)}</g>

</g>
<rect x="${x2(KURZOR) + 20}" y="${y(KURZOR) - 17}" width="7" height="34" fill="#ef3a3a"/>
</svg>`;

fs.writeFileSync(CIL, svg);
console.log('kresba.svg:', Math.round(svg.length / 1024), 'kB,',
  (svg.match(/<path/g) || []).length, 'cest');
