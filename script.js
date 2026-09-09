/* ══════════════════════════════════════════════════════════════
   FILIP LOCHMAN · script.js

   Zásady:
   · žádný posluchač na 'scroll' — všechno stojí na IntersectionObserver,
     takže se nic nepočítá při každém snímku scrollování
   · pohyb kurzoru se zapisuje do CSS proměnných uvnitř requestAnimationFrame,
     nikdy ne přímo v události
   · animuje se výhradně transform a opacity
   · při prefers-reduced-motion se 3D efekty vůbec nezapnou
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = matchMedia('(hover: none)');
  // náklon vypínáme jen na dotykových zařízeních a při omezeném pohybu
  var canTilt = function () { return !coarse.matches && !reduceMotion.matches; };

  /* ── 1. NAVIGACE: podklad lišty ───────────────────────────────
     Sentinel je 60px vysoký proužek u horního okraje dokumentu.
     Jakmile vyscrolluje z viewportu, lišta dostane pozadí.       */
  var hdr = document.getElementById('hdr');
  var sentinel = document.getElementById('nav-sentinel');

  if (hdr && sentinel) {
    new IntersectionObserver(function (entries) {
      hdr.classList.toggle('solid', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ── 2. NAVIGACE: aktivní odkaz ───────────────────────────────
     Sekce se sleduje v pásu kolem 40 % výšky okna. Ta, která do
     pásu zasahuje, je ta „aktuální".                             */
  var links = {};
  Array.prototype.forEach.call(document.querySelectorAll('#hdr nav a'), function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  var sections = ['expertise', 'projects', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sections.length) {
    var visible = new Set();
    var order = ['expertise', 'projects', 'contact'];

    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target.id);
        else visible.delete(en.target.id);
      });
      // nejnižší sekce, která je v pásu, vyhrává
      var active = null;
      for (var i = order.length - 1; i >= 0; i--) {
        if (visible.has(order[i])) { active = order[i]; break; }
      }
      for (var id in links) links[id].classList.toggle('active', id === active);
    }, { rootMargin: '-38% 0px -55% 0px' });

    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ── 3. ODHALOVÁNÍ OBSAHU PŘI SCROLLU ────────────────────────── */
  var revealObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      obs.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  Array.prototype.forEach.call(document.querySelectorAll('.rv'), function (el) {
    revealObs.observe(el);
  });

  /* ── 4. 3D SCÉNA V HERO ───────────────────────────────────────
     Deska se naklání podle pozice kurzoru v okně. Hodnoty se
     zapisují jednou za snímek, ne při každém pohybu myši.        */
  var deck = document.getElementById('deck');
  var hero = document.getElementById('hero');

  if (deck && hero && canTilt()) {
    var deckX = 0, deckY = 0, deckQueued = false;

    var applyDeck = function () {
      deckQueued = false;
      deck.style.setProperty('--px', deckX.toFixed(3));
      deck.style.setProperty('--py', deckY.toFixed(3));
    };

    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      deckX = e.clientX / innerWidth - 0.5;
      deckY = e.clientY / innerHeight - 0.5;
      if (!deckQueued) { deckQueued = true; requestAnimationFrame(applyDeck); }
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
      deckX = 0; deckY = 0;
      if (!deckQueued) { deckQueued = true; requestAnimationFrame(applyDeck); }
    }, { passive: true });
  }

  /* ── 5. NÁKLON KARET PROJEKTŮ ─────────────────────────────────
     Rozměr karty se čte jen při najetí, ne při každém pohybu —
     jinak by si prohlížeč vynucoval přepočet layoutu ve smyčce.  */
  var cards = document.querySelectorAll('.pcard:not(.pcard-wip)');

  if (cards.length && canTilt()) {
    Array.prototype.forEach.call(cards, function (card) {
      var box = null, mx = 0.5, my = 0.5, queued = false;

      var apply = function () {
        queued = false;
        card.style.setProperty('--ry', ((mx - 0.5) * 6.5).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - my) * 4.5).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (mx * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (my * 100).toFixed(1) + '%');
      };

      card.addEventListener('pointerenter', function () {
        box = card.getBoundingClientRect();
      }, { passive: true });

      card.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        if (!box) box = card.getBoundingClientRect();
        mx = (e.clientX - box.left) / box.width;
        my = (e.clientY - box.top) / box.height;
        if (!queued) { queued = true; requestAnimationFrame(apply); }
      }, { passive: true });

      card.addEventListener('pointerleave', function () {
        box = null; mx = 0.5; my = 0.5;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      }, { passive: true });
    });
  }

  /* ── 6. KONTAKTNÍ FORMULÁŘ ────────────────────────────────────
     Odesílá se na Formspree. Do stránky se zapisuje výhradně
     přes textContent, takže se sem nedá vložit žádné značkování. */
  var form = document.getElementById('cform');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('fn').value.trim();
      var email   = document.getElementById('fe').value.trim();
      var message = document.getElementById('fm').value.trim();
      var btn     = document.getElementById('btn-send');
      var btnTxt  = document.getElementById('btn-txt');
      var msg     = document.getElementById('fmsg');

      if (!name || !email || !message) {
        msg.textContent = 'Vyplň prosím všechna pole.';
        msg.className = 'form-feedback err';
        return;
      }

      btn.disabled = true;
      btnTxt.textContent = 'Odesílám...';
      msg.textContent = '';
      msg.className = 'form-feedback';

      fetch('https://formspree.io/f/xnjryend', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error();
          msg.textContent = '✓ Zpráva odeslána. Ozvu se co nejdřív.';
          msg.className = 'form-feedback ok';
          form.reset();
        })
        .catch(function () {
          msg.textContent = 'Odesílání selhalo. Napiš přímo na filda.lochman12@gmail.com';
          msg.className = 'form-feedback err';
        })
        .then(function () {
          btn.disabled = false;
          btnTxt.textContent = 'Odeslat zprávu';
        });
    });
  }
})();
