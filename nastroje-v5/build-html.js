// Doplní do šablony vyčištěné ikony a loga a uloží hotové index.html
const fs = require('fs');
const sharp = require('sharp');
const d = require('./icons.json');
const REPO = 'C:/Users/filda/PortfolioV2/';

let h = fs.readFileSync(__dirname + '/index.tpl.html', 'utf8');
let chybi = [];

h = h.replace(/\{\{i:([a-z-]+)\}\}/g, (_, k) => {
  const v = d.icons[k];
  if (!v) { chybi.push('ikona ' + k); return ''; }
  return `<svg viewBox="${v.vb}" aria-hidden="true">${v.body}</svg>`;
});
h = h.replace(/\{\{l:([a-z]+)\}\}/g, (_, k) => {
  const v = d.logos[k];
  if (!v) { chybi.push('logo ' + k); return ''; }
  return `<svg viewBox="${v.vb}" aria-hidden="true">${v.body}</svg>`;
});

if (chybi.length) { console.error('CHYBI:', chybi.join(', ')); process.exit(1); }
if (/\{\{/.test(h)) { console.error('zbyl nenahrazeny zastupny text'); process.exit(1); }

fs.writeFileSync(REPO + 'index.html', h);
fs.copyFileSync(__dirname + '/style.css', REPO + 'style.css');
fs.copyFileSync(__dirname + '/script.js', REPO + 'script.js');

// Menší varianty obrázků. Telefon si tak nestahuje podklady
// v rozlišení, které stejně nemá kam vykreslit.
(async () => {
  // Screenshoty projektů žijí jen v dialogu, kde na ně je místo,
  // takže stačí jedna menší varianta pro úzké okno.
  for (const src of ['motivo', 'restovski', 'vyhlidkar', 'hrabalova']) {
    const buf = fs.readFileSync(REPO + src + '.webp');
    await sharp(buf).resize({ width: 680 }).webp({ quality: 74, effort: 6 }).toFile(REPO + src + '-680.webp');
    await sharp(buf).resize({ width: 680 }).avif({ quality: 46, effort: 6 }).toFile(REPO + src + '-680.avif');
  }

  const kb = (f) => (fs.statSync(REPO + f).size / 1024).toFixed(1) + ' kB';
  console.log('index.html', kb('index.html'), '| motivo 680:', kb('motivo-680.avif'));
})();
