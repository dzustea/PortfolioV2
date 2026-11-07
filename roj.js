/* ══ ROJ KURZORŮ ═══════════════════════════════════════════════
   Nastavení knihovny CursorSwarm (ZhengLinLei/cursor-swarm.js,
   licence MIT). Agenti stránku před návštěvníkem staví: kreslí
   rámy, píšou nadpisy a skenují obrázky na místo. Když se
   odroluje nahoru, zase ji rozeberou.

   Co se jim nedává do ruky:

     * Lišta. Je to jediná věc, kterou člověk potřebuje hned —
       kdyby ji agenti teprve stavěli, pár vteřin by se nedalo
       nikam odejít ani přepnout jazyk.
     * Přeskočení na obsah. Je to první zastávka tabulátoru
       a musí fungovat dřív než cokoli jiného.
     * Pozadí. Není to prvek stránky, je to rámování okna.

   Barvy jsou barvy stránky, ne výchozí barvy knihovny: rudá,
   kost a dva tlumené odstíny mezi nimi. Roj tím pádem vypadá
   jako součást webu, ne jako přilepená ukázka.

   Při prefers-reduced-motion se roj vůbec nespustí; o to se
   stará sama knihovna volbou respectReducedMotion.
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof CursorSwarm !== 'function') return;

  /* Na telefonu roj není vůbec. Stránka je tam stejná, jen se
     nestaví před očima: na malé obrazovce by kurzory zakrývaly
     text, který člověk zrovna čte, a prst stejně posouvá rychleji,
     než by stačily psát. */
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;

  var roj = new CursorSwarm({
    cursors: 3,
    colors: ['#e0242c', '#f2efe9', '#ef3a3a', '#8b8882'],
    names: ['SAZBA', 'TEXT', 'OBRAZ'],
    startPosition: 'corners',

    /* Lišta, přeskakovač a rámování okna zůstávají hotové.

       .konz-pata je v seznamu kvůli oddělovačům: tečky mezi údaji
       dělá pravidlo span + span, takže kdyby ji agenti rozepsali
       po slovech, naskočila by tečka mezi každá dvě.

       .odp-t píše skript sám, když se najede na volbu. Kdyby ji
       stavěl i roj, mohl by přes vypsanou odpověď dopsat výzvu,
       kterou si načetl na startu. */
    ignore: '#hdr, #hdr *, .skip, .konz-pata, .konz-pata *, .odp-t, .ukazatel, .ukazatel *, .pozadi, .pozadi *, .vzorky, .vzorky *',

    frames: true,
    /* Co je jednou postavené, zůstane stát. Rozebírat při cestě
       nahoru a stavět znovu při cestě dolů by z animace udělalo
       překážku: kdo se vrací k projektu, chce ho číst, ne se
       dívat, jak se píše podruhé. */
    deconstruct: false,
    exitAfterBuild: 'home',
    idle: 'dim',

    /* Stránka se posouvá tlumeně, takže roj nemusí dohánět
       člověka, který sjede dolů jedním máchnutím. Rychlost je
       proto klidná a strop nízký. */
    speed: 1,
    adaptiveSpeed: true,
    maxSpeed: 2.4,
    trigger: 0.9,
    typeDuration: 1.4,

    /* Ukazatel stavu roje (ALL AGENTS IDLE · PAGE BUILT) dole
       vlevo je vypnutý: je to ladicí výpis knihovny, ne součást
       stránky. */
    hud: false,
    labels: true,
    marquee: true,
    guides: true,
    sparks: true,
    caret: true,

    respectReducedMotion: true
  });

  /* ── ÚKLID PO ROJI ────────────────────────────────────────────
     Když agenti píšou, rozsekají text na písmena a slova, každé
     do vlastního spanu. Po zastavení ho tak knihovna nechá: na
     oko je to tatáž věta, ale v dokumentu je to sedm set kousků.

     Vadí to dvakrát. Čtečka obrazovky pak nadpis hláskuje
     a překladač stránky celou větu nenajde, protože hledá větu,
     ne jednotlivá písmena — po přepnutí jazyka by zůstala půlka
     stránky v původní řeči.

     Proto se po zastavení kousky rozpustí zpátky do textu
     a sousední textové uzly se slepí. Zbytek dokumentu, třeba
     otevřený projekt, zůstane, jak je. */
  var rozpust = function () {
    var kousky = document.querySelectorAll('span.cs-c, span.cs-w');
    if (!kousky.length) return;

    var rodice = [];
    Array.prototype.forEach.call(kousky, function (kus) {
      var rodic = kus.parentNode;
      if (!rodic) return;
      while (kus.firstChild) rodic.insertBefore(kus.firstChild, kus);
      rodic.removeChild(kus);
      if (rodice.indexOf(rodic) === -1) rodice.push(rodic);
    });
    rodice.forEach(function (rodic) { rodic.normalize(); });
  };

  roj.on('stop', rozpust);

  /* Překladač si úklid volá sám těsně před výměnou vět, kdyby
     knihovna text odkryla až po své události. */
  window.rozpustRoj = rozpust;

  roj.init();

  /* Ať se na něj dá sáhnout z konzole prohlížeče, když se bude
     ladit. Knihovna si tutéž proměnnou staví jen v režimu
     data-auto, který tu není. */
  window.cursorSwarm = roj;
})();
