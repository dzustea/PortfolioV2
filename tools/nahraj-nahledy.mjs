// NAHRÁNÍ NÁHLEDŮ PROJEKTŮ
//
// Nahraje živé weby jako krátkou smyčku do projects/<jméno>.mp4
// a plakát (první snímek po úvodu) do projects/<jméno>.jpg.
// Průběh: načtení, myš přejede přes úvod, projetí dolů kolečkem.
// Snímky bere Chrome DevTools Protocol (screencast), video z nich
// složí MediaRecorder v druhé záložce téhož Chromu. Není potřeba
// ffmpeg ani žádná knihovna, jen Node 22+ a nainstalovaný Chrome.
//
// Spuštění (z kořene repa):
//   node tools/nahraj-nahledy.mjs            všechny weby
//   node tools/nahraj-nahledy.mjs natte      jen jeden
//
// Nový projekt = nový řádek v seznamu weby níž (jméno, adresa,
// kolik pixelů sjet dolů) a značka v index.html podle ostatních.
import os from 'node:os';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

import { fileURLToPath } from 'node:url';
const OUT = fileURLToPath(new URL('../projects/', import.meta.url));
const PROFIL = os.tmpdir() + '/nahledy-chrome-profil';
fs.mkdirSync(OUT, { recursive: true });
const jen = process.argv[2];
const weby = [
  ['restovski', 'https://restovski.vercel.app/', 2400],
  ['svacinar', 'https://www.tadysvacinar.cz/', 2400],
  ['loremasters', 'https://loremasters.vercel.app/', 1500],
  ['natte', 'https://natte-visstick.vercel.app/', 2000],
].filter(w => !jen || w[0] === jen);
const PORT = 9340, W = 1280, H = 720, VW = 768, VH = 432;

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  '--user-data-dir=' + PROFIL, 'about:blank'
], { stdio: 'ignore' });
const pauza = (ms) => new Promise(r => setTimeout(r, ms));

let verze;
for (let i = 0; i < 40; i++) { try { verze = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch {} await pauza(250); }

const pripoj = async (url) => {
  const sock = new WebSocket(url);
  await new Promise(r => sock.addEventListener('open', r));
  let id = 0; const cekani = new Map(); const posluchaci = [];
  sock.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && cekani.has(m.id)) { cekani.get(m.id)(m); cekani.delete(m.id); }
    else if (m.method) posluchaci.forEach(f => f(m));
  });
  const cmd = (method, params = {}, sessionId) => new Promise(r => { const i = ++id; cekani.set(i, r); sock.send(JSON.stringify({ id: i, method, params, sessionId })); });
  return { sock, cmd, na: (f) => posluchaci.push(f) };
};

const br = await pripoj(verze.webSocketDebuggerUrl);
const novyTab = async () => {
  const { result: { targetId } } = await br.cmd('Target.createTarget', { url: 'about:blank' });
  const { result: { sessionId } } = await br.cmd('Target.attachToTarget', { targetId, flatten: true });
  return (m, p) => br.cmd(m, p, sessionId).then(r => r);
};
const js = async (c, expression) => {
  const r = await c('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400));
  return r.result && r.result.result ? r.result.result.value : undefined;
};

for (const [jm, url, dolu] of weby) {
  const web = await novyTab();
  await web('Page.enable');
  await web('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await web('Emulation.setFocusEmulationEnabled', { enabled: true });

  const snimky = [];
  br.na((m) => {
    if (m.method === 'Page.screencastFrame') {
      snimky.push({ data: m.params.data, t: m.params.metadata.timestamp });
      br.cmd('Page.screencastFrameAck', { sessionId: m.params.sessionId }, m.sessionId);
    }
  });

  await web('Page.navigate', { url });
  await pauza(1200);
  await js(web, `[...document.querySelectorAll('body *')].filter(e=>{const p=getComputedStyle(e).position;return (p==='fixed'||p==='sticky') && /cookies/i.test(e.textContent) && e.offsetHeight<300}).forEach(e=>e.remove())`);
  if (jm === 'natte') { await web('Input.dispatchMouseEvent', { type: 'mousePressed', x: 640, y: 360, button: 'left', clickCount: 1 }); await web('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 640, y: 360, button: 'left', clickCount: 1 }); await pauza(900); }
  await web('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: VW, maxHeight: VH, everyNthFrame: 1 });

  // Úvod: myš pomalu přejede přes hlavní plochu.
  const mys = (x, y) => web('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    await mys(Math.round(260 + 760 * t), Math.round(260 + 120 * Math.sin(t * Math.PI * 2)));
    await pauza(45);
  }
  await pauza(150);
  // Projetí dolů kolečkem, ať se spustí i efekty vázané na posun.
  const krok = 12, za = 40;
  for (let ujeto = 0; ujeto < dolu; ujeto += krok) {
    await web('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 640, y: 400, deltaX: 0, deltaY: krok });
    await pauza(za);
  }
  await pauza(1400);
  await web('Page.stopScreencast');
  await pauza(200);

  // Plakát: snímek z konce úvodu.
  const zacatek = snimky[0].t;
  const plakat = snimky.find(s => s.t - zacatek > 1.2) || snimky[0];
  fs.writeFileSync(OUT + jm + '.jpg', Buffer.from(plakat.data, 'base64'));

  // Složení videa.
  const kod = await novyTab();
  await kod('Emulation.setFocusEmulationEnabled', { enabled: true });
  await js(kod, `(() => {
    const c = document.createElement('canvas'); c.width = ${VW}; c.height = ${VH}; document.body.appendChild(c);
    window.ctx = c.getContext('2d');
    const typy = ['video/mp4;codecs=avc1.42E01F', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9'];
    window.typ = typy.find(t => MediaRecorder.isTypeSupported(t));
    window.kusy = [];
    window.rec = new MediaRecorder(c.captureStream(30), { mimeType: window.typ, videoBitsPerSecond: 650000 });
    rec.ondataavailable = e => kusy.push(e.data);
    window.kresli = async (b64) => { const i = new Image(); i.src = 'data:image/jpeg;base64,' + b64; await i.decode(); ctx.drawImage(i, 0, 0, ${VW}, ${VH}); };
    return typ;
  })()`).then(t => console.log(jm, 'typ', t));
  await js(kod, `kresli(${JSON.stringify(snimky[0].data)})`);
  await js(kod, `rec.start()`);
  const start = Date.now();
  for (const s of snimky) {
    const kdy = (s.t - zacatek) * 1000;
    const zbyva = kdy - (Date.now() - start);
    if (zbyva > 0) await pauza(zbyva);
    await js(kod, `kresli(${JSON.stringify(s.data)})`);
  }
  await pauza(150);
  const b64 = await js(kod, `new Promise(r => { rec.onstop = async () => { const b = new Blob(kusy, { type: typ }); const buf = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768)); r(btoa(s)); }; rec.stop(); })`);
  const typ = await js(kod, 'typ');
  const pripona = typ.startsWith('video/mp4') ? 'mp4' : 'webm';
  fs.writeFileSync(OUT + jm + '.' + pripona, Buffer.from(b64, 'base64'));
  console.log(jm, snimky.length, 'snimku,', ((snimky.at(-1).t - zacatek)).toFixed(1) + 's,', fs.statSync(OUT + jm + '.' + pripona).size, 'B');
}
br.sock.close(); chrome.kill();
process.exit(0);
