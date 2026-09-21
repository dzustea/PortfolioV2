// Kolik času sežere scéna: podíl skriptu a kreslení za tři vteřiny běhu
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function zmer(b, n, w, h, dpr, cpu, hybat) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: dpr });
  const cdp = await p.target().createCDPSession();
  await cdp.send('Performance.enable');
  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  if (hybat) await p.mouse.move(w / 2, h / 3);
  await new Promise(r => setTimeout(r, 500));

  const vem = async () => Object.fromEntries(
    (await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));

  const a = await vem();
  const snimky = await p.evaluate(() => new Promise(ok => {
    let n = 0; const konec = performance.now() + 3000;
    (function tik() { n++; performance.now() < konec ? requestAnimationFrame(tik) : ok(n); })();
  }));
  const z = await vem();

  console.log(n.padEnd(30),
    'snimku', String(snimky).padStart(4),
    '| skript', ((z.ScriptDuration - a.ScriptDuration) * 1000 / snimky).toFixed(2) + ' ms/snimek',
    '| kresleni', ((z.LayoutDuration + z.RecalcStyleDuration - a.LayoutDuration - a.RecalcStyleDuration) * 1000 / snimky).toFixed(2) + ' ms/snimek');
  await p.close();
}

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'] });
  await zmer(b, 'pocitac 1440, klid', 1440, 900, 1, 1, false);
  await zmer(b, 'pocitac 1440, kurzor', 1440, 900, 1, 1, true);
  await zmer(b, 'telefon 390 @3x, 4x pomal.', 390, 844, 3, 4, true);
  await zmer(b, 'telefon 390 @3x, 6x pomal.', 390, 844, 3, 6, true);
  await b.close();
})();
