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
     * Ukazatel stavu dole a pozadí. Nejsou to prvky stránky,
       je to rámování okna.

   Barvy jsou barvy stránky, ne výchozí barvy knihovny: rudá,
   kost a dva tlumené odstíny mezi nimi. Roj tím pádem vypadá
   jako součást webu, ne jako přilepená ukázka.

   Při prefers-reduced-motion se roj vůbec nespustí; o to se
   stará sama knihovna volbou respectReducedMotion.
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof CursorSwarm !== 'function') return;

  var roj = new CursorSwarm({
    cursors: 3,
    colors: ['#e0242c', '#f2efe9', '#ef3a3a', '#8b8882'],
    names: ['SAZBA', 'TEXT', 'OBRAZ'],
    startPosition: 'corners',

    /* Lišta, přeskakovač a rámování okna zůstávají hotové.

       .konz-pata je v seznamu kvůli oddělovačům: tečky mezi údaji
       dělá pravidlo span + span, takže kdyby ji agenti rozepsali
       po slovech, naskočila by tečka mezi každá dvě. */
    ignore: '#hdr, #hdr *, .skip, .konz-pata, .konz-pata *, .uroven, .uroven *, .pozadi, .pozadi *, .vzorky, .vzorky *',

    frames: true,
    deconstruct: true,
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

    hud: true,
    hudPosition: 'bottom-left',
    labels: true,
    marquee: true,
    guides: true,
    sparks: true,
    caret: true,

    respectReducedMotion: true
  });

  roj.init();

  /* Ať se na něj dá sáhnout z konzole prohlížeče, když se bude
     ladit. Knihovna si tutéž proměnnou staví jen v režimu
     data-auto, který tu není. */
  window.cursorSwarm = roj;
})();
