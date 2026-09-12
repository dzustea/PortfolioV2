/* ══════════════════════════════════════════════════════════════
   FILIP LOCHMAN · chování stránky

   Skript dělá jen to, co se v CSS udělat nedá. Vzhled, hloubka
   i přechody jsou ve stylu; sem patří výběr projektu, sledování
   polohy ve stránce a odeslání formuláře.

   Tři pravidla, která tady platí bez výjimky:

     1. Nikde se neposlouchá událost scroll. Scroll se spouští
        desítky až stovky krát za vteřinu a jakýkoli výpočet
        v jeho obsluze brzdí celou stránku. Polohu prvků hlídá
        IntersectionObserver, tedy sám prohlížeč.

     2. Poloha kurzoru se nezapisuje přímo v události, ale až
        v requestAnimationFrame. Mezi dvěma snímky tak proběhne
        vždy nejvýš jeden zápis, i když myš pošle deset událostí.

     3. Do stránky se text vkládá výhradně přes textContent.
        Nikde není innerHTML, takže se do dokumentu nedá
        propašovat žádné značkování.
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* Dvě systémová nastavení, na která se stránka ohlíží. */
  var omezenyPohyb = matchMedia('(prefers-reduced-motion: reduce)');
  var jemnyKurzor  = matchMedia('(hover: hover) and (pointer: fine)');


  /* ── PODKLAD NAVIGACE ─────────────────────────────────────────
     Nahoře v dokumentu leží neviditelný proužek vysoký 64 pixelů.
     Dokud je vidět, stránka stojí na začátku a lišta zůstává
     průhledná. Jakmile proužek vyjede z okna, lišta dostane
     rozostřený podklad, aby text pod ní nerušil čitelnost.
     ──────────────────────────────────────────────────────────── */

  var lista   = document.getElementById('hdr');
  var prouzek = document.getElementById('nav-sentinel');

  if (lista && prouzek) {
    new IntersectionObserver(function (zaznamy) {
      lista.classList.toggle('solid', !zaznamy[0].isIntersecting);
    }).observe(prouzek);
  }


  /* ── ZVÝRAZNĚNÍ AKTIVNÍ SEKCE ─────────────────────────────────
     Sleduje se pás uprostřed okna. Sekce, která do něj zasahuje,
     je ta aktuální; když jich zasahuje víc, vyhrává ta níž na
     stránce, protože k ní uživatel právě míří.
     ──────────────────────────────────────────────────────────── */

  var odkazy = {};
  Array.prototype.forEach.call(document.querySelectorAll('#hdr nav a'), function (odkaz) {
    odkazy[odkaz.getAttribute('href').slice(1)] = odkaz;
  });

  var poradi = ['expertise', 'projects', 'contact'];
  var sekce  = poradi
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sekce.length) {
    var videt = Object.create(null);

    var sledovacSekci = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (zaznam) {
        videt[zaznam.target.id] = zaznam.isIntersecting;
      });

      var aktivni = null;
      for (var i = poradi.length - 1; i >= 0; i--) {
        if (videt[poradi[i]]) { aktivni = poradi[i]; break; }
      }

      for (var id in odkazy) {
        odkazy[id].classList.toggle('active', id === aktivni);
      }
    }, { rootMargin: '-38% 0px -55% 0px' });

    sekce.forEach(function (prvek) { sledovacSekci.observe(prvek); });
  }


  /* ── ODHALOVÁNÍ OBSAHU ────────────────────────────────────────
     Prvek se odhalí, jakmile je z osmi procent v okně, a pak se
     přestane sledovat: efekt má proběhnout jednou, ne pokaždé,
     když se kolem něj projede nahoru a dolů.
     ──────────────────────────────────────────────────────────── */

  var sledovacObsahu = new IntersectionObserver(function (zaznamy, sledovac) {
    zaznamy.forEach(function (zaznam) {
      if (!zaznam.isIntersecting) return;
      zaznam.target.classList.add('in');
      sledovac.unobserve(zaznam.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  Array.prototype.forEach.call(document.querySelectorAll('.rv'), function (prvek) {
    sledovacObsahu.observe(prvek);
  });


  /* ── NATOČENÍ JMÉNA ZA KURZOREM ───────────────────────────────
     Skript dodává jediná dvě čísla: výchylku kurzoru od středu
     okna v rozsahu -0,5 až 0,5. Kolik stupňů z toho bude a jak
     se rozdělí mezi oba řádky, řeší styl.

     Zapisuje se na obal úvodu, ne na jednotlivé řádky. Vlastní
     vlastnosti se dědí, takže stačí jeden zápis místo dvou.

     Na dotykových zařízeních a při zapnutém omezení pohybu se
     posluchač vůbec nenavěsí: u dotyku by se natočení projevilo
     až po klepnutí a působilo by to jako závada.
     ──────────────────────────────────────────────────────────── */

  var scena = document.getElementById('stage');
  var uvod  = document.getElementById('hero');

  if (scena && uvod && jemnyKurzor.matches && !omezenyPohyb.matches) {
    var vychylkaX = 0;
    var vychylkaY = 0;
    var cekaNaSnimek = false;

    var zapisVychylku = function () {
      cekaNaSnimek = false;
      scena.style.setProperty('--px', vychylkaX.toFixed(3));
      scena.style.setProperty('--py', vychylkaY.toFixed(3));
    };

    var naplanujZapis = function () {
      if (cekaNaSnimek) return;
      cekaNaSnimek = true;
      requestAnimationFrame(zapisVychylku);
    };

    uvod.addEventListener('pointermove', function (udalost) {
      if (udalost.pointerType !== 'mouse') return;
      vychylkaX = udalost.clientX / window.innerWidth  - 0.5;
      vychylkaY = udalost.clientY / window.innerHeight - 0.5;
      naplanujZapis();
    }, { passive: true });

    /* Po odjetí myši se nápis vrátí do základní polohy. */
    uvod.addEventListener('pointerleave', function () {
      vychylkaX = 0;
      vychylkaY = 0;
      naplanujZapis();
    }, { passive: true });
  }


  /* ── PŘEHLED PROJEKTŮ ─────────────────────────────────────────
     Řádky jsou záložky, panely jejich obsah. Vybírá se myší
     najetím, klepnutím i klávesnicí.

     Pořadí tabulátoru je plovoucí: do seznamu se vstoupí jedním
     stisknutím tabulátoru a mezi projekty se pak přepíná
     šipkami, jak to u záložek očekává čtečka obrazovky.
     Skryté panely jsou ve stylu neviditelné, čímž z pořadí
     tabulátoru vypadnou i odkazy uvnitř nich.
     ──────────────────────────────────────────────────────────── */

  var zalozky = Array.prototype.slice.call(document.querySelectorAll('.px-row'));
  var panely  = Array.prototype.slice.call(document.querySelectorAll('.px-panel'));

  if (zalozky.length && zalozky.length === panely.length) {
    var vyber = function (index, presunoutZaostreni) {
      zalozky.forEach(function (zalozka, i) {
        var jeVybrana = i === index;
        zalozka.setAttribute('aria-selected', jeVybrana ? 'true' : 'false');
        zalozka.tabIndex = jeVybrana ? 0 : -1;
        panely[i].classList.toggle('is-on', jeVybrana);
      });
      if (presunoutZaostreni) zalozky[index].focus();
    };

    zalozky.forEach(function (zalozka, i) {
      zalozka.addEventListener('click', function () { vyber(i, false); });

      /* Najetí myší přepíná rovnou, aby se dal seznam projet
         jedním tahem. Na dotyku se tahle větev nepoužije. */
      if (jemnyKurzor.matches) {
        zalozka.addEventListener('pointerenter', function (udalost) {
          if (udalost.pointerType !== 'mouse') return;
          vyber(i, false);
        });
      }

      zalozka.addEventListener('keydown', function (udalost) {
        var cil = null;
        switch (udalost.key) {
          case 'ArrowDown':
          case 'ArrowRight': cil = (i + 1) % zalozky.length; break;
          case 'ArrowUp':
          case 'ArrowLeft':  cil = (i - 1 + zalozky.length) % zalozky.length; break;
          case 'Home':       cil = 0; break;
          case 'End':        cil = zalozky.length - 1; break;
          default: return;
        }
        udalost.preventDefault();
        vyber(cil, true);
      });
    });
  }


  /* ── KONTAKTNÍ FORMULÁŘ ───────────────────────────────────────
     Odesílá se na Formspree, který zprávu přepošle na e-mail.
     Na straně webu žádný backend není, takže není co napadnout.

     Kontrola vyplnění tady je kvůli okamžité zpětné vazbě, ne
     kvůli bezpečnosti: skutečnou kontrolu i ochranu proti spamu
     dělá až server, na prohlížeč se v tomhle spoléhat nelze.
     ──────────────────────────────────────────────────────────── */

  var formular = document.getElementById('cform');

  if (formular) {
    formular.addEventListener('submit', function (udalost) {
      udalost.preventDefault();

      var jmeno    = document.getElementById('fn').value.trim();
      var email    = document.getElementById('fe').value.trim();
      var zprava   = document.getElementById('fm').value.trim();
      var tlacitko = document.getElementById('btn-send');
      var popisek  = document.getElementById('btn-txt');
      var hlaska   = document.getElementById('fmsg');

      if (!jmeno || !email || !zprava) {
        hlaska.textContent = 'Vyplň prosím všechna pole.';
        hlaska.className = 'form-feedback err';
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
          hlaska.textContent = '✓ Zpráva odeslána. Ozvu se co nejdřív.';
          hlaska.className = 'form-feedback ok';
          formular.reset();
        })
        .catch(function () {
          /* Podrobnost chyby se ven nedostane. Uživateli nepomůže
             a útočníkovi by prozradila, co běží na pozadí. */
          hlaska.textContent = 'Odesílání selhalo. Napiš přímo na filda.lochman12@gmail.com';
          hlaska.className = 'form-feedback err';
        })
        .then(function () {
          tlacitko.disabled = false;
          popisek.textContent = 'Odeslat zprávu';
        });
    });
  }
})();
