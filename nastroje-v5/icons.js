// Stáhne ikony (Phosphor Light, MIT) a loga technologií (Devicon, MIT),
// vyčistí je a uloží jako bezpečné vložitelné SVG.
//
// Čištění: z každého souboru se převezmou jen geometrické prvky
// (path, polyline, line, circle, rect, polygon, ellipse) a jen jejich
// geometrické atributy. Skripty, odkazy, styly a obsluhy událostí se
// do výsledku nedostanou, ani kdyby je zdroj obsahoval.
const https = require('https');
const fs = require('fs');

const get = (url) => new Promise((ok, fail) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
    if (r.statusCode !== 200) return fail(new Error(url + ' -> ' + r.statusCode));
    let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => ok(d));
  }).on('error', fail);
});

const TAGS = ['path', 'polyline', 'polygon', 'line', 'circle', 'ellipse', 'rect'];
const ATTRS = ['d', 'points', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'width', 'height', 'fill-rule', 'clip-rule', 'transform'];

function clean(svg, mode) {
  const vb = (svg.match(/viewBox="([\d.\s-]+)"/) || [])[1] || '0 0 256 256';
  const out = [];
  const re = new RegExp(`<(${TAGS.join('|')})\\b([^>]*?)\\/?>`, 'g');
  let m;
  while ((m = re.exec(svg))) {
    const tag = m[1];
    const attrs = [];
    for (const a of ATTRS) {
      const v = (m[2].match(new RegExp(`\\s${a}="([^"]*)"`)) || [])[1];
      if (v !== undefined && /^[\d\s.,+\-eEa-zA-Z()#]*$/.test(v)) attrs.push(`${a}="${v}"`);
    }
    // Phosphor kreslí obrysy tahem, Devicon výplní
    const hasFillNone = /fill="none"/.test(m[2]);
    if (mode === 'line' && !hasFillNone && tag !== 'path') attrs.push('fill="none"');
    if (mode === 'line' && hasFillNone) attrs.push('fill="none"');
    if (tag === 'rect' && /width="256"/.test(m[2]) && /height="256"/.test(m[2])) continue; // ohraničení ikony
    out.push(`<${tag} ${attrs.join(' ')}/>`);
  }
  return { vb, body: out.join('') };
}

const phosphor = ['arrow-right', 'arrow-up-right', 'arrow-down', 'x', 'plus', 'list',
  'envelope-simple', 'linkedin-logo', 'instagram-logo', 'map-pin',
  'code', 'database', 'lightning', 'shield-check', 'paper-plane-tilt', 'check'];
const devicon = {
  html: 'html5/html5-plain', css: 'css3/css3-plain', js: 'javascript/javascript-plain',
  php: 'php/php-plain', mysql: 'mysql/mysql-original', java: 'java/java-plain',
  kotlin: 'kotlin/kotlin-plain', csharp: 'csharp/csharp-plain', cpp: 'cplusplus/cplusplus-plain',
};

(async () => {
  const result = { icons: {}, logos: {} };
  for (const name of phosphor) {
    const svg = await get(`https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2.1.1/assets/light/${name}-light.svg`);
    result.icons[name] = clean(svg, 'line');
  }
  for (const [key, path] of Object.entries(devicon)) {
    const svg = await get(`https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${path}.svg`);
    result.logos[key] = clean(svg, 'fill');
  }
  fs.writeFileSync(__dirname + '/icons.json', JSON.stringify(result, null, 1));
  for (const [k, v] of Object.entries(result.icons)) console.log('ikona', k.padEnd(16), v.vb, v.body.length + ' zn.');
  for (const [k, v] of Object.entries(result.logos)) console.log('logo ', k.padEnd(16), v.vb, v.body.length + ' zn.');
})().catch((e) => { console.error(e.message); process.exit(1); });
