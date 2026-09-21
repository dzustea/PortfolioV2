// Funkční kontroly nasazované verze proti lokálnímu náhledu.
// Spouštět se serve.js běžícím na portu 4173.
const puppeteer = require('puppeteer-core');
const URL = 'http://localhost:4173/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const cekej = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const out = {};

  /* ── počítač: chyby, dialog, tlačítko, náhled, pilulka ─────── */

  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });

  const chyby = [];
  p.on('console', m => { if (m.type() === 'error') chyby.push(m.text()); });
  p.on('pageerror', e => chyby.push('pageerror: ' + e.message));
  p.on('requestfailed', r => chyby.push('nenacteno: ' + r.url().split('/').pop()));
  await p.evaluateOnNewDocument(() => {
    document.addEventListener('securitypolicyviolation',
      e => { (window.__csp = window.__csp || []).push(e.violatedDirective + ' :: ' + e.blockedURI); });
  });

  await p.goto(URL, { waitUntil: 'networkidle0' });
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await cekej(1000);

  out.odkryto = await p.evaluate(() => document.documentElement.className);

  // dialog: otevřít tlačítkem, zavřít Esc, znovu otevřít, zavřít křížkem
  await p.evaluate(() => document.querySelectorAll('[data-dialog]')[2].click());
  await cekej(320);
  out.dialog = await p.evaluate(() => ({
    otevren: document.getElementById('dlg-3').open,
    modalni: !!document.querySelector('dialog[open]'),
  }));
  await p.keyboard.press('Escape');
  await cekej(280);
  out.dialogPoEsc = await p.evaluate(() => document.getElementById('dlg-3').open);
  await p.evaluate(() => document.querySelectorAll('[data-dialog]')[0].click());
  await cekej(280);
  await p.evaluate(() => document.querySelector('#dlg-1 .dlg-close').click());
  await cekej(280);
  out.dialogPoKrizku = await p.evaluate(() => document.getElementById('dlg-1').open);

  // tlačítko: najetí musí barvu opravdu převrátit
  const tl = await p.$('.hero-akce .btn');
  const tlb = await tl.boundingBox();
  const klidBtn = await p.evaluate(() => getComputedStyle(document.querySelector('.hero-akce .btn')).color);
  await p.mouse.move(tlb.x + 6, tlb.y + tlb.height / 2);
  await cekej(700);
  out.tlacitko = await p.evaluate((klid) => {
    const e = document.querySelector('.hero-akce .btn');
    const cs = getComputedStyle(e), pb = getComputedStyle(e, '::before');
    return { klid, najeto: cs.color, barvaSeZmenila: cs.color !== klid,
      vyplnRozepnuta: pb.scale === '1' || pb.scale === '1 1',
      odkudRoste: cs.getPropertyValue('--ox').trim() };
  }, klidBtn);
  await p.mouse.move(10, 10);
  await cekej(300);

  out.dokument = await p.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
    const nadpisy = [...document.querySelectorAll('h1,h2,h3')].map(e => +e.tagName[1]);
    let skok = null;
    for (let i = 1; i < nadpisy.length; i++)
      if (nadpisy[i] - nadpisy[i - 1] > 1) skok = nadpisy[i - 1] + ' -> ' + nadpisy[i];
    return { duplicitniId: ids.filter((v, i) => ids.indexOf(v) !== i),
      h1: document.querySelectorAll('h1').length,
      poradiNadpisu: skok || 'v poradku',
      bezAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
      pomlcky: (document.body.innerText.match(/[\u2013\u2014]/g) || []).length,
      vyska: document.documentElement.scrollHeight };
  });
  out.prenos = await p.evaluate(() => {
    const r = performance.getEntriesByType('resource');
    return { pozadavku: r.length + 1, kB: Math.round(r.reduce((s, x) => s + (x.transferSize || 0), 0) / 1024) };
  });

  // náhled projektu u kurzoru
  await p.evaluate(() => window.scrollTo(0, document.getElementById('projects').offsetTop - 60));
  await cekej(500);
  const radek = await p.$('[data-nahled="2"] h3');
  const bx = await radek.boundingBox();
  await p.mouse.move(bx.x + 30, bx.y + 8);
  await p.mouse.move(bx.x + 55, bx.y + 12);
  await cekej(520);
  out.nahledProjektu = await p.evaluate(() => {
    const n = document.getElementById('nahled');
    return { zobrazen: n.classList.contains('on'),
      ktery: [...n.querySelectorAll('img')].filter(i => i.classList.contains('vidno')).map(i => i.dataset.pj) };
  });

  // pilulka v liště drží u aktivní sekce
  out.pilulka = await p.evaluate(() => {
    const v = document.querySelector('.nav-pill'), a = document.querySelector('.hdr-nav a.active');
    const cs = getComputedStyle(v);
    return { zobrazena: v.classList.contains('on'), aktivni: a ? a.getAttribute('href') : null,
      posun: cs.getPropertyValue('--p-x').trim(), sirka: cs.getPropertyValue('--p-w').trim() };
  });

  out.csp = await p.evaluate(() => window.__csp || []);
  out.chyby = chyby;
  await p.close();

  /* ── sbalená nabídka na úzkém okně ─────────────────────────── */

  const uzka = await b.newPage();
  await uzka.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await uzka.goto(URL, { waitUntil: 'networkidle0' });
  await cekej(700);
  await uzka.click('#menu-btn');
  await cekej(450);
  const otevrena = await uzka.evaluate(() => !document.getElementById('panel').hidden);
  await uzka.keyboard.press('Escape');
  await cekej(350);
  out.nabidka = {
    otevre: otevrena,
    zavreEsc: await uzka.evaluate(() => document.getElementById('panel').hidden),
    odkazyVListe: await uzka.evaluate(() => getComputedStyle(document.querySelector('.hdr-nav')).display),
  };
  await uzka.close();

  /* ── formulář: chyba u pole, ne jedna věta nad celým ───────── */

  const f = await b.newPage();
  await f.setViewport({ width: 1440, height: 900 });
  await f.goto(URL, { waitUntil: 'networkidle0' });
  await cekej(700);
  await f.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.getElementById('contact').offsetTop); });
  await cekej(400);
  await f.type('#fe', 'neplatna-adresa');
  await f.click('#btn-send');
  await cekej(400);
  out.formular = await f.evaluate(() => ({
    chybnychPoli: document.querySelectorAll('.fg.chyba').length,
    hlaskaUEmailu: !document.getElementById('fe-err').hidden,
    ariaInvalid: document.getElementById('fe').getAttribute('aria-invalid'),
    zaostreno: document.activeElement.id,
  }));
  await f.close();

  /* ── vodorovný přesah a lišta napříč šířkami ───────────────── */

  out.sirky = {};
  for (const [w, h] of [[320, 700], [360, 740], [390, 844], [430, 932], [560, 800],
                        [768, 1024], [900, 800], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
    const s = await b.newPage();
    await s.setViewport({ width: w, height: h });
    await s.goto(URL, { waitUntil: 'networkidle0' });
    await s.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
    await cekej(450);
    out.sirky[w] = await s.evaluate(() => {
      window.scrollTo(9999, 0);
      const W = document.documentElement.clientWidth, ven = [];
      /* vlastní posuvné pásy si přetékat smějí */
      const vlastniPas = e => {
        for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) {
          const o = getComputedStyle(x).overflowX;
          if (o === 'auto' || o === 'scroll') return true;
        }
        return false;
      };
      document.querySelectorAll('main *, header *, footer *').forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if ((r.right > W + 1 || r.left < -1) && !vlastniPas(e))
          ven.push((e.tagName + '.' + (typeof e.className === 'string' ? e.className : '')).trim().slice(0, 40));
      });
      const hdr = document.querySelector('.hdr-in');
      return { posunX: window.scrollX, venZOkna: ven.slice(0, 4),
        vyskaListy: Math.round(hdr.getBoundingClientRect().height),
        listaJedenRadek: hdr.scrollHeight <= hdr.clientHeight + 1 };
    });
    await s.close();
  }

  /* ── telefon: výšky sekcí ──────────────────────────────────── */

  const m = await b.newPage();
  await m.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await m.goto(URL, { waitUntil: 'networkidle0' });
  await m.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in')));
  await cekej(450);
  out.mobil = await m.evaluate(() => {
    const v = id => Math.round(document.getElementById(id).getBoundingClientRect().height);
    const uvod = document.getElementById('hero').getBoundingClientRect();
    const akce = document.querySelector('.hero-akce').getBoundingClientRect();
    return { hero: v('hero'), expertise: v('expertise'), projekty: v('projects'), kontakt: v('contact'),
      celaStranka: document.documentElement.scrollHeight,
      obrazovek: +(document.documentElement.scrollHeight / window.innerHeight).toFixed(2),
      uvodDoObrazovky: uvod.height <= window.innerHeight + 1,
      tlacitkaViditelna: akce.bottom <= window.innerHeight + 1 };
  });
  await m.close();

  /* ── omezený pohyb ─────────────────────────────────────────── */

  const r = await b.newPage();
  await r.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await r.setViewport({ width: 1440, height: 900 });
  await r.goto(URL, { waitUntil: 'networkidle0' });
  await cekej(900);
  out.omezenyPohyb = await r.evaluate(() => {
    const bezi = [];
    document.querySelectorAll('*').forEach(e => {
      e.getAnimations().forEach(a => {
        const d = a.effect && a.effect.getTiming().duration;
        if (a.playState === 'running' && typeof d === 'number' && d > 50)
          bezi.push((e.className || e.tagName) + ' :: ' + d + ' ms');
      });
    });
    return { bezaciAnimace: bezi,
      neviditelneSekce: [...document.querySelectorAll('.rv')].filter(e => +getComputedStyle(e).opacity < 1).length,
      loader: getComputedStyle(document.getElementById('loader')).visibility,
      nahledSkryty: getComputedStyle(document.getElementById('nahled')).display === 'none' };
  });
  await r.close();

  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
