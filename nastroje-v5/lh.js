// Lighthouse na lokální náhled. Telefon i počítač.
const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

(async () => {
  const chrome = await chromeLauncher.launch({
    chromePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });
  for (const rezim of ['mobile', 'desktop']) {
    const cfg = rezim === 'desktop'
      ? (await import('lighthouse/core/config/desktop-config.js')).default
      : undefined;
    const r = await lighthouse('http://localhost:' + (process.env.PORT || 4173) + '/', { port: chrome.port, output: 'json' }, cfg);
    const c = r.lhr.categories;
    console.log('\n== ' + rezim + ' ==');
    for (const k of ['performance', 'accessibility', 'best-practices', 'seo'])
      console.log(' ', k.padEnd(16), Math.round(c[k].score * 100));
    const spatne = Object.values(r.lhr.audits).filter(a =>
      a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative');
    for (const a of spatne) console.log('   -', a.id, '|', a.title, '|', a.displayValue || '');
    fs.writeFileSync(`shots/lh-${rezim}.json`, r.report);
  }
  try { await chrome.kill(); } catch (e) { /* uklid docasne slozky na Windows obcas selze */ }
})();
