/* ══════════════════════════════════════════════════════════════
   FILIP LOCHMAN · chování stránky

   Skript dělá pět věcí: odkryje stránku, hlídá polohu ve scrollu,
   otevírá sbalenou nabídku, dopočítá jedinou hodnotu na typovém
   štítku, kterou nelze napsat předem, a odesílá formulář.

   Stohování modulů v rámu žádný skript nepotřebuje: drží ho
   position:sticky. Proto tu není ani jeden výpočet za snímek.

   Pravidla, která tu platí bez výjimky:

     1. Nikde se neposlouchá událost scroll. Polohu prvků hlídá
        IntersectionObserver, tedy sám prohlížeč.

     2. Do stránky se text vkládá výhradně přes textContent. Nikde
        není innerHTML, takže se do dokumentu nedá propašovat žádné
        značkování. Obsah dialogů je napsaný přímo v dokumentu.

     3. Stav se drží v atributech, které něco znamenají i pro čtečku
        obrazovky, ne jen ve třídách.
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── ODKRYTÍ STRÁNKY ──────────────────────────────────────────
     Proužek postupuje podle skutečných událostí, ne podle stopek:

       0,25  styl je načtený a skript běží
       0,60  dokument je hotový
       1,00  písmo je připravené

     Odkrytí přijde hned po posledním kroku. Když je všechno
     v mezipaměti, proběhne to dřív, než se vrstva vůbec rozsvítí,
     a návštěvník žádné načítání neuvidí.

     Blok je první v souboru a v try/catch, aby případná chyba
     kdekoli níž nenechala stránku zakrytou.
     ──────────────────────────────────────────────────────────── */

  try {
    var koren = document.documentElement;
    var prouzek = document.querySelector('#loader i');
    var zacatek = performance.now();

    var postup = function (h) { if (prouzek) prouzek.style.setProperty('--load', h); };

    var odkryj = function () {
      /* Bylo-li hotovo dřív, než se vrstva stihla rozsvítit,
         nemá smysl ji plynule zhasínat. */
      if (performance.now() - zacatek < 150) koren.classList.add('ready-hned');
      koren.classList.add('ready');
    };

    postup('.25');

    var pisma = document.fonts && document.fonts.load
      ? Promise.all([
          document.fonts.load('800 1rem Saira'),
          document.fonts.load('400 1rem Saira')
        ])
      : Promise.resolve();

    var dokument = document.readyState === 'loading'
      ? new Promise(function (ok) {
          document.addEventListener('DOMContentLoaded', function () { ok(); }, { once: true });
        })
      : Promise.resolve();

    dokument.then(function () { postup('.6'); });

    /* Na písmo se čeká nejvýš půl vteřiny od dokončení dokumentu.
       Déle by vrstva držela hotový obsah schovaný jen kvůli výměně
       řezu, a to je horší než ta výměna: font-display:swap mezitím
       vykreslí náhradní písmo. Druhá pojistka hlídá celý proces. */
    var nejvys = dokument.then(function () {
      return Promise.race([pisma, new Promise(function (ok) { setTimeout(ok, 500); })]);
    });
    var pojistka = new Promise(function (ok) { setTimeout(ok, 1500); });

    Promise.race([nejvys, pojistka]).then(function () {
      postup('1');
      requestAnimationFrame(odkryj);
    });
  } catch (e) {
    document.documentElement.classList.add('ready', 'ready-hned');
  }


  /* ── PODKLAD LIŠTY ────────────────────────────────────────────
     Nahoře v dokumentu leží neviditelný proužek. Dokud je vidět,
     stránka stojí na začátku. Jakmile vyjede z okna, lišta dostane
     neprůhledný podklad.
     ──────────────────────────────────────────────────────────── */

  var lista = document.getElementById('hdr');
  var kotva = document.getElementById('nav-sentinel');

  if (lista && kotva) {
    new IntersectionObserver(function (z) {
      lista.classList.toggle('solid', !z[0].isIntersecting);
    }).observe(kotva);
  }

  /* Svítící východ je jeden na obrazovku. Dokud je úvod v okně,
     svítí tlačítko v něm a to v liště zůstává klidnou deskou;
     jakmile úvod odejde, převezme roli lišta. */
  var uvod = document.getElementById('hero');

  if (lista && uvod) {
    new IntersectionObserver(function (z) {
      lista.classList.toggle('uvod-pryc', !z[0].isIntersecting);
    }, { threshold: 0 }).observe(uvod);
  }


  /* ── DOUTNAVKA U AKTIVNÍ SEKCE ────────────────────────────────
     Sleduje se pás uprostřed okna. Sekce, která do něj zasahuje,
     je ta aktuální; zasahuje-li jich víc, vyhrává ta níž, protože
     k ní uživatel právě míří.
     ──────────────────────────────────────────────────────────── */

  var odkazy = {};
  Array.prototype.forEach.call(document.querySelectorAll('.hdr-nav a'), function (a) {
    odkazy[a.getAttribute('href').slice(1)] = a;
  });

  var poradi = ['expertise', 'projects', 'contact'];
  var sekce = poradi.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if (sekce.length) {
    var videt = Object.create(null);

    var sledovac = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) { videt[z.target.id] = z.isIntersecting; });

      var aktivni = null;
      for (var i = poradi.length - 1; i >= 0; i--) {
        if (videt[poradi[i]]) { aktivni = poradi[i]; break; }
      }
      for (var id in odkazy) odkazy[id].classList.toggle('active', id === aktivni);
    }, { rootMargin: '-40% 0px -55% 0px' });

    sekce.forEach(function (s) { sledovac.observe(s); });
  }


  /* ── SBALENÁ NABÍDKA ──────────────────────────────────────────
     Jeden panel, jedno tlačítko, jeden stav. Stav se drží
     v aria-expanded, takže ho zná i čtečka obrazovky; třída
     v CSS už jen navazuje na něj.
     ──────────────────────────────────────────────────────────── */

  var tlacitkoMenu = document.getElementById('menu-btn');
  var panel = document.getElementById('panel');

  if (tlacitkoMenu && panel) {
    var prepni = function (otevrit) {
      tlacitkoMenu.setAttribute('aria-expanded', otevrit ? 'true' : 'false');
      panel.hidden = !otevrit;
      tlacitkoMenu.setAttribute('aria-label', otevrit ? 'Zavřít nabídku' : 'Otevřít nabídku');
    };

    tlacitkoMenu.addEventListener('click', function () {
      prepni(tlacitkoMenu.getAttribute('aria-expanded') !== 'true');
    });

    /* Klepnutí na odkaz nabídku zavře, jinak by zůstala viset
       přes cíl, na který uživatel právě skočil. */
    Array.prototype.forEach.call(panel.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { prepni(false); });
    });

    document.addEventListener('keydown', function (u) {
      if (u.key === 'Escape' && tlacitkoMenu.getAttribute('aria-expanded') === 'true') {
        prepni(false);
        tlacitkoMenu.focus();
      }
    });

    /* Když se okno roztáhne zpátky na šířku, kde jsou odkazy rovnou
       v liště, panel nemá co dělat otevřený. */
    var siroke = window.matchMedia('(min-width: 901px)');
    var naSirku = function () { if (siroke.matches) prepni(false); };
    if (siroke.addEventListener) siroke.addEventListener('change', naSirku);
    else if (siroke.addListener) siroke.addListener(naSirku);
  }


  /* ── VÁHA STRÁNKY NA TYPOVÉM ŠTÍTKU ───────────────────────────
     Jediná hodnota štítku, která se nedá napsat předem: kolik
     bajtů tahle návštěva opravdu stála. Čte se z rozhraní
     Performance, tedy z toho, co prohlížeč skutečně stáhl.

     Když prohlížeč velikosti nehlásí (starší Safari, přenos přes
     jinou doménu bez Timing-Allow-Origin), řádek zmizí celý.
     Prázdné místo je poctivější než odhad.
     ──────────────────────────────────────────────────────────── */

  var vahaPole = document.querySelector('[data-vaha]');

  if (vahaPole && window.performance && performance.getEntriesByType) {
    var spocti = function () {
      var bajtu = 0, zname = false;

      var nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.transferSize) { bajtu += nav.transferSize; zname = true; }

      performance.getEntriesByType('resource').forEach(function (z) {
        if (z.transferSize) { bajtu += z.transferSize; zname = true; }
      });

      var radek = vahaPole.closest('div');
      if (!zname || bajtu <= 0) { if (radek) radek.hidden = true; return; }

      vahaPole.textContent = Math.round(bajtu / 1024) + ' kB';
    };

    if (document.readyState === 'complete') spocti();
    else window.addEventListener('load', spocti, { once: true });
  } else if (vahaPole) {
    var radekBezMereni = vahaPole.closest('div');
    if (radekBezMereni) radekBezMereni.hidden = true;
  }


  /* ── DETAIL PROJEKTU ──────────────────────────────────────────
     Používá se nativní dialog prohlížeče. Sám drží zaostření
     uvnitř, sám se zavírá klávesou Esc a sám ztmaví zbytek
     stránky, takže nic z toho není potřeba dopisovat.

     Skript jen otevírá, zavírá a doplňuje zavření klepnutím vedle
     dialogu, což nativní prvek neumí.
     ──────────────────────────────────────────────────────────── */

  Array.prototype.forEach.call(document.querySelectorAll('[data-dialog]'), function (spoustec) {
    var dialog = document.getElementById(spoustec.getAttribute('data-dialog'));
    if (!dialog || typeof dialog.showModal !== 'function') return;

    spoustec.addEventListener('click', function () { dialog.showModal(); });

    var zaviraci = dialog.querySelector('.dlg-close');
    if (zaviraci) zaviraci.addEventListener('click', function () { dialog.close(); });

    /* Klepnutí mimo vnitřní panel zavírá. Porovnává se cíl události:
       pozadí dialogu je sám prvek dialog, obsah leží uvnitř. */
    dialog.addEventListener('click', function (u) {
      if (u.target === dialog) dialog.close();
    });
  });


  /* ── KONTAKTNÍ FORMULÁŘ ───────────────────────────────────────
     Odesílá se na Formspree, který zprávu přepošle na e-mail. Na
     straně webu žádný backend není, takže není co napadnout.

     Kontrola vyplnění je tu kvůli okamžité zpětné vazbě, ne kvůli
     bezpečnosti: skutečnou kontrolu i ochranu proti spamu dělá až
     server, na prohlížeč se v tomhle spoléhat nelze.

     Chyba se hlásí u konkrétního pole, ne jednou větou nad celým
     formulářem, a pole zároveň dostane aria-invalid, takže o ní ví
     i čtečka obrazovky.
     ──────────────────────────────────────────────────────────── */

  var formular = document.getElementById('cform');

  if (formular) {
    var pole = [
      { id: 'fn', err: 'fn-err', ok: function (v) { return v.length > 0; } },
      { id: 'fe', err: 'fe-err', ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
      { id: 'fm', err: 'fm-err', ok: function (v) { return v.length > 2; } }
    ];

    var oznac = function (p, platne) {
      var vstup = document.getElementById(p.id);
      var hlaska = document.getElementById(p.err);
      vstup.closest('.fg').classList.toggle('chyba', !platne);
      vstup.setAttribute('aria-invalid', platne ? 'false' : 'true');
      if (hlaska) hlaska.hidden = platne;
    };

    /* Po opravě pole chyba zmizí hned, ne až při dalším odeslání. */
    pole.forEach(function (p) {
      var vstup = document.getElementById(p.id);
      if (!vstup) return;
      vstup.addEventListener('input', function () {
        if (vstup.closest('.fg').classList.contains('chyba')) oznac(p, p.ok(vstup.value.trim()));
      });
    });

    formular.addEventListener('submit', function (udalost) {
      udalost.preventDefault();

      var tlacitko = document.getElementById('btn-send');
      var popisek = document.getElementById('btn-txt');
      var hlaska = document.getElementById('fmsg');

      var prvniSpatne = null;
      pole.forEach(function (p) {
        var vstup = document.getElementById(p.id);
        var platne = p.ok(vstup.value.trim());
        oznac(p, platne);
        if (!platne && !prvniSpatne) prvniSpatne = vstup;
      });

      if (prvniSpatne) {
        hlaska.textContent = '';
        hlaska.className = 'form-feedback';
        prvniSpatne.focus();
        return;
      }

      /* Tlačítko se zamkne, aby odesláním dvakrát za sebou
         nevznikly dvě stejné zprávy. */
      tlacitko.disabled = true;
      popisek.textContent = 'Odesílám...';
      hlaska.textContent = '';
      hlaska.className = 'form-feedback';

      fetch('https://formspree.io/f/xnjryend', {
        method: 'POST',
        body: new FormData(formular),
        headers: { Accept: 'application/json' }
      })
        .then(function (odpoved) {
          if (!odpoved.ok) throw new Error('Formspree odpovedel chybou');
          hlaska.textContent = 'Zpráva odeslána. Ozvu se do dvou pracovních dnů.';
          hlaska.className = 'form-feedback ok';
          formular.reset();
        })
        .catch(function () {
          /* Podrobnost chyby se ven nedostane. Uživateli nepomůže
             a útočníkovi by prozradila, co běží na pozadí. */
          hlaska.textContent = 'Odesílání selhalo. Napište prosím přímo na filda.lochman12@gmail.com';
          hlaska.className = 'form-feedback err';
        })
        .then(function () {
          tlacitko.disabled = false;
          popisek.textContent = 'Odeslat zprávu';
        });
    });
  }
})();
