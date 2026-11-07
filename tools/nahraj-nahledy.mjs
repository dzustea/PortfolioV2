// NAHRÁNÍ NÁHLEDŮ PROJEKTŮ
//
// Nahraje živé weby jako krátkou smyčku do projects/<jméno>.mp4
// a plakát (snímek po úvodu, WebP) do projects/<jméno>.webp.
//
// Průběh nahrávky: načtení, myš přejede přes úvod, plynulé projetí
// dolů a krátká pauza na konci.
//
// Jak je to plynulé:
//   * Posun dělá Chrome sám (Input.synthesizeScrollGesture), ne
//     kolečko po kouscích, takže stránka jede jako při tahu prstem.
//   * Snímky dodává screencast Chromu i s přesným časem každého.
//   * Video se skládá mimo reálný čas přes WebCodecs: na každou
//     šedesátinu sekundy se vezme snímek, který v tu chvíli byl na
//     obrazovce. Výsledek má přesných 60 fps bez cukání, ať počítač
//     při nahrávání stíhá, nebo ne.
//   * MP4 kontejner skládá knihovna mp4-muxer (MIT). Je jen tady
//     v nástroji, na web se nedostane.
//
// Spuštění (jednou předtím: cd tools && npm install):
//   node tools/nahraj-nahledy.mjs            všechny weby
//   node tools/nahraj-nahledy.mjs natte      jen jeden
//
// Potřebuje Node 22+ a nainstalovaný Google Chrome.
// Nový projekt = nový řádek v seznamu weby níž (jméno, adresa,
// kolik pixelů sjet dolů) a značka v index.html podle ostatních.

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import http from 'node:http';

const OUT = fileURLToPath(new URL('../projects/', import.meta.url));
const PROFIL = os.tmpdir() + '/nahledy-chrome-profil';
// Prohlížečová verze knihovny (globální Mp4Muxer) se vloží do záložky,
// která video skládá. Balíček ji přes "exports" nevydává, takže se
// čte rovnou ze složky node_modules vedle nástroje.
const MUXER = fs.readFileSync(fileURLToPath(new URL('./node_modules/mp4-muxer/build/mp4-muxer.js', import.meta.url)), 'utf8');

const jen = process.argv[2];
const weby = [
  // jméno, adresa, kolik sjet dolů (px), přeskočit intro klepnutím
  ['restovski', 'https://restovski.vercel.app/', 2400, false],
  ['svacinar', 'https://www.tadysvacinar.cz/', 2400, false],
  ['loremasters', 'https://loremasters.vercel.app/', 1500, false],
  ['natte', 'https://natte-visstick.vercel.app/', 2000, true],
].filter(w => !jen || w[0] === jen);

const PORT = 9341;
const W = 1280, H = 720;          // okno prohlížeče při nahrávání
const VW = 960, VH = 540;         // rozměr videa
const FPS = 60;
const DATOVY_TOK = 1_000_000;     // bitů za sekundu
const RYCHLOST_POSUNU = 320;      // px za sekundu

const pauza = (ms) => new Promise(r => setTimeout(r, ms));

// WebCodecs běží jen v zabezpečeném kontextu. Localhost se za něj
// počítá, takže se skládá na prázdné stránce z malého místního serveru.
const server = http.createServer((q, o) => { o.writeHead(200, { 'content-type': 'text/html' }); o.end('<!doctype html><title>kodovani</title>'); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const MISTNI = 'http://localhost:' + server.address().port + '/';

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  '--user-data-dir=' + PROFIL, 'about:blank'
], { stdio: 'ignore' });

let verze;
for (let i = 0; i < 40; i++) { try { verze = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch {} await pauza(250); }

const sock = new WebSocket(verze.webSocketDebuggerUrl);
await new Promise(r => sock.addEventListener('open', r));
let id = 0; const cekani = new Map(); const posluchaci = [];
sock.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && cekani.has(m.id)) { cekani.get(m.id)(m); cekani.delete(m.id); }
  else if (m.method) posluchaci.forEach(f => f(m));
});
const cmd = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; cekani.set(i, r); sock.send(JSON.stringify({ id: i, method, params, sessionId })); });

const novyTab = async () => {
  const { result: { targetId } } = await cmd('Target.createTarget', { url: 'about:blank' });
  const { result: { sessionId } } = await cmd('Target.attachToTarget', { targetId, flatten: true });
  const tab = (m, p) => cmd(m, p, sessionId);
  tab.sessionId = sessionId; tab.targetId = targetId;
  return tab;
};
const js = async (tab, expression) => {
  const r = await tab('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.error) throw new Error(JSON.stringify(r.error));
  if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 500));
  return r.result.result ? r.result.result.value : undefined;
};

for (const [jm, url, dolu, preskocIntro] of weby) {
  /* ── NAHRÁVÁNÍ ─────────────────────────────────────────────── */
  const web = await novyTab();
  await web('Page.enable');
  await web('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await web('Emulation.setFocusEmulationEnabled', { enabled: true });

  const snimky = [];
  posluchaci.push((m) => {
    if (m.method === 'Page.screencastFrame' && m.sessionId === web.sessionId) {
      snimky.push({ data: m.params.data, t: m.params.metadata.timestamp });
      cmd('Page.screencastFrameAck', { sessionId: m.params.sessionId }, m.sessionId);
    }
  });

  await web('Page.navigate', { url });
  await pauza(1200);
  // Lišta s cookies se jen schová, nic se v ní nepotvrzuje.
  await js(web, `[...document.querySelectorAll('body *')].filter(e=>{const p=getComputedStyle(e).position;return (p==='fixed'||p==='sticky') && /cookies/i.test(e.textContent) && e.offsetHeight<300}).forEach(e=>e.remove())`);
  if (preskocIntro) {
    for (const type of ['mousePressed', 'mouseReleased']) await web('Input.dispatchMouseEvent', { type, x: 640, y: 360, button: 'left', clickCount: 1 });
    await pauza(900);
  }
  await web('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: VW, maxHeight: VH, everyNthFrame: 1 });

  // Úvod: myš přejede přes hlavní plochu (asi sekunda).
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    await web('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(260 + 760 * t), y: Math.round(260 + 120 * Math.sin(t * Math.PI * 2)) });
    await pauza(16);
  }
  await pauza(150);
  // Plynulé projetí dolů: kolečko zhruba 60× za sekundu po malých
  // krocích. Krok se počítá z času, který opravdu uběhl, takže
  // rychlost je stálá, i když se některá událost zdrží. Kolečko
  // (ne scrollTo) proto, aby se chytily i weby s vlastním plynulým
  // posunem a efekty vázanými na kolečko.
  // (Input.synthesizeScrollGesture by bylo hezčí, ale v headless
  // Chromu stránkou nepohne.)
  {
    let ujeto = 0, minule = performance.now();
    while (ujeto < dolu) {
      await pauza(14);
      const ted = performance.now();
      const krok = Math.min(dolu - ujeto, Math.max(1, Math.round(RYCHLOST_POSUNU * (ted - minule) / 1000)));
      minule = ted;
      ujeto += krok;
      await web('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 640, y: 400, deltaX: 0, deltaY: krok });
    }
  }
  // LADENI=1 vypíše, kam se stránka posunula a kolik snímků přišlo.
  if (process.env.LADENI) console.log('posun po kolecku:', await js(web, 'scrollY'), 'zdrojovych snimku:', snimky.length);
  await pauza(1300);
  await web('Page.stopScreencast');
  await pauza(200);
  await cmd('Target.closeTarget', { targetId: web.targetId });
  if (snimky.length < 10) { console.log(jm, 'CHYBA: málo snímků', snimky.length); continue; }

  const t0 = snimky[0].t;
  const delka = snimky[snimky.length - 1].t - t0;
  const plakat = snimky.find(s => s.t - t0 > 1.2) || snimky[0];

  /* ── SKLÁDÁNÍ NA 60 FPS ────────────────────────────────────── */
  const kod = await novyTab();
  await kod('Page.enable');
  await kod('Page.navigate', { url: MISTNI });
  await pauza(400);
  await js(kod, MUXER + '; true');
  const kodek = await js(kod, `(async () => {
    const kandidati = ['avc1.4d0028', 'avc1.42e028', 'avc1.640028'];
    for (const codec of kandidati) {
      const c = { codec, width: ${VW}, height: ${VH}, bitrate: ${DATOVY_TOK}, framerate: ${FPS}, bitrateMode: 'variable', latencyMode: 'quality', avc: { format: 'avc' } };
      const s = await VideoEncoder.isConfigSupported(c);
      if (s.supported) {
        window.muxer = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: 'avc', width: ${VW}, height: ${VH}, frameRate: ${FPS} }, fastStart: 'in-memory' });
        window.chyba = null;
        window.enc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { window.chyba = String(e); } });
        enc.configure(c);
        window.platno = new OffscreenCanvas(${VW}, ${VH});
        window.ctx = platno.getContext('2d');
        window.nacti = async (b64) => {
          const bin = atob(b64); const u = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
          const bmp = await createImageBitmap(new Blob([u], { type: 'image/jpeg' }));
          ctx.drawImage(bmp, 0, 0, ${VW}, ${VH}); bmp.close();
        };
        window.zakoduj = async (i) => {
          const f = new VideoFrame(platno, { timestamp: Math.round(i * 1e6 / ${FPS}), duration: Math.round(1e6 / ${FPS}) });
          enc.encode(f, { keyFrame: i % ${FPS * 2} === 0 });
          f.close();
          while (enc.encodeQueueSize > 8) await new Promise(r => setTimeout(r, 5));
          if (chyba) throw new Error(chyba);
        };
        return codec;
      }
    }
    throw new Error('H.264 kodér není k dispozici');
  })()`);

  // Plakát jako WebP: stojí v okně, než se video spustí, a stahuje
  // se pro každý projekt, takže má být co nejmenší.
  const plakatB64 = await js(kod, `(async () => {
    await nacti(${JSON.stringify(plakat.data)});
    const b = await platno.convertToBlob({ type: 'image/webp', quality: 0.8 });
    const u = new Uint8Array(await b.arrayBuffer()); let s = '';
    for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768));
    return btoa(s);
  })()`);
  fs.writeFileSync(OUT + jm + '.webp', Buffer.from(plakatB64, 'base64'));

  const pocet = Math.floor(delka * FPS);
  let zdroj = -1;
  for (let i = 0; i <= pocet; i++) {
    const cas = t0 + i / FPS;
    let k = zdroj < 0 ? 0 : zdroj;
    while (k + 1 < snimky.length && snimky[k + 1].t <= cas) k++;
    if (k !== zdroj) { await js(kod, `nacti(${JSON.stringify(snimky[k].data)})`); zdroj = k; }
    await js(kod, `zakoduj(${i})`);
  }
  const b64 = await js(kod, `(async () => {
    await enc.flush(); muxer.finalize();
    const buf = new Uint8Array(muxer.target.buffer); let s = '';
    for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768));
    return btoa(s);
  })()`);
  await cmd('Target.closeTarget', { targetId: kod.targetId });
  fs.writeFileSync(OUT + jm + '.mp4', Buffer.from(b64, 'base64'));
  console.log(jm, kodek, pocet + 1, 'snímků,', delka.toFixed(1) + ' s,', Math.round(fs.statSync(OUT + jm + '.mp4').size / 1024) + ' kB');
}
sock.close(); chrome.kill(); server.close();
process.exit(0);
