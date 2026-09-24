/* ══════════════════════════════════════════════════════════════
   FILIP LOCHMAN · chování stránky

   Skript dělá jen to, co se v CSS udělat nedá: načítací vrstvu,
   sledování polohy ve stránce, otevírání projektů, výřez u
   ukazatele a odeslání formuláře. Vzhled, vlny i vrstvený posun
   jsou ve stylu.

   Pravidla, která tady platí bez výjimky:

     1. Nikde se neposlouchá scroll kvůli výpočtům. Spouští se
        stokrát za vteřinu a jakákoli práce v obsluze brzdí celou
        stránku. Polohu prvků hlídá IntersectionObserver, tedy
        sám prohlížeč; posluchač posunu je tu jediný a nedělá nic
        než že posune stopku.

     2. Pohyb ukazatele se přepočítá nejvýš jednou za snímek
        a zapíše se do dvou proměnných. Nic se neměří, takže
        nevzniká vynucené přeskládání stránky.

     3. Do stránky se text vkládá výhradně přes textContent.
        Nikde není innerHTML, takže se do dokumentu nedá
        propašovat žádné značkování.

     4. Adresa snímku se bere z datového atributu a rovnou se
        ověří: musí to být prostý název souboru z této domény.
        Do src se nikdy nedostane nic jiného.

     5. Stav se drží v atributech, které něco znamenají i pro
        čtečku obrazovky (aria-expanded, aria-invalid), ne jen
        ve třídách.
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var tlumenyPohyb = matchMedia('(prefers-reduced-motion: reduce)');

  /* ── OPONA: SESTAVENÍ V TERMINÁLU ─────────────────────────────
     Opona je terminál, ve kterém se stránka sestavuje. Řádky
     výpisu přibývají podle skutečných událostí, ne podle stopek:

       1.  styl a skript jsou přenesené
       2.  písma jsou připravená
       3.  obsah je poskládaný
       4.  hotovo, a za jak dlouho

     Čísla vedle řádků nejsou pro efekt. Kilobajty bere skript
     z měření prohlížeče, počet projektů z dokumentu a čas
     z hodin, které běží od prvního bajtu stránky.

     Pod výpisem čeká příkaz. Nikdo ho nepíše, dokud člověk
     nestiskne šipku dolů; pak se dopíše sám, znak po znaku, okno
     se rozletí přes celou obrazovku a pod ním zůstane hotová
     stránka. Terminál se tím promění ve web.

     Celý blok je první v souboru a v try/catch, aby případná
     chyba kdekoli níž nenechala stránku zakrytou.
     ──────────────────────────────────────────────────────────── */

  var koren = document.documentElement;
  var opona = null;
  var odhrnuto = false;

  try {
    koren.classList.add('js');

    opona = document.getElementById('opona');
    var radkyLogu = opona ? Array.prototype.slice.call(opona.querySelectorAll('.op-r')) : [];
    var psano = opona ? opona.querySelector('.op-psano') : null;
    var hotovo = false;

    if (opona) opona.classList.add('op-nacita');

    var hotovychRadku = 0;

    var zapisRadek = function (poradi, hodnota) {
      var radek = radkyLogu[poradi];
      if (!radek) return;
      var pole = radek.querySelector('.op-hod');
      if (pole && hodnota) pole.textContent = hodnota;
      if (radek.classList.contains('je-hotovo')) return;

      radek.classList.add('je-hotovo');
      hotovychRadku += 1;

      /* Za terminálem se o kus vynoří svět stránky: s každým
         hotovým řádkem sílí mřížka i záře, takže je vidět, že se
         něco staví, ne jen čeká. */
      opona.style.setProperty('--staveno',
        (hotovychRadku / radkyLogu.length).toFixed(2));
    };

    /* Kolik toho prohlížeč doopravdy stáhl. Když měření není
       k dispozici, řádek prostě hodnotu nemá. */
    var preneseno = function (pripony) {
      if (!window.performance || !performance.getEntriesByType) return '';

      var bajtu = 0;
      var nasel = false;

      performance.getEntriesByType('resource').forEach(function (z) {
        for (var i = 0; i < pripony.length; i++) {
          if (z.name.indexOf(pripony[i]) > -1) {
            bajtu += z.transferSize || 0;
            nasel = true;
            return;
          }
        }
      });

      if (!nasel) return '';
      /* Nula bajtů neznamená, že se nic nestahovalo: soubor byl
         v mezipaměti. Říct to je poctivější než prázdný řádek. */
      if (!bajtu) return 'z mezipaměti';
      return Math.round(bajtu / 1024) + ' kB';
    };

    zapisRadek(0, '');

    /* Čeká se na písma, která jsou pod oponou hned vidět: text
       v Archivu a jméno s nadpisy v Chakře. Strojopis se
       nedoprošuje, drobné popisky snesou náhradní řez o chvíli
       déle. */
    var pripravaPisem = document.fonts && document.fonts.load
      ? Promise.all([
          document.fonts.load('600 1rem Archivo'),
          document.fonts.load('400 1rem Archivo'),
          document.fonts.load('600 1rem "Chakra Petch"')
        ])
      : Promise.resolve();

    var dokumentHotov = document.readyState === 'loading'
      ? new Promise(function (splneno) {
          document.addEventListener('DOMContentLoaded', function () { splneno(); }, { once: true });
        })
      : Promise.resolve();

    dokumentHotov.then(function () {
      zapisRadek(0, preneseno(['.css', '.js']));
      var projektu = document.querySelectorAll('.polozka:not(.polozka-chysta)').length;
      zapisRadek(2, projektu ? projektu + ' projekty' : '');
    });

    /* Pojistka: kdyby se příslib písem nesplnil, opona se dá
       otevřít i tak. Písmo má font-display:swap, takže mezitím
       naskočí náhradní a text je čitelný. */
    var pojistka = new Promise(function (splneno) { setTimeout(splneno, 1500); });

    var pisemNejvys = dokumentHotov.then(function () {
      return Promise.race([
        pripravaPisem,
        new Promise(function (splneno) { setTimeout(splneno, 300); })
      ]);
    });

    Promise.race([pisemNejvys, pojistka]).then(function () {
      zapisRadek(1, preneseno(['.woff2']));
      zapisRadek(3, Math.round(performance.now()) + ' ms');
      hotovo = true;
      if (opona) opona.classList.remove('op-nacita');
    });

    /* ── SPUŠTĚNÍ ─────────────────────────────────────────────
       Stisk šipky dopíše příkaz a rozletí okno. Skript při tom
       nekreslí nic než text příkazu; rozlet je v keyframech,
       takže ho vede grafika.
       ─────────────────────────────────────────────────────── */

    if (opona) {
      var spousti = false;
      var PRIKAZ = './start';

      var rozlet = function () {
        koren.classList.add('je-vyjezd');
        /* Délka je tatáž jako v keyframech rozletu. Po ní opona
           zmizí nadobro a stránku přebírají šipky. */
        setTimeout(function () {
          odhrnuto = true;
          koren.classList.add('je-odhrnuto');
          window.scrollTo(0, 0);
        }, 880);
      };

      var spust = function () {
        /* Dokud se sestavuje, není co spouštět. */
        if (spousti || odhrnuto || !hotovo) return;
        spousti = true;

        if (!psano) { rozlet(); return; }

        var znak = 0;
        var pise = setInterval(function () {
          znak += 1;
          psano.textContent = PRIKAZ.slice(0, znak);
          if (znak >= PRIKAZ.length) {
            clearInterval(pise);
            setTimeout(rozlet, 140);
          }
        }, 34);
      };

      window.addEventListener('keydown', function (udalost) {
        if (odhrnuto) return;
        var k = udalost.key;
        if (k === 'ArrowDown' || k === ' ' || k === 'Spacebar' ||
            k === 'PageDown' || k === 'Enter') {
          udalost.preventDefault();
          spust();
        }
      });

      /* Klepnutí i švihnutí prstem dělají totéž: na telefonu
         žádná šipka dolů není. */
      window.addEventListener('pointerdown', function () { spust(); });
      window.addEventListener('wheel', function () { spust(); }, { passive: true });
      window.addEventListener('touchmove', function () { spust(); }, { passive: true });
    }
  } catch (chyba) {
    koren.classList.add('je-odhrnuto');
    odhrnuto = true;
  }


  /* ── PODKLAD LIŠTY ────────────────────────────────────────────
     Nahoře v dokumentu leží neviditelný proužek. Dokud je vidět,
     stránka stojí na začátku a lišta zůstává průhledná.
     ──────────────────────────────────────────────────────────── */

  var lista = document.getElementById('hdr');
  var hlidka = document.getElementById('nav-sentinel');

  if (lista && hlidka) {
    new IntersectionObserver(function (zaznamy) {
      lista.classList.toggle('solid', !zaznamy[0].isIntersecting);
    }).observe(hlidka);
  }


  /* ── ZVÝRAZNĚNÍ AKTIVNÍ SEKCE ─────────────────────────────────
     Sleduje se pás uprostřed okna. Když do něj zasahuje víc
     sekcí, vyhrává ta níž na stránce, protože k ní uživatel
     právě míří.
     ──────────────────────────────────────────────────────────── */

  var odkazy = {};
  Array.prototype.forEach.call(document.querySelectorAll('#hdr nav a'), function (odkaz) {
    odkazy[odkaz.getAttribute('href').slice(1)] = odkaz;
  });

  var poradi = ['prace', 'projekty', 'kontakt'];
  var sekce = poradi.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  /* Ukazatel stavu vpravo dole. Úroveň není nic jiného než
     sekce, jen pojmenovaná tak, jak se stránka tváří. */
  var ukazatel = document.querySelector('.ukazatel');
  var ukCislo = ukazatel ? ukazatel.querySelector('.uk-u b') : null;

  var urovne = { uvod: '1', prace: '2', projekty: '3', kontakt: '4' };

  var zapisUroven = function (id) {
    if (!ukCislo) return;
    var cislo = urovne[id] || urovne.uvod;
    if (ukCislo.textContent !== cislo) ukCislo.textContent = cislo;
  };

  /* U paty ukazatel zmizí. Je to plovoucí lišta v pravém dolním
     rohu a v patě stojí text na stejném místě; na užším okně se
     přes sebe položí. Na konci stránky navíc nemá co hlásit,
     dál už se nejde. */
  var pata = document.querySelector('footer');

  if (pata && ukazatel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (zaznamy) {
      koren.classList.toggle('pata-na-ocich', zaznamy[0].isIntersecting);
    }, { rootMargin: '0px 0px -16px 0px' }).observe(pata);
  }

  if (sekce.length) {
    var videt = Object.create(null);

    var sledovacSekci = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (zaznam) { videt[zaznam.target.id] = zaznam.isIntersecting; });

      var aktivni = null;
      for (var i = poradi.length - 1; i >= 0; i--) {
        if (videt[poradi[i]]) { aktivni = poradi[i]; break; }
      }
      for (var id in odkazy) odkazy[id].classList.toggle('aktivni', id === aktivni);
      zapisUroven(aktivni);
    }, { rootMargin: '-38% 0px -55% 0px' });

    sekce.forEach(function (prvek) { sledovacSekci.observe(prvek); });
  }


  /* ── ODHALOVÁNÍ OBSAHU ────────────────────────────────────────
     Prvek se odhalí, jakmile je z osmi procent v okně, a pak se
     přestane sledovat: efekt má proběhnout jednou.
     ──────────────────────────────────────────────────────────── */

  var cekajici = Array.prototype.slice.call(document.querySelectorAll('.rv'));

  var odhal = function (prvek, bezPrechodu) {
    /* Co je už nad oknem, se objeví rovnou: animovat něco,
       co návštěvník stejně nevidí, nemá smysl. */
    if (bezPrechodu) prvek.classList.add('bez-prechodu');
    prvek.classList.add('in');

    var misto = cekajici.indexOf(prvek);
    if (misto !== -1) cekajici.splice(misto, 1);
    sledovacObsahu.unobserve(prvek);
  };

  var sledovacObsahu = new IntersectionObserver(function (zaznamy) {
    zaznamy.forEach(function (zaznam) {
      if (zaznam.isIntersecting) odhal(zaznam.target, false);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  cekajici.forEach(function (prvek) { sledovacObsahu.observe(prvek); });

  /* Sledovač sám nestačí. Při skoku na kotvu, při obnovení polohy
     po návratu zpět nebo při prudkém švihnutí prstem může prvek
     proletět oknem mezi dvěma snímky: poměr překrytí je nula před
     i po, žádný práh se nepřekročí a hlášení nepřijde. Takový
     prvek by zůstal průhledný napořád.

     Proto se po zastavení posunu jednou projdou ty, které se
     ještě neodhalily, a co je nad čárou, se rozsvítí. Měří se
     jen v klidu, ne za pohybu. */

  var doberOpozdilce = function () {
    if (!cekajici.length) return;
    var cara = window.innerHeight * 0.92;

    cekajici.slice().forEach(function (prvek) {
      var poloha = prvek.getBoundingClientRect();
      if (poloha.top < cara) odhal(prvek, poloha.bottom < 0);
    });
  };

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', doberOpozdilce, { passive: true });
  } else {
    /* Náhrada pro prohlížeče bez scrollend. V obsluze se nic
       nepočítá, jen se posune stopka; měří se až v klidu. */
    var stopka = 0;
    window.addEventListener('scroll', function () {
      clearTimeout(stopka);
      stopka = setTimeout(doberOpozdilce, 120);
    }, { passive: true });
  }

  /* Návrat tlačítkem zpět obnoví polohu ve stránce dřív,
     než se cokoli pohne. */
  window.addEventListener('pageshow', doberOpozdilce);


  /* ── PÁS TECHNOLOGIÍ ──────────────────────────────────────────
     Posun o polovinu šířky navazuje sám na sebe jen tehdy, když
     je seznam v pásu dvakrát. Druhá polovina je kopie té první
     a je schovaná před čtečkou obrazovky.
     ──────────────────────────────────────────────────────────── */

  var pas = document.querySelector('.pas-stopa');

  if (pas) {
    Array.prototype.slice.call(pas.children).forEach(function (polozka) {
      var kopie = polozka.cloneNode(true);
      kopie.setAttribute('aria-hidden', 'true');
      pas.appendChild(kopie);
    });
  }


  var presnyUkazatel = matchMedia('(hover: hover) and (pointer: fine)');


  /* ── OVLÁDÁNÍ ŠIPKAMI ─────────────────────────────────────────
     Za oponou se stránka neposouvá kolečkem ani prstem. Posouvá
     se po zastávkách a vede ji šipka nahoru a dolů; enter otevře
     to, na čem ukazatel stojí.

     Zastávek je jedenáct: tři volby v úvodu, tři obory, čtyři
     projekty a kontakt. Jsou označené v dokumentu atributem
     data-stanice, takže přidat další znamená přidat atribut.

     Jak se to chová:

       * Vlastní posun prohlížeče je vypnutý. Kolečko, prst,
         mezerník ani page down stránkou nehnou. Jediné, co s ní
         hne, je skok na zastávku, a ten provede skript jedním
         voláním scrollTo; plynulost obstará scroll-behavior
         ve stylu, takže se tu nic nepočítá po snímcích.

       * Mezi dvěma skoky je krátká uzávěra. Držená šipka tak
         stránku nerozjede do nesmyslné rychlosti a nic se
         nefronta.

       * Ve formulářových polích patří šipky tomu, kdo píše.
     ──────────────────────────────────────────────────────────── */

  var stanice = Array.prototype.slice.call(document.querySelectorAll('[data-stanice]'));
  var kde = -1;

  /* Zastávka, která sama zaostřit nejde (obor, zamčená úroveň,
     kontakt), ji dostane skriptem. Jinak by pozornost zůstala
     viset na předchozím odkazu a enter by spustil něco úplně
     jiného, než na čem ukazatel stojí. Mínus jedna znamená, že
     se na ni dá zaostřit skriptem, ale tabulátor ji přeskočí. */
  stanice.forEach(function (prvek) {
    var jmeno = prvek.tagName;
    if (jmeno === 'A' || jmeno === 'BUTTON') return;
    if (!prvek.hasAttribute('tabindex')) prvek.setAttribute('tabindex', '-1');
  });

  /* Úroveň v rejstříku se načte sama, jakmile na ni ukazatel
     dojede. Obsluhu si doplní blok projektů níž; tady jsou jen
     přihrádky, aby na sebe bloky nemusely sahat. */
  var otevriUroven = null;

  var psaciPole = function (prvek) {
    if (!prvek) return false;
    var jmeno = prvek.tagName;
    return jmeno === 'INPUT' || jmeno === 'TEXTAREA' || jmeno === 'SELECT' || prvek.isContentEditable;
  };

  /* ── UZAVŘENÝ POSUN ───────────────────────────────────────────
     Prohlížeči se posun bere úplně: dokud je opona na místě,
     nemá se kam posouvat, a po jejím odhrnutí vede stránku jen
     šipka. Textové pole zprávy si posun uvnitř sebe nechává.
     ──────────────────────────────────────────────────────────── */

  var vlastniPosun = function (cil) {
    while (cil && cil !== document.body) {
      if (cil.tagName === 'TEXTAREA') return true;
      cil = cil.parentElement;
    }
    return false;
  };

  /* Hra po zastávkách platí jen tam, kde je klávesnice. Na dotyku
     se stránka posouvá úplně obyčejně, prstem: posouvání po
     zastávkách je na telefonu boj s tím, co prst umí sám, a šipky,
     kterými se to ovládá pohodlně, tam nikdo nemá.

     Opona zůstává i na dotyku, jen ji odhrne švihnutí. */
  var dotyk = matchMedia('(hover: none), (pointer: coarse)').matches;

  var zadrz = function (udalost) {
    /* V režimu formuláře se stránka posouvat smí: nadzvedne ji
       klávesnice a člověk musí vidět, do čeho píše. */
    if (document.documentElement.classList.contains('rezim-formular')) return;
    if (vlastniPosun(udalost.target)) return;
    udalost.preventDefault();
  };

  if (!dotyk) window.addEventListener('wheel', zadrz, { passive: false });

  /* Dokud visí opona, nemá se stránka kam posouvat ani na dotyku:
     švihnutí ji odhrne a nic víc. Jakmile je odhrnutá, prst
     posouvá stránku úplně normálně. */
  window.addEventListener('touchmove', function (udalost) {
    if (odhrnuto && dotyk) return;
    zadrz(udalost);
  }, { passive: false });

  /* ── OPIČKA NA LIÁNÁCH ────────────────────────────────────────
     Ukazatel postupu. Jedna liána je jedna zastávka, opička na ni
     skočí pokaždé, když se ukazatel pohne. Liány se dodělají
     podle počtu zastávek, aby to nikdy nesedělo jen náhodou.
     ──────────────────────────────────────────────────────────── */

  var hrazda = document.querySelector('.hrazda');
  var opicka = hrazda ? hrazda.querySelector('.opicka') : null;
  var liany = [];

  /* Hrazda neměří zastávky, ale místa ve stránce. Volby v konzoli
     jsou nabídka, ne cesta, a celá historie projektů je jedno
     místo: opička k ní doskáče, počká tam, a zase vyrazí, až
     z ní člověk odejde.

     Každá zastávka proto dostane pořadí své liány; ty, které
     liánu nemají, mají mínus jedna. */
  var liceni = [];
  var lian = 0;
  var rejstrikMa = -1;

  stanice.forEach(function (prvek) {
    if (prvek.classList.contains('volba')) { liceni.push(-1); return; }

    if (prvek.closest('.rejstrik')) {
      if (rejstrikMa < 0) { rejstrikMa = lian; lian += 1; }
      liceni.push(rejstrikMa);
      return;
    }

    liceni.push(lian);
    lian += 1;
  });

  var poloha = function (poradi) {
    return ((poradi + 0.5) / lian * 100).toFixed(2) + '%';
  };

  if (hrazda && opicka && lian) {
    for (var l = 0; l < lian; l++) (function (i) {
      var liana = document.createElement('i');
      liana.className = 'liana';
      liana.style.setProperty('--x', poloha(i));
      hrazda.insertBefore(liana, opicka);
      liany.push(liana);
    })(l);

    /* Dokud je člověk v úvodu, visí opička na začátku hrazdy,
       před první liánou: cesta ještě nezačala. */
    opicka.style.setProperty('--x', '24px');
  }

  var presunOpicku = function (index) {
    if (!opicka || !liany.length) return;
    var byloKde = kde;
    var poradi = liceni[index];
    if (poradi === undefined) poradi = -1;
    var bylo = kde > -1 ? liceni[kde] : -1;

    /* Uvnitř historie se opička nehýbe: je to jedno místo. */
    if (poradi > -1 && poradi === bylo) return;

    liany.forEach(function (liana, i) {
      liana.classList.toggle('je-drzena', i === poradi);
    });

    /* V úvodu se opička vrátí na začátek hrazdy. */
    if (poradi < 0) {
      opicka.style.setProperty('--x', '24px');
      opicka.style.setProperty('--smer', '-1');
      return;
    }

    opicka.style.setProperty('--x', 'calc(' + poloha(poradi) + ' - 12px)');
    opicka.style.setProperty('--smer', index < byloKde ? '-1' : '1');

    /* Skok se přehraje znovu i při druhém stisku téže šipky.
       Bez vynuceného přečtení rozměru by prohlížeč změnu třídy
       v jednom snímku neviděl a opička by jen klouzala. */
    opicka.classList.remove('skace');
    void opicka.offsetWidth;
    opicka.classList.add('skace');
  };

  /* Na dotyku stránku nevede ukazatel, ale prst. Opička proto
     hlídá, co je zrovna uprostřed okna: dokud je to táž liána,
     visí a čeká, a teprve když se objeví další sekce, skočí. Po
     hrazdě tím pádem neklouže ani na telefonu.

     Měří to prohlížeč sám přes IntersectionObserver, takže se
     při posunu nic nepočítá. Pás uprostřed okna je úzký
     schválně: rozhoduje, co má člověk před očima. */
  if (dotyk && 'IntersectionObserver' in window && stanice.length) {
    var vidim = Object.create(null);

    var sledovacZastavek = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) {
        vidim[stanice.indexOf(z.target)] = z.isIntersecting;
      });

      /* Když do pásu zasahuje víc zastávek, vyhrává ta výš:
         k té člověk právě dorazil. */
      for (var i = 0; i < stanice.length; i++) {
        if (vidim[i]) {
          if (i !== kde) { presunOpicku(i); kde = i; }
          return;
        }
      }
    }, { rootMargin: '-42% 0px -42% 0px' });

    stanice.forEach(function (prvek) { sledovacZastavek.observe(prvek); });
  }


  /* ── SKOK NA ZASTÁVKU ─────────────────────────────────────── */

  var jedeme = false;

  var sloupce = document.querySelector('.konz-sloupce');
  var odpoved = document.querySelector('.odpoved');
  var odpovedText = odpoved ? odpoved.querySelector('.odp-t') : null;
  var ODPOVED_VYCHOZI = odpovedText ? odpovedText.textContent : '';
  var pise = 0;

  /* Odpověď vedle konzole. Text se bere z atributu na řádku
     a vypisuje se znak po znaku, jako by ho stroj vlevo právě
     psal; vkládá se přes textContent, takže se do stránky
     nedostane žádné značkování.

     Při potlačeném pohybu se nic nevypisuje, text prostě stojí. */
  var zapisOdpoved = function (prvek) {
    if (!odpovedText) return;
    var popis = prvek && prvek.getAttribute ? prvek.getAttribute('data-popis') : null;
    var text = popis || ODPOVED_VYCHOZI;

    if (sloupce) sloupce.classList.toggle('ma-vyber', !!popis);

    clearInterval(pise);

    if (!popis || tlumenyPohyb.matches) {
      odpoved.classList.remove('pise');
      odpovedText.textContent = text;
      return;
    }

    var znak = 0;
    odpoved.classList.add('pise');
    odpovedText.textContent = '';

    pise = setInterval(function () {
      /* Po dvou znacích naráz: dost rychle na to, aby to nikoho
         nezdržovalo, a dost pomalu na to, aby bylo vidět psaní. */
      znak += 2;
      odpovedText.textContent = text.slice(0, znak);
      if (znak >= text.length) {
        clearInterval(pise);
        odpoved.classList.remove('pise');
      }
    }, 14);
  };

  var oznacStanici = function (index) {
    /* Zvýrazněná je vždy nejvýš jedna zastávka: ukazatel vede
       jenom šipka, myš do výběru nemluví. */
    stanice.forEach(function (prvek) {
      prvek.classList.remove('je-vybrana', 'je-na-rade');
    });

    var deska = stanice[index];
    var jeVolba = deska.classList.contains('volba');
    deska.classList.add(jeVolba ? 'je-vybrana' : 'je-na-rade');

    zapisOdpoved(jeVolba ? deska : null);

    /* Odchod z historie zavře, co v ní zůstalo rozbalené. */
    if (otevriUroven) otevriUroven(deska);

    presunOpicku(index);
    kde = index;
  };

  var skoc = function (index) {
    if (jedeme || !stanice.length) return;
    if (index < 0) index = stanice.length - 1;
    if (index > stanice.length - 1) index = 0;

    jedeme = true;
    setTimeout(function () { jedeme = false; }, 380);

    oznacStanici(index);

    var deska = stanice[index];
    var r = deska.getBoundingClientRect();
    var cil = r.top + window.scrollY - (window.innerHeight - r.height) / 2;
    var nejvic = document.documentElement.scrollHeight - window.innerHeight;
    if (cil < 0) cil = 0;
    if (cil > nejvic) cil = nejvic;

    window.scrollTo(0, cil);

    /* Zaostřením se zastávka potvrdí enterem sama. Posun si
       řídíme vlastní, proto preventScroll. */
    if (typeof deska.focus === 'function') deska.focus({ preventScroll: true });
  };

  window.addEventListener('keydown', function (udalost) {
    if (!odhrnuto || dotyk) return;
    if (udalost.metaKey || udalost.ctrlKey || udalost.altKey) return;

    var k = udalost.key;

    /* Mezerník a page down by stránkou hnuly po svém. */
    if ((k === ' ' || k === 'Spacebar' || k === 'PageDown' || k === 'PageUp' ||
         k === 'Home' || k === 'End') && !psaciPole(document.activeElement)) {
      udalost.preventDefault();
      return;
    }

    var kam = k === 'ArrowDown' ? 1 : (k === 'ArrowUp' ? -1 : 0);
    if (!kam) return;
    if (psaciPole(document.activeElement)) return;

    udalost.preventDefault();
    skoc(kde < 0 ? (kam > 0 ? 0 : stanice.length - 1) : kde + kam);
  });

  /* ── REŽIM FORMULÁŘE ──────────────────────────────────────────
     Stránka se ovládá šipkami, jenže do formuláře se šipkami psát
     nedá. Jakmile tedy pozornost padne do kteréhokoli pole,
     přepne se stránka do režimu formuláře: šipky, kolečko i prst
     patří psaní a v ukazateli stavu stojí, jak se vrátit do hry.
     Ven vede esc nebo prostě odchod pozornosti z formuláře.

     Enter na kontaktu jako na zastávce rovnou postaví kurzor do
     prvního pole, takže se do formuláře dá dostat i poslepu.
     ──────────────────────────────────────────────────────────── */

  var formularHry = document.getElementById('cform');
  var kontakt = document.getElementById('kontakt');

  if (formularHry && kontakt) {
    var zapniRezim = function () {
      document.documentElement.classList.add('rezim-formular');
    };

    var vypniRezim = function () {
      document.documentElement.classList.remove('rezim-formular');
    };

    formularHry.addEventListener('focusin', zapniRezim);

    formularHry.addEventListener('focusout', function () {
      /* Pozornost může skákat mezi poli; rozhodne se až podle
         toho, kde skončila. */
      setTimeout(function () {
        if (!formularHry.contains(document.activeElement)) vypniRezim();
      }, 0);
    });

    window.addEventListener('keydown', function (udalost) {
      if (udalost.key !== 'Escape') return;
      if (!document.documentElement.classList.contains('rezim-formular')) return;
      udalost.preventDefault();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      vypniRezim();
    });

    /* Enter na zastávce kontaktu postaví kurzor do prvního pole. */
    var kontaktniStanice = kontakt.querySelector('[data-stanice]');
    if (kontaktniStanice) {
      kontaktniStanice.setAttribute('tabindex', '0');
      kontaktniStanice.addEventListener('keydown', function (udalost) {
        if (udalost.key !== 'Enter') return;
        udalost.preventDefault();
        var prvni = formularHry.querySelector('input, textarea');
        if (prvni) prvni.focus();
      });
    }
  }


  /* Odkazy v liště a tlačítka v úvodu míří na sekce. Aby po nich
     ukazatel nezůstal stát jinde, než stojí stránka, vede je
     tentýž skok: najde se první zastávka uvnitř cílové sekce. */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (odkaz) {
    var cil = odkaz.getAttribute('href');
    if (cil === '#' || cil === '#main') return;

    odkaz.addEventListener('click', function (udalost) {
      var sekce = document.querySelector(cil);
      if (!sekce) return;

      var index = -1;
      for (var i = 0; i < stanice.length; i++) {
        if (sekce.contains(stanice[i])) { index = i; break; }
      }
      if (index < 0) return;

      udalost.preventDefault();
      skoc(index);
    });
  });

  /* Potvrzení klávesou blikne, teprve pak stránka popojede.
     Stisk tak nezůstane bez odezvy. */
  stanice.forEach(function (prvek) {
    if (!prvek.classList.contains('volba')) return;
    prvek.addEventListener('keydown', function (udalost) {
      if (udalost.key !== 'Enter') return;
      prvek.classList.remove('je-spustena');
      void prvek.offsetWidth;
      prvek.classList.add('je-spustena');
    });
  });



  /* ── ÚROVNĚ V REJSTŘÍKU ───────────────────────────────────────
     Ukazatel po rejstříku jenom jezdí; sám nic neotevírá. Panel
     s popisem se rozbalí teprve enterem, protože při procházení
     stránky nemá nikdo zájem číst všechno naráz.

     Enter podruhé otevře živý web, takže první stisk ukáže, o co
     jde, a druhý to spustí. Esc panel zavře. Klepnutí myší dělá
     totéž co enter, jen bez klávesnice.

     Otevřená je vždy nejvýš jedna úroveň, takže seznam zůstane
     krátký i na telefonu.
     ──────────────────────────────────────────────────────────── */

  var urovne2 = Array.prototype.slice.call(document.querySelectorAll('.polozka .radek'));

  var zavriUrovne = function (krome) {
    urovne2.forEach(function (radek) {
      var polozka = radek.closest('.polozka');
      if (polozka === krome) return;
      polozka.classList.remove('je-otevrena');
      if (radek.hasAttribute('aria-expanded')) radek.setAttribute('aria-expanded', 'false');
    });
  };

  var jeOtevrena = function (radek) {
    var polozka = radek.closest('.polozka');
    return !!polozka && polozka.classList.contains('je-otevrena');
  };

  var prepniUroven = function (radek) {
    var polozka = radek.closest('.polozka');
    if (!polozka) return;

    /* Zamčená úroveň nemá co otevřít, jen se otřese. */
    if (polozka.classList.contains('polozka-chysta')) {
      radek.classList.remove('je-zamceno');
      void radek.offsetWidth;
      radek.classList.add('je-zamceno');
      return;
    }

    if (jeOtevrena(radek)) {
      /* Otevřená úroveň se druhým stiskem spustí. */
      var odkaz = polozka.querySelector('.odkaz');
      if (odkaz) odkaz.click();
      return;
    }

    zavriUrovne(polozka);
    polozka.classList.add('je-otevrena');
    if (radek.hasAttribute('aria-expanded')) radek.setAttribute('aria-expanded', 'true');
  };

  otevriUroven = function (prvek) {
    /* Odchod ukazatele z rejstříku zavře, co zůstalo otevřené. */
    var polozka = prvek && prvek.closest ? prvek.closest('.polozka') : null;
    if (!polozka) zavriUrovne(null);
  };

  urovne2.forEach(function (radek) {
    radek.addEventListener('click', function () { prepniUroven(radek); });

    /* Tlačítko by na enter poslalo klepnutí samo, ale zamčená
       úroveň je obyčejný prvek, takže si enter musí odchytit
       skript. U obou pak platí totéž pravidlo. */
    if (radek.tagName !== 'BUTTON') {
      radek.addEventListener('keydown', function (udalost) {
        if (udalost.key !== 'Enter') return;
        udalost.preventDefault();
        prepniUroven(radek);
      });
    }

    radek.addEventListener('keydown', function (udalost) {
      if (udalost.key !== 'Escape') return;
      if (!jeOtevrena(radek)) return;
      udalost.preventDefault();
      zavriUrovne(null);
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
    var poleJmeno = document.getElementById('fn');
    var poleEmail = document.getElementById('fe');
    var poleZprava = document.getElementById('fm');

    var oznac = function (pole, chybne) {
      if (chybne) pole.setAttribute('aria-invalid', 'true');
      else pole.removeAttribute('aria-invalid');
      return chybne;
    };

    formular.addEventListener('submit', function (udalost) {
      udalost.preventDefault();

      var tlacitko = document.getElementById('btn-send');
      var popisek = document.getElementById('btn-txt');
      var hlaska = document.getElementById('fmsg');

      var chybi = [
        oznac(poleJmeno, !poleJmeno.value.trim()),
        /* Tvar adresy hlídá prohlížeč sám podle type="email". */
        oznac(poleEmail, !poleEmail.value.trim() || !poleEmail.checkValidity()),
        oznac(poleZprava, !poleZprava.value.trim())
      ].indexOf(true) !== -1;

      if (chybi) {
        hlaska.textContent = 'Vyplňte prosím všechna pole platnými údaji.';
        hlaska.className = 'hlaska err';
        var prvniChyba = formular.querySelector('[aria-invalid="true"]');
        if (prvniChyba) prvniChyba.focus();
        return;
      }

      /* Tlačítko se zamkne, aby odesláním dvakrát za sebou
         nevznikly dvě stejné zprávy. */
      tlacitko.disabled = true;
      popisek.textContent = 'Odesílám...';
      hlaska.textContent = '';
      hlaska.className = 'hlaska';

      fetch('https://formspree.io/f/xnjryend', {
        method: 'POST',
        body: new FormData(formular),
        headers: { Accept: 'application/json' }
      })
        .then(function (odpoved) {
          if (!odpoved.ok) throw new Error('Formspree odpovedel chybou');
          hlaska.textContent = 'Zpráva odeslána. Ozvu se co nejdřív.';
          hlaska.className = 'hlaska ok';
          formular.reset();
        })
        .catch(function () {
          /* Podrobnost chyby se ven nedostane. Uživateli nepomůže
             a útočníkovi by prozradila, co běží na pozadí. */
          hlaska.textContent = 'Odeslání selhalo. Napište prosím přímo na filda.lochman12@gmail.com';
          hlaska.className = 'hlaska err';
        })
        .then(function () {
          tlacitko.disabled = false;
          popisek.textContent = 'Odeslat zprávu';
        });
    });
  }

  /* ── VZKAZ V KONZOLI ──────────────────────────────────────────
     Poslední drobnost. Kdo si otevře nástroje vývojáře, najde
     tam vzkaz; ostatním nezavazí, protože o ní neví.
     ──────────────────────────────────────────────────────────── */

  console.log(
    "%cAhoj.%c Koukáte do konzole, takže asi víte, co je zač.\n" +
    "Celý web je psaný ručně, bez jediného rámce a bez jediné\n" +
    "knihovny. Tenhle soubor si můžete přečíst celý, je česky.\n" +
    "Kdyby vás něco zajímalo: filiplochman.cz",
    "color:#ef3a3a;font-weight:700", "color:inherit"
  );

})();
