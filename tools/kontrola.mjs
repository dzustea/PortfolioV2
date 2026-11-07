// KONTROLA PŘED NASAZENÍM
//
// Spouští ji GitHub Actions při každém pushi a pull requestu
// (.github/workflows/kontrola.yml), jde pustit i ručně:
//   node tools/kontrola.mjs
//
// Hlídá, co se na tomhle webu rozbije nejsnáz a nikdo si toho
// hned nevšimne:
//   1. Odkazy na soubory: každá cesta v HTML, CSS, manifestu
//      a vercel.json musí vést na soubor, který se opravdu nasadí.
//   2. Přísná CSP: stránka má script-src a style-src 'self' bez
//      unsafe-inline. Vložený skript, atribut style nebo onclick by
//      prohlížeč potichu zablokoval, takže je musí chytit kontrola.
//   3. Syntaxe: JavaScript, vercel.json, manifest a strukturovaná
//      data pro vyhledávače (JSON-LD).
//   4. Velikost: žádný nasazovaný soubor nesmí být obří.
//
// Bez závislostí, jen Node 22+. Skončí kódem 1, když najde chybu.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KOREN = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STRANKY = ['index.html', 'soukromi.html'];
const MAX_SOUBOR = 5 * 1024 * 1024;

const chyby = [];
const chyba = (kde, co) => chyby.push(`${kde}: ${co}`);
const cti = (f) => fs.readFileSync(path.join(KOREN, f), 'utf8');
const existuje = (f) => fs.existsSync(path.join(KOREN, f));

/* Co Vercel nenasazuje (.vercelignore). Odkaz tam vede do prázdna. */
const ignorovane = existuje('.vercelignore')
  ? cti('.vercelignore').split(/\r?\n/).map((r) => r.trim()).filter((r) => r && !r.startsWith('#'))
  : [];
const nasadiSe = (rel) => !ignorovane.some((v) => v.endsWith('/') ? rel.startsWith(v) : rel === v);

/* Ověří místní odkaz. `zaklad` je složka souboru, ze kterého vede. */
const overOdkaz = (kde, odkaz, zaklad = '') => {
  if (!odkaz || /^(https?:|mailto:|tel:|data:|#|\/\/|javascript:)/i.test(odkaz)) return;
  const bez = decodeURI(odkaz.split(/[?#]/)[0]);
  if (!bez || bez === '/') return;
  const rel = path.posix.normalize(bez.startsWith('/') ? bez.slice(1) : path.posix.join(zaklad, bez));
  if (rel.startsWith('..')) return chyba(kde, `odkaz míří mimo web: ${odkaz}`);
  if (!existuje(rel)) return chyba(kde, `chybí soubor ${rel} (odkaz "${odkaz}")`);
  if (!nasadiSe(rel)) chyba(kde, `${rel} se nenasazuje (.vercelignore), odkaz "${odkaz}" povede do prázdna`);
};

/* ── 1 + 2: HTML ─────────────────────────────────────────────── */
for (const stranka of STRANKY) {
  if (!existuje(stranka)) { chyba(stranka, 'stránka chybí'); continue; }
  const h = cti(stranka);
  // Komentáře se nekontrolují: jsou v nich schované projekty.
  const bezKomentaru = h.replace(/<!--[\s\S]*?-->/g, '');

  for (const m of bezKomentaru.matchAll(/\s(?:src|href|data-src|poster)="([^"]*)"/g)) overOdkaz(stranka, m[1]);
  for (const m of bezKomentaru.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const kus of m[1].split(',')) overOdkaz(stranka, kus.trim().split(/\s+/)[0]);
  }

  for (const m of bezKomentaru.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const atributy = m[1];
    if (/type="application\/ld\+json"/.test(atributy)) {
      try { JSON.parse(m[2]); } catch (e) { chyba(stranka, `JSON-LD nejde přečíst: ${e.message}`); }
      continue;
    }
    if (!/\ssrc="/.test(atributy)) chyba(stranka, 'vložený <script> bez src: CSP (script-src \'self\') ho zablokuje');
    const src = (atributy.match(/\ssrc="([^"]*)"/) || [])[1] || '';
    if (/^(https?:)?\/\//.test(src)) chyba(stranka, `skript z cizí domény: ${src}`);
  }
  if (/<style\b/i.test(bezKomentaru)) chyba(stranka, 'značka <style>: CSP (style-src \'self\') ji zablokuje, styl patří do css/');
  for (const m of bezKomentaru.matchAll(/<[a-z][^>]*\sstyle="/gi)) chyba(stranka, `atribut style: CSP ho zablokuje (${m[0].slice(0, 40)}…)`);
  for (const m of bezKomentaru.matchAll(/<[a-z][^>]*\s(on[a-z]+)="/gi)) chyba(stranka, `obsluha ${m[1]} v atributu: CSP ji zablokuje, patří do js/`);
  for (const m of bezKomentaru.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="((?:https?:)?\/\/[^"]+)"/g)) chyba(stranka, `styl z cizí domény: ${m[1]}`);

  // id se nesmí opakovat: drží na nich mapa, karty i čtečky obrazovky.
  const idcka = [...bezKomentaru.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dvakrat = [...new Set(idcka.filter((id, i) => idcka.indexOf(id) !== i))];
  for (const id of dvakrat) chyba(stranka, `id="${id}" je na stránce víckrát`);
}

/* ── 1: CSS ──────────────────────────────────────────────────── */
const projdi = (slozka, pripona, vysledek = []) => {
  const plna = path.join(KOREN, slozka);
  if (!fs.existsSync(plna)) return vysledek;
  for (const z of fs.readdirSync(plna, { withFileTypes: true })) {
    const rel = path.posix.join(slozka, z.name);
    if (z.isDirectory()) { if (z.name !== 'node_modules') projdi(rel, pripona, vysledek); }
    else if (rel.endsWith(pripona)) vysledek.push(rel);
  }
  return vysledek;
};
for (const css of [...projdi('css', '.css'), ...projdi('vendor', '.css')]) {
  const s = cti(css).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of s.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) overOdkaz(css, m[1], path.posix.dirname(css));
}

/* ── 1 + 3: manifest a vercel.json ───────────────────────────── */
try {
  const man = JSON.parse(cti('site.webmanifest'));
  for (const ik of man.icons || []) overOdkaz('site.webmanifest', ik.src);
} catch (e) { chyba('site.webmanifest', `nejde přečíst: ${e.message}`); }

try {
  const v = JSON.parse(cti('vercel.json'));
  for (const p of v.redirects || []) overOdkaz('vercel.json (redirects)', p.destination);
  for (const blok of v.headers || []) {
    for (const hl of blok.headers || []) {
      if (hl.key === 'Link') for (const m of hl.value.matchAll(/<([^>]+)>/g)) overOdkaz('vercel.json (Link)', m[1]);
      if (hl.key === 'Content-Security-Policy') {
        if (/script-src[^;]*'unsafe-inline'/.test(hl.value)) chyba('vercel.json', 'CSP povoluje unsafe-inline ve skriptech');
        if (/style-src[^;]*'unsafe-inline'/.test(hl.value)) chyba('vercel.json', 'CSP povoluje unsafe-inline ve stylech');
      }
    }
  }
} catch (e) { chyba('vercel.json', `nejde přečíst: ${e.message}`); }

/* ── 3: JavaScript ───────────────────────────────────────────── */
const skripty = [...projdi('js', '.js'), ...projdi('vendor', '.js'), ...projdi('tools', '.mjs')];
for (const f of skripty) {
  try { execFileSync(process.execPath, ['--check', path.join(KOREN, f)], { stdio: 'pipe' }); }
  catch (e) { chyba(f, `syntaktická chyba\n${String(e.stderr || e.message).trim().split('\n').slice(0, 4).join('\n')}`); }
}

/* ── 4: velikost nasazovaných souborů ────────────────────────── */
for (const f of projdi('.', '')) {
  const rel = f.replace(/^\.\//, '');
  if (rel.startsWith('.git/') || !nasadiSe(rel)) continue;
  const v = fs.statSync(path.join(KOREN, rel)).size;
  if (v > MAX_SOUBOR) chyba(rel, `má ${(v / 1048576).toFixed(1)} MB, strop je ${MAX_SOUBOR / 1048576} MB`);
}

/* ── VÝSLEDEK ────────────────────────────────────────────────── */
if (chyby.length) {
  console.error(`Kontrola našla ${chyby.length} ${chyby.length === 1 ? 'chybu' : chyby.length < 5 ? 'chyby' : 'chyb'}:\n`);
  for (const c of chyby) console.error(' ✗ ' + c);
  // V GitHub Actions se chyby ukážou i jako poznámky u souborů.
  if (process.env.GITHUB_ACTIONS) for (const c of chyby) console.log(`::error title=Kontrola webu::${c.replace(/\n/g, '%0A')}`);
  process.exit(1);
}
console.log(`Kontrola prošla: ${STRANKY.length} stránky, ${skripty.length} skriptů, odkazy, CSP i JSON v pořádku.`);
