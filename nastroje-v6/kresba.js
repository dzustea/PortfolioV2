// Vygeneruje kresbu do úvodu webu: blok kódu položený do
// perspektivy. Řádky nejsou napsaný text, ale úsečky s délkou
// a odsazením podle skutečné stavby programu, takže je poznat
// zanoření, prázdné řádky i konce bloků, aniž by se dalo cokoli
// číst a aniž by se musel do SVG balit font.
//
// Za hlavním blokem leží jeho slabší kopie posunutá do hloubky,
// u levého okraje pruh s ryskami místo čísel řádků a na jednom
// řádku rudý kurzor.
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

/* ── kamera ────────────────────────────────────────────────── */

const OHNISKO = 8.2;
const SKLON = 0.52;      // sklopení listu k zemi
const OTOC = -0.2;       // natočení kolem svislé osy
const MERITKO = 214;

function bod(x, y, z) {
  const co = Math.cos(OTOC), so = Math.sin(OTOC);
  let X = x * co - z * so;
  let Z = x * so + z * co;

  const cs = Math.cos(SKLON), ss = Math.sin(SKLON);
  const Y = y * cs - Z * ss;
  Z = y * ss + Z * cs;

  const m = OHNISKO / (OHNISKO - Z);
  return { x: W / 2 + X * m * MERITKO, y: H / 2 + 20 + Y * m * MERITKO, z: Z };
}

const zaokr = p => Math.round(p.x) + ' ' + Math.round(p.y);
const usecka = (a, b) => 'M' + zaokr(a) + 'L' + zaokr(b);

/* ── stavba kódu ───────────────────────────────────────────────
   Dvojice [odsazení, délka]. Nula v délce je prázdný řádek, který
   odděluje bloky. Rozvrh je schválně jako u skutečné funkce:
   hlavička, tělo se zanořením, návrat, prázdno, další funkce.
   ─────────────────────────────────────────────────────────── */

const RADKY = [
  [0, 0.62], [1, 0.44], [1, 0.70], [2, 0.52], [2, 0.38],
  [2, 0.58], [1, 0.22], [1, 0.48], [0, 0.14], [0, 0],
  [0, 0.55], [1, 0.66], [1, 0.40], [2, 0.47], [2, 0.61],
  [3, 0.36], [2, 0.18], [1, 0.30], [0, 0.12],
];

// Řádky, které nese rudá. Vybrané, ne náhodné: vrchol zanoření
// a dvě místa, kde se v kódu něco děje.
const RUDE = new Set([3, 11, 15]);
const KURZOR = 15;

const LEVY = -1.34, DELKA = 3.6;
const ODSAZENI = 0.17;
const KROK = 0.118;
const PRVNI = -((RADKY.length - 1) * KROK) / 2;

function radek(i, y) {
  const [odsaz, delka] = RADKY[i];
  if (delka === 0) return null;
  const z = PRVNI + i * KROK;
  const x1 = LEVY + odsaz * ODSAZENI;
  const x2 = x1 + delka * DELKA;
  return { d: usecka(bod(x1, y, z), bod(x2, y, z)), x2, z };
}

/* Hlavní blok a jeho slabší kopie v hloubce. */
const hlavni = [], rude = [], stin = [];
let konecKurzoru = null;

for (let i = 0; i < RADKY.length; i++) {
  const r = radek(i, 0);
  if (r) {
    (RUDE.has(i) ? rude : hlavni).push(r.d);
    if (i === KURZOR) konecKurzoru = bod(r.x2 + 0.05, 0, r.z);
  }
  const s = radek(i, -0.46);
  if (s) stin.push(s.d);
}

/* ── číslování řádků ───────────────────────────────────────────
   Krátké rysky u levého okraje, jako pruh s čísly řádků
   v editoru. Čísla samotná tam nejsou: v téhle velikosti by byla
   nečitelná a musel by se kvůli nim do souboru vložit font.
   ─────────────────────────────────────────────────────────── */

const cisla = [];
for (let i = 0; i < RADKY.length; i++) {
  const z = PRVNI + i * KROK;
  cisla.push(usecka(bod(LEVY - 0.22, 0, z), bod(LEVY - 0.12, 0, z)));
}

const delici = usecka(
  bod(LEVY - 0.07, 0, PRVNI - 0.09),
  bod(LEVY - 0.07, 0, PRVNI + (RADKY.length - 1) * KROK + 0.09)
);

/* ── sestavení souboru ─────────────────────────────────────── */

const cesty = pole => pole.map(d => `<path d="${d}"/>`).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Blok kódu položený do perspektivy">
<defs>
<radialGradient id="z" cx="50%" cy="52%" r="58%">
<stop offset="0" stop-color="#e0242c" stop-opacity=".3"/>
<stop offset="1" stop-color="#e0242c" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#0b0b0c"/>
<rect width="${W}" height="${H}" fill="url(#z)"/>
<g fill="none" stroke-linecap="round">

<g stroke="#f2efe9" stroke-opacity=".1" stroke-width="7">${cesty(stin)}</g>

<g stroke="#f2efe9" stroke-opacity=".24" stroke-width="1.6">${cesty(cisla)}</g>
<path d="${delici}" stroke="#f2efe9" stroke-opacity=".16" stroke-width="1"/>

<g stroke="#f2efe9" stroke-opacity=".6" stroke-width="8">${cesty(hlavni)}</g>
<g stroke="#ef3a3a" stroke-opacity=".92" stroke-width="8">${cesty(rude)}</g>


</g>
<rect x="${Math.round(konecKurzoru.x)}" y="${Math.round(konecKurzoru.y - 10)}" width="5" height="20" fill="#ef3a3a"/>
</svg>`;

fs.writeFileSync(CIL, svg);
console.log('kresba.svg:', Math.round(svg.length / 1024), 'kB,',
  (svg.match(/<path/g) || []).length, 'cest');
