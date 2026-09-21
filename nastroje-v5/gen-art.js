// Generátor ilustrací: částicová koule a izometrický full-stack.
// Výstup jsou statické WebP s průhledností, takže v prohlížeči
// nestojí žádný výpočet navíc.
const sharp = require('sharp');
const fs = require('fs');
const OUT = 'C:/Users/filda/PortfolioV2/';

// deterministický pseudonáhodný generátor, aby výsledek byl pokaždé stejný
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

const mix = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const rgb = (c1, c2, t) => {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return `rgb(${a.map((v, i) => Math.round(mix(v, b[i], t))).join(',')})`;
};
const f = (n) => n.toFixed(1);

/* ══ ČÁSTICOVÁ KOULE ═══════════════════════════════════════════ */
function orb() {
  const W = 1000, cx = 500, cy = 470, R = 330, N = 3800;
  const tiltX = -0.32, rotY = 0.45;
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < N; i++) {
    const yy = 1 - (i / (N - 1)) * 2;
    const rr = Math.sqrt(1 - yy * yy);
    const th = golden * i;
    let x = Math.cos(th) * rr + (rnd() - 0.5) * 0.02, y = yy + (rnd() - 0.5) * 0.02, z = Math.sin(th) * rr + (rnd() - 0.5) * 0.02;
    const nn = Math.hypot(x, y, z); x /= nn; y /= nn; z /= nn;
    // otočení kolem Y
    let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
    let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
    // náklon kolem X
    let y2 = y * Math.cos(tiltX) - z1 * Math.sin(tiltX);
    let z2 = y * Math.sin(tiltX) + z1 * Math.cos(tiltX);
    const jitter = 1 + (rnd() - 0.5) * 0.035;
    pts.push({ x: x1 * jitter, y: y2 * jitter, z: z2 });
  }

  // prach, který z koule stéká dolů
  for (let i = 0; i < 520; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.pow(rnd(), 0.6);
    pts.push({
      x: Math.cos(a) * d * 1.05,
      y: -0.75 - rnd() * 0.55 * d - Math.abs(Math.sin(a)) * 0.15,
      z: Math.sin(a) * d * 0.4,
      dust: true,
    });
  }

  pts.sort((a, b) => a.z - b.z);

  let dots = '', bloom = '';
  for (const p of pts) {
    const t = (p.z + 1) / 2;
    const light = clamp(0.25 + 0.55 * t + 0.35 * ((p.y + 1) / 2));
    const sx = cx + p.x * R, sy = cy - p.y * R;
    let r, op, col;
    if (p.dust) {
      r = 0.6 + rnd() * 1.1;
      op = 0.12 + rnd() * 0.35;
      col = rgb('#7a1020', '#ff3048', rnd());
    } else {
      const rim = Math.exp(-(p.z * p.z) / 0.03);
      const tw = 0.8 + rnd() * 0.4;
      r = 0.45 + 1.55 * Math.pow(t, 1.6) + rim * 0.5;
      op = clamp((0.1 + 0.9 * t * light) * tw + rim * 0.55);
      const heat = clamp(light * t * tw + rim * 0.45);
      col = heat > 0.55 ? rgb('#ff3048', '#ffc1c9', (heat - 0.55) / 0.45) : rgb('#4a0612', '#ff3048', heat / 0.55);
    }
    dots += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(r)}" fill="${col}" fill-opacity="${op.toFixed(2)}"/>`;
    if (!p.dust && ((t > 0.6 && light > 0.55) || (p.z > -0.05 && Math.abs(p.z) < 0.12))) {
      bloom += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(r * 2.2)}" fill="#ff3048" fill-opacity="${(op * 0.5).toFixed(2)}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
  <defs>
    <filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
    <radialGradient id="core" cx="50%" cy="40%" r="50%">
      <stop offset="0" stop-color="#ff3048" stop-opacity=".22"/>
      <stop offset="1" stop-color="#ff3048" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="${R * 1.05}" fill="url(#core)"/>
  <g filter="url(#b)">${bloom}</g>
  <g>${dots}</g>
</svg>`;
}

/* ══ IZOMETRICKÝ FULL-STACK ════════════════════════════════════ */
function iso() {
  const W = 1000, H = 820, ox = 500, oy = 470;
  const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
  const P = (x, y, z) => [ox + (x - y) * c, oy + (x + y) * s - z];
  const poly = (pts) => pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ');
  let out = '', glow = '';

  const box = (w, d, h, z0, o = {}) => {
    const x0 = -w / 2, y0 = -d / 2, x1 = w / 2, y1 = d / 2, z1 = z0 + h;
    const top = [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)];
    const right = [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)];
    const left = [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)];
    out += `<polygon points="${poly(left)}" fill="url(#fl)"/>`;
    out += `<polygon points="${poly(right)}" fill="url(#fr)"/>`;
    out += `<polygon points="${poly(top)}" fill="${o.topFill || 'url(#ft)'}"/>`;
    const edge = `<polyline points="${poly([P(x0, y1, z1), P(x0, y0, z1), P(x1, y0, z1), P(x1, y0, z0)])}" fill="none"/>` +
      `<polyline points="${poly([P(x0, y1, z1), P(x1, y1, z1), P(x1, y0, z1)])}" fill="none"/>` +
      `<polyline points="${poly([P(x0, y1, z1), P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0)])}" fill="none"/>` +
      `<line x1="${f(P(x1, y1, z1)[0])}" y1="${f(P(x1, y1, z1)[1])}" x2="${f(P(x1, y1, z0)[0])}" y2="${f(P(x1, y1, z0)[1])}"/>`;
    out += `<g stroke="#ff3048" stroke-width="${o.sw || 1.6}" stroke-opacity="${o.so || .9}" stroke-linejoin="round">${edge}</g>`;
    glow += `<g stroke="#ff3048" stroke-width="5" stroke-opacity=".7">${edge}</g>`;
    return { x0, y0, x1, y1, z0, z1 };
  };

  const ring = (r, z, n = 72) => {
    const a = [];
    for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2; a.push(P(Math.cos(t) * r, Math.sin(t) * r, z)); }
    return a;
  };
  const arc = (r, z, from, to, n = 40) => {
    const a = [];
    for (let i = 0; i <= n; i++) { const t = from + (to - from) * (i / n); a.push(P(Math.cos(t) * r, Math.sin(t) * r, z)); }
    return a;
  };

  // podstava s mřížkou a vodivými cestami
  const base = box(520, 520, 14, -40, { sw: 1.1, so: .55, topFill: 'url(#fp)' });
  for (let i = -240; i <= 240; i += 40) {
    out += `<line x1="${f(P(i, -260, -26)[0])}" y1="${f(P(i, -260, -26)[1])}" x2="${f(P(i, 260, -26)[0])}" y2="${f(P(i, 260, -26)[1])}" stroke="#ffffff" stroke-opacity=".05"/>`;
    out += `<line x1="${f(P(-260, i, -26)[0])}" y1="${f(P(-260, i, -26)[1])}" x2="${f(P(260, i, -26)[0])}" y2="${f(P(260, i, -26)[1])}" stroke="#ffffff" stroke-opacity=".05"/>`;
  }
  const traces = [
    [[-240, 60], [-150, 60], [-150, 20], [-60, 20]],
    [[60, 240], [60, 150], [20, 150], [20, 70]],
    [[240, -40], [160, -40], [160, 10], [80, 10]],
    [[-80, -240], [-80, -150], [-30, -150], [-30, -80]],
  ];
  for (const t of traces) {
    const pts = t.map(([x, y]) => P(x, y, -26));
    const line = `<polyline points="${poly(pts)}" fill="none"/>`;
    out += `<g stroke="#ff3048" stroke-width="1.8" stroke-opacity=".85">${line}</g>`;
    glow += `<g stroke="#ff3048" stroke-width="6" stroke-opacity=".6">${line}</g>`;
    const e = pts[0];
    out += `<circle cx="${f(e[0])}" cy="${f(e[1])}" r="3.2" fill="#ffc1c9"/>`;
  }

  // databáze jako válec
  const r = 118, zb = -20, zt = 50;
  const side = [...arc(r, zb, -Math.PI / 4, Math.PI * 3 / 4), ...arc(r, zt, Math.PI * 3 / 4, -Math.PI / 4)];
  out += `<polygon points="${poly(side)}" fill="url(#fcyl)"/>`;
  for (const zz of [zb + 24, zb + 48]) {
    const l = `<polyline points="${poly(arc(r, zz, -Math.PI / 4, Math.PI * 3 / 4))}" fill="none"/>`;
    out += `<g stroke="#ff3048" stroke-width="1.3" stroke-opacity=".6">${l}</g>`;
  }
  const topRing = `<polygon points="${poly(ring(r, zt))}"/>`;
  out += `<g fill="#1a1016" stroke="#ff3048" stroke-width="1.6">${topRing}</g>`;
  out += `<polygon points="${poly(ring(r * 0.62, zt))}" fill="none" stroke="#ff3048" stroke-opacity=".45"/>`;
  const cylEdge = `<polyline points="${poly(arc(r, zb, -Math.PI / 4, Math.PI * 3 / 4))}" fill="none"/>` +
    `<line x1="${f(P(Math.cos(-Math.PI / 4) * r, Math.sin(-Math.PI / 4) * r, zb)[0])}" y1="${f(P(Math.cos(-Math.PI / 4) * r, Math.sin(-Math.PI / 4) * r, zb)[1])}" x2="${f(P(Math.cos(-Math.PI / 4) * r, Math.sin(-Math.PI / 4) * r, zt)[0])}" y2="${f(P(Math.cos(-Math.PI / 4) * r, Math.sin(-Math.PI / 4) * r, zt)[1])}"/>` +
    `<line x1="${f(P(Math.cos(Math.PI * 3 / 4) * r, Math.sin(Math.PI * 3 / 4) * r, zb)[0])}" y1="${f(P(Math.cos(Math.PI * 3 / 4) * r, Math.sin(Math.PI * 3 / 4) * r, zb)[1])}" x2="${f(P(Math.cos(Math.PI * 3 / 4) * r, Math.sin(Math.PI * 3 / 4) * r, zt)[0])}" y2="${f(P(Math.cos(Math.PI * 3 / 4) * r, Math.sin(Math.PI * 3 / 4) * r, zt)[1])}"/>`;
  out += `<g stroke="#ff3048" stroke-width="1.6">${cylEdge}</g>`;
  glow += `<g stroke="#ff3048" stroke-width="6" stroke-opacity=".6">${cylEdge}${topRing.replace('<polygon', '<polygon fill="none"')}</g>`;

  // světelné sloupy mezi vrstvami
  const beam = (x, y, z0, z1) => {
    const a = P(x, y, z0), b = P(x, y, z1);
    out += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="url(#beam)" stroke-width="2"/>`;
  };
  for (const [x, y] of [[-96, -96], [96, -96], [-96, 96], [96, 96]]) beam(x, y, 50, 128);

  // serverová deska s diodami
  const srv = box(236, 236, 56, 128);
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 7; i++) {
      const yy = srv.y0 + 26 + i * 28;
      const zz = srv.z0 + 18 + row * 20;
      const p = P(srv.x1, yy, zz);
      const on = (i + row) % 3 !== 0;
      out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.6" fill="${on ? '#ff3048' : '#3a1a22'}"/>`;
      if (on) glow += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="5" fill="#ff3048" fill-opacity=".7"/>`;
    }
    const a = P(srv.x0 + 30, srv.y1, srv.z0 + 18 + row * 20), b = P(srv.x1 - 30, srv.y1, srv.z0 + 18 + row * 20);
    out += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="#ffffff" stroke-opacity=".14" stroke-width="3" stroke-linecap="round"/>`;
  }

  for (const [x, y] of [[-96, -96], [96, -96], [-96, 96], [96, 96]]) beam(x, y, 184, 252);

  // okno prohlížeče s kódem
  const ui = box(290, 290, 14, 252);
  const zt2 = ui.z1 + 0.5;
  const bar = [P(ui.x0 + 14, ui.y0 + 14, zt2), P(ui.x1 - 14, ui.y0 + 14, zt2), P(ui.x1 - 14, ui.y0 + 44, zt2), P(ui.x0 + 14, ui.y0 + 44, zt2)];
  out += `<polygon points="${poly(bar)}" fill="#ffffff" fill-opacity=".06"/>`;
  [0, 1, 2].forEach((i) => {
    const p = P(ui.x0 + 30 + i * 18, ui.y0 + 29, zt2);
    out += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.4" fill="${i === 0 ? '#ff3048' : '#ffffff'}" fill-opacity="${i === 0 ? 1 : .3}"/>`;
  });
  const lines = [[60, 150], [60, 110], [80, 170], [80, 120], [60, 90]];
  lines.forEach(([x, len], i) => {
    const a = P(ui.x0 + 30, ui.y0 + 70 + i * 22 + (i > 1 ? 140 : 0), zt2), b = P(ui.x0 + 30 + len, ui.y0 + 70 + i * 22 + (i > 1 ? 140 : 0), zt2);
    out += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="#ffffff" stroke-opacity="${i === 2 ? .35 : .16}" stroke-width="5" stroke-linecap="round"/>`;
  });
  // symbol </> sazený v rovině okna: řádek vede po ose x, nahoru je -y
  const gy = (ui.y0 + ui.y1) / 2 + 20, gx = ui.x0 + 60, hh = 34, ww = 26;
  const G = (x, up) => P(x, gy - up, zt2);
  const g1 = [G(gx + ww, hh), G(gx, 0), G(gx + ww, -hh)];
  const g2 = [G(gx + 44, -hh - 4), G(gx + 70, hh + 4)];
  const g3 = [G(gx + 88, hh), G(gx + 88 + ww, 0), G(gx + 88, -hh)];
  const glyph = `<polyline points="${poly(g1)}" fill="none"/><polyline points="${poly(g2)}" fill="none"/><polyline points="${poly(g3)}" fill="none"/>`;
  out += `<g stroke="#ffc1c9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>`;
  glow += `<g stroke="#ff3048" stroke-width="14" stroke-opacity=".9" stroke-linecap="round">${glyph}</g>`;

  // plovoucí kostičky a částice
  const cube = (x, y, z, a) => {
    const t = [P(x, y, z + a), P(x + a, y, z + a), P(x + a, y + a, z + a), P(x, y + a, z + a)];
    const rr = [P(x + a, y, z), P(x + a, y + a, z), P(x + a, y + a, z + a), P(x + a, y, z + a)];
    const ll = [P(x, y + a, z), P(x + a, y + a, z), P(x + a, y + a, z + a), P(x, y + a, z + a)];
    out += `<polygon points="${poly(ll)}" fill="url(#fl)"/><polygon points="${poly(rr)}" fill="url(#fr)"/><polygon points="${poly(t)}" fill="#2a1219"/>`;
    const e = `<polygon points="${poly(t)}" fill="none"/><polyline points="${poly([P(x, y + a, z + a), P(x, y + a, z), P(x + a, y + a, z), P(x + a, y, z), P(x + a, y, z + a)])}" fill="none"/><line x1="${f(P(x + a, y + a, z)[0])}" y1="${f(P(x + a, y + a, z)[1])}" x2="${f(P(x + a, y + a, z + a)[0])}" y2="${f(P(x + a, y + a, z + a)[1])}"/>`;
    out += `<g stroke="#ff3048" stroke-width="1.3">${e}</g>`;
    glow += `<g stroke="#ff3048" stroke-width="4" stroke-opacity=".6">${e}</g>`;
  };
  cube(-300, -60, 180, 36);
  cube(220, -250, 240, 28);
  cube(260, 120, 90, 32);
  cube(-230, 210, 300, 24);

  let dust = '';
  for (let i = 0; i < 90; i++) {
    const x = (rnd() - 0.5) * 760, y = (rnd() - 0.5) * 760, z = rnd() * 420;
    const p = P(x, y, z);
    dust += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(0.8 + rnd() * 1.6)}" fill="#ff8a9a" fill-opacity="${(0.15 + rnd() * 0.5).toFixed(2)}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1118"/><stop offset="1" stop-color="#0b0a0e"/></linearGradient>
    <linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241820"/><stop offset="1" stop-color="#100d12"/></linearGradient>
    <linearGradient id="ft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a22"/><stop offset="1" stop-color="#16121a"/></linearGradient>
    <linearGradient id="fp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#140f14"/><stop offset="1" stop-color="#0a090c"/></linearGradient>
    <linearGradient id="fcyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0d0a0e"/><stop offset=".55" stop-color="#2a1720"/><stop offset="1" stop-color="#120d12"/></linearGradient>
    <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff3048" stop-opacity=".1"/><stop offset=".5" stop-color="#ff3048"/><stop offset="1" stop-color="#ff3048" stop-opacity=".1"/></linearGradient>
    <radialGradient id="halo" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#ff3048" stop-opacity=".22"/><stop offset="1" stop-color="#ff3048" stop-opacity="0"/></radialGradient>
    <filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <ellipse cx="500" cy="470" rx="440" ry="330" fill="url(#halo)"/>
  <g filter="url(#g)">${glow}</g>
  ${out}
  ${dust}
</svg>`;
}

(async () => {
  const jobs = [
    ['art-orb', orb(), 820, 820],
    ['art-stack', iso(), 900, 738],
  ];
  for (const [name, svg, w, h] of jobs) {
    fs.writeFileSync(`${__dirname}/${name}.svg`, svg);
    const png = await sharp(Buffer.from(svg), { density: 96 }).resize(w, h).png().toBuffer();
    const webp = await sharp(png).webp({ quality: 80, alphaQuality: 80, effort: 6 }).toBuffer();
    const avif = await sharp(png).avif({ quality: 52, effort: 6 }).toBuffer();
    fs.writeFileSync(`${OUT}${name}.webp`, webp);
    fs.writeFileSync(`${OUT}${name}.avif`, avif);
    fs.writeFileSync(`${__dirname}/shots/${name}-preview.png`, await sharp(png).flatten({ background: '#050507' }).png().toBuffer());
    console.log(name.padEnd(10), `webp ${(webp.length / 1024).toFixed(1)} kB`, `avif ${(avif.length / 1024).toFixed(1)} kB`, `${w}x${h}`);
  }
})();
