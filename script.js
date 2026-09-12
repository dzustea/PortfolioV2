/* ══════════════════════════════════════════════════════════════
   FILIP LOCHMAN · chování stránky

   Skript dělá jen to, co se v CSS udělat nedá: rozbalování
   projektů, sledování polohy ve stránce a odeslání formuláře.
   Vzhled i všechny přechody jsou ve stylu.

   Tři pravidla, která tady platí bez výjimky:

     1. Nikde se neposlouchá událost scroll. Spouští se desítky
        až stovky krát za vteřinu a jakýkoli výpočet v její
        obsluze brzdí celou stránku. Polohu prvků hlídá
        IntersectionObserver, tedy sám prohlížeč.

     2. Do stránky se text vkládá výhradně přes textContent.
        Nikde není innerHTML, takže se do dokumentu nedá
        propašovat žádné značkování.

     3. Stav se drží v atributech, které něco znamenají i pro
        čtečku obrazovky (aria-expanded), ne jen ve třídách.
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAČÍTACÍ VRSTVA ──────────────────────────────────────────
     Proužek postupuje podle skutečných událostí, ne podle stopek:

       0,25  styl je načtený a skript běží
       0,60  dokument je hotový
       1,00  písma jsou připravená

     Odkrytí přijde hned po posledním kroku. Když je všechno
     v mezipaměti, proběhne to dřív, než se vrstva vůbec rozsvítí,
     a návštěvník žádné načítání neuvidí.

     Celý blok je první v souboru a v try/catch, aby případná
     chyba kdekoli níž nenechala stránku zakrytou.
     ──────────────────────────────────────────────────────────── */

  try {
    var korenDokumentu = document.documentElement;
    var prouzekNacitani = document.querySelector('.ld-bar i');
    var zacatek = performance.now();

    var postup = function (hodnota) {
      if (prouzekNacitani) prouzekNacitani.style.setProperty('--load', hodnota);
    };

    var odkryj = function () {
      /* Když bylo hotovo dřív, než se vrstva stihla rozsvítit,
         nemá smysl ji plynule zhasínat. */
      if (performance.now() - zacatek < 150) {
        korenDokumentu.classList.add('ready-hned');
      }
      korenDokumentu.classList.add('ready');
    };

    postup('.25');

    /* Čeká se jen na Geist, tedy na písmo, které je pod vrstvou
       skutečně vidět. Kdyby se čekalo na document.fonts.ready,
       zdrželo by odkrytí i monospace písmo drobných popisků,
       které na první pohled nikdo nepostrádá. */
    var pripravaPisem = document.fonts && document.fonts.load
      ? Promise.all([
          document.fonts.load('250 1rem Geist'),
          document.fonts.load('400 1rem Geist')
        ])
      : Promise.resolve();

    var dokumentHotov = document.readyState === 'loading'
      ? new Promise(function (splneno) {
          document.addEventListener('DOMContentLoaded', function () { splneno(); }, { once: true });
        })
      : Promise.resolve();

    dokumentHotov.then(function () { postup('.6'); });

    /* Pojistka: kdyby se příslib písem nesplnil, stránka se odkryje
       sama. Písmo se načítá s font-display:swap, takže mezitím
       naskočí náhradní a text je čitelný; držet kvůli tomu vrstvu
       déle by bylo horší než krátká výměna písma. */
    var pojistka = new Promise(function (splneno) { setTimeout(splneno, 1500); });

    /* Na písma se čeká nejvýš půl vteřiny od chvíle, kdy je hotový
       dokument. Déle už by vrstva držela hotový obsah schovaný jen
       kvůli výměně písma, a to je horší než ta výměna sama:
       font-display:swap mezitím vykreslí náhradní řez. */
    var pisemNejvys = dokumentHotov.then(function () {
      return Promise.race([
        pripravaPisem,
        new Promise(function (splneno) { setTimeout(splneno, 500); })
      ]);
    });

    Promise.race([
      pisemNejvys,
      pojistka
    ]).then(function () {
      postup('1');
      requestAnimationFrame(odkryj);
    });
  } catch (chyba) {
    document.documentElement.classList.add('ready', 'ready-hned');
  }


  /* ── PODKLAD NAVIGACE ─────────────────────────────────────────
     Nahoře v dokumentu leží neviditelný proužek. Dokud je vidět,
     stránka stojí na začátku a lišta zůstává průhledná. Jakmile
     proužek vyjede z okna, lišta dostane podklad, aby text pod
     ní nerušil čitelnost odkazů.
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


  /* ── ROZBALOVÁNÍ PROJEKTŮ ─────────────────────────────────────
     Otevřený je vždy nejvýš jeden projekt. Druhé klepnutí na
     otevřený řádek ho zase zavře, takže se dá seznam sbalit celý.

     Skript jen přepíná atribut a třídu. Samotné roztažení řeší
     CSS přechodem grid-template-rows z 0fr na 1fr, což je jediný
     způsob, jak plynule přejít na výšku obsahu bez toho, aby se
     musela dopředu změřit.
     ──────────────────────────────────────────────────────────── */

  var radky = Array.prototype.slice.call(document.querySelectorAll('.px-row[aria-controls]'));

  /* Na telefonu začíná seznam sbalený. Otevřený náhled by hned
     na začátku přidal skoro půl obrazovky a přehled projektů by
     se rozpadl na scrollování. Na počítači zůstává první projekt
     otevřený, protože tam je na náhled místo. */
  if (matchMedia('(max-width: 620px)').matches) {
    radky.forEach(function (radek) {
      radek.setAttribute('aria-expanded', 'false');
      radek.closest('.px-item').classList.remove('is-open');
    });
  }

  radky.forEach(function (radek) {
    radek.addEventListener('click', function () {
      var polozka  = radek.closest('.px-item');
      var otevreny = radek.getAttribute('aria-expanded') === 'true';

      radky.forEach(function (jiny) {
        jiny.setAttribute('aria-expanded', 'false');
        jiny.closest('.px-item').classList.remove('is-open');
      });

      if (!otevreny) {
        radek.setAttribute('aria-expanded', 'true');
        polozka.classList.add('is-open');
      }
    });
  });


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
