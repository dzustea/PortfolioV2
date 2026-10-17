/* ══ PŘEKLAD STRÁNKY ═══════════════════════════════════════════
   Stránka je psaná česky a čeština je v dokumentu zdrojem pravdy.
   Tenhle soubor umí dokument přepsat do angličtiny a zase zpátky.

   Klíčem slovníku je rovnou ta česká věta, jak stojí v dokumentu,
   ne vymyšlený kód. Značka tím pádem nemusí nosit u každého textu
   atribut navíc: překladač projde textové uzly, podívá se, jestli
   větu zná, a vymění ji. Když se text na stránce změní a ve
   slovníku ne, věta prostě zůstane česky — nikde se neobjeví
   prázdné místo ani klíč.

   Jazyk se bere ze zařízení, ne z IP adresy: kdo má počítač
   v angličtině, dostane angličtinu, i když sedí v Česku. Přesně
   to totiž člověk nastavením jazyka říká. Slovenština dostane
   češtinu, protože si je přečte.

   Volba se nikam neukládá. Stránka o sobě tvrdí, že do prohlížeče
   nic nedává, a kvůli přepínači jazyka s tím nezačne: zvolený
   jazyk si nese adresa (?lang=en), takže přežije i obnovení
   stránky a dá se poslat odkazem.
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SLOVNÍK ────────────────────────────────────────────────
     Vlevo česky tak, jak to stojí v dokumentu, vpravo anglicky.
     Vícero mezer a zalomení se před hledáním srovná na jednu
     mezeru, takže klíč může být vždycky na jednom řádku.

     Jména projektů, lidí a míst se nepřekládají: jsou to jména.
     Desetinná čárka ale ano — anglicky se píše tečka. */
  var EN = {
    /* Opona a lišta */
    'šipkami nahoru a dolů': 'up and down arrows',
    'švihněte nahoru': 'swipe up',
    'Přeskočit na obsah': 'Skip to content',
    'Práce': 'Work',
    'Projekty': 'Projects',
    'Kontakt': 'Contact',
    'Napsat zprávu': 'Send a message',
    'Hlavní': 'Main',

    /* Úvod */
    'Dobrá komunikace, domluvíme se.': 'Good communication, we will work it out.',
    'Dělám weby. Navrhnu je a postavím tak, aby se rychle načetly a dobře četly na telefonu i na počítači.':
      'I build websites. I design and build them to load fast and read well on a phone and on a computer.',
    'nabídka': 'menu',
    'úvod': 'intro',
    'S čím jdete?': 'What brings you here?',
    'Potřebuju nový web': 'I need a new website',
    'napsat zprávu': 'send a message',
    'Mám web a nefunguje': 'My site is broken',
    'Chci jen vidět práci': 'I just want to see the work',
    'rejstřík projektů': 'project index',
    'šipky vybírají': 'arrows select',
    'enter potvrdí': 'enter confirms',
    'klepněte na řádek': 'tap a row',
    'nebo pokračujte dolů': 'or keep going down',
    'odpověď': 'answer',
    'Vyberte šipkami, s čím jdete.': 'Use the arrows to pick what brings you here.',
    'Napíšete mi, co potřebujete, a já web navrhnu a postavím. Od rozvržení a sazby po spuštění.':
      'You tell me what you need and I design and build the site. From layout and typography to launch.',
    'Podívám se, co je s ním špatně, řeknu vám to česky a co půjde, spravím.':
      'I will look at what is wrong, tell you in plain words, and fix what can be fixed.',
    'Šest webů, které jsem postavil, i s tím, co na každém z nich stálo za řeč.':
      'Six sites I have built, each with the part that was worth talking about.',

    /* Ukazatel úrovně */
    'Úroveň': 'Level',
    'ze 4': 'of 4',
    'Úroveň 2 ze 4': 'Level 2 of 4',
    'Úroveň 3 ze 4': 'Level 3 of 4',
    'Úroveň 4 ze 4': 'Level 4 of 4',
    'Ovládá se šipkami, enter otevře': 'Arrows to move, enter to open',

    /* Co dělám */
    'Co pro vás udělám': 'What I will do for you',
    'a zůstanu u toho': 'and stay with it',
    'Nekupujete šablonu. Web vzniká podle toho, co potřebujete, a já na něm dělám od prvního návrhu až po spuštění.':
      'You are not buying a template. The site is built around what you need, and I work on it from the first sketch to launch.',
    'Tady návrh přestane být obrázkem': 'This is where the design stops being a picture',
    'Web na míru,': 'A site built for you,',
    'ne šablona': 'not a template',
    'Rozvržení, sazbu i chování stránky stavím podle toho, co má web říkat. Načte se rychle a čte se stejně dobře na telefonu i na počítači.':
      'I build the layout, the typography and the behaviour around what the site has to say. It loads fast and reads just as well on a phone as on a computer.',
    'Když web': 'When a site',
    'zlobí': 'misbehaves',
    'Máte web a něco na něm nesedí? Podívám se, co s ním je, vysvětlím to bez odborných slov a co půjde, spravím.':
      'Got a site and something is off? I will look at what is wrong, explain it without jargon, and fix what can be fixed.',
    'Spuštění': 'Launch',
    'a co potom': 'and what comes after',
    'Web dostanu online a projdu s vámi, co kde je. Když se pak objeví drobnost k doladění, nezmizím.':
      'I get the site online and walk you through where everything is. When some detail turns up later, I do not disappear.',

    /* Projekty */
    'Hotové weby': 'Finished sites',
    'Projekty k náhledu,': 'Projects to look through,',
    'některé v procesu': 'some still in progress',
    'Šest webů, které jsem postavil, vypsaných jako historie: nahoře rozdělaná práce, pod ní hotové. Enter rozbalí, co je uvnitř, druhý enter web otevře.':
      'Six sites I have built, listed as a history: work in progress on top, finished ones below. Enter opens what is inside, a second enter opens the site.',
    'Žádné sliby, jen hotové věci': 'No promises, only finished work',
    'mapa projektů': 'project map',
    'vyberte uzel': 'pick a node',
    'Mapa projektů': 'Project map',

    /* Stavy a ovládání výpisu */
    'hotovo': 'done',
    'čeká': 'waiting',
    'zamčeno': 'locked',
    'zamčeno, projekt se teprve staví': 'locked, this project is still being built',
    'otevřít web v novém okně': 'open the site in a new window',
    'klepnutím rozbalíte': 'tap to expand',
    'Otevřít web': 'Open site',
    'Právě se staví': 'Being built right now',
    'Sedmý projekt': 'Seventh project',
    'Rozdělaná práce. Až bude co ukázat, objeví se tu.':
      'Work in progress. When there is something to show, it will turn up here.',

    /* Podtitulky projektů */
    'Web pro komunitu': 'A site for a community',
    'Prezentace interpreta': 'Artist showcase',
    'Mapa vyhlídek': 'A map of viewpoints',
    'Prezentační web tvůrce': 'Creator showcase site',
    'Web fantasy kanálu': 'Site for a fantasy channel',
    'Web hudebního producenta': 'Site for a music producer',

    /* Dosah */
    '115K+ IG': '115K+ IG',
    '3,5M SPOTIFY': '3.5M SPOTIFY',
    '115K+ na Instagramu': '115K+ on Instagram',
    '3,5M na Spotify': '3.5M on Spotify',
    'Interpret s komunitou 115k+ na Instagramu': 'An artist with a 115k+ community on Instagram',
    'Tvůrce s komunitou 115k+ na Instagramu': 'A creator with a 115k+ community on Instagram',
    'Prezentace interpreta, interpret s komunitou 115k+ na Instagramu':
      'Artist showcase, an artist with a 115k+ community on Instagram',
    'Prezentační web tvůrce, tvůrce s komunitou 115k+ na Instagramu':
      'Creator showcase site, a creator with a 115k+ community on Instagram',
    'Web hudebního producenta, producent se 3,5 milionu posluchačů měsíčně na Spotify':
      'Site for a music producer, a producer with 3.5 million monthly listeners on Spotify',

    /* Herní akademie */
    'Komunitní web, kde členové plní úkoly, sbírají body a měří se v žebříčku. Je tu chat, profily i administrace, ze které správce řídí obsah z jednoho místa.':
      'A community site where members complete tasks, collect points and compare themselves on a leaderboard. It has a chat, profiles and an admin panel that runs the content from one place.',
    'Uživatelské účty': 'User accounts',
    'Databáze': 'Database',
    'Administrace': 'Admin panel',

    /* Restovski */
    'Web rappera Adama Chlpíka. Koncerty, které se dají filtrovat podle data, diskografie, galerie a obchod. Návštěvník si přepne světlý nebo tmavý vzhled.':
      'A site for rapper Adam Chlpik. Concerts you can filter by date, a discography, a gallery and a shop. Visitors switch between a light and a dark look.',
    'Filtrování koncertů': 'Concert filtering',
    'Galerie': 'Gallery',
    'Světlý i tmavý režim': 'Light and dark mode',

    /* Vyhlídkář */
    'Mapa vyhlídek, laviček a klidných míst v okolí. Lidé sem přidávají vlastní tipy s fotkou a hodnocením. Běží na webu. Mobilní aplikace je hotová nad stejnými daty, jen ji zatím nikde nevydávám.':
      'A map of viewpoints, benches and quiet places nearby. People add their own tips with a photo and a rating. It runs on the web. The mobile app is finished on the same data, I just have not released it anywhere yet.',
    'Mapa a poloha': 'Map and location',
    'Fotky od uživatelů': 'User photos',
    'Aplikace zatím nevydaná': 'App not released yet',

    /* Tady Svačinář */
    'Prezentační web gastro tvůrce Romana Svačiny, kterého na sítích znají jako Tady Svačináře. Poptávky odesílá vlastní skript, ne cizí služba, a web si o návštěvníkovi nic nezjišťuje ani neukládá.':
      'A showcase site for food creator Roman Svacina, known online as Tady Svacinar. Enquiries are sent by my own script, not an outside service, and the site neither learns nor stores anything about its visitors.',
    'Poptávkový formulář': 'Enquiry form',
    'Galerie s náhledem': 'Gallery with preview',
    'Media kit pro značky': 'Media kit for brands',
    'Bez sledování a cookies': 'No tracking, no cookies',
    'hotové, ale zatím nikde nespuštěné': 'finished, but not live anywhere yet',
    'Brzy online.': 'Online soon.',

    /* Loremasters */
    'Web českého fantasy kanálu Koňase. Divák si projde videa i světy, vyhledá heslo v lexikonu a kdo má nápad na další díl, pošle ho rovnou odsud. V sekci o kanálu se otáčí Jeden prsten ve 3D; stahuje se, teprve když k němu člověk dojede.':
      'A site for Konas, a Czech fantasy channel. Viewers go through the videos and the worlds, look an entry up in the lexicon, and anyone with an idea for the next episode sends it straight from here. The One Ring turns in 3D in the section about the channel; it only downloads once you reach it.',
    'Lexikon hesel': 'A lexicon of entries',
    'Nápady od diváků': 'Ideas from viewers',
    'Prsten ve 3D': 'The Ring in 3D',
    'Statický build': 'Static build',

    /* Natte Visstick */
    'Web nizozemského hard technového DJe a producenta. Pořadatel si přes formulář řekne o termín a stáhne si press kit, posluchač najde skladby, sety i mapu, kde se hraje. Celý web mluví čtyřmi jazyky a pohyb v něm jde na sto padesát úderů za minutu, stejně jako hudba.':
      'A site for a Dutch hard techno DJ and producer. Promoters ask for a date through the form and download the press kit, listeners find the tracks, the sets and a map of where he plays. The whole site speaks four languages and everything in it moves at a hundred and fifty beats per minute, same as the music.',
    'Poptávka termínu': 'Booking enquiry',
    'Press kit ke stažení': 'Press kit download',
    'Mapa koncertů': 'Tour map',
    'Čtyři jazyky': 'Four languages',

    /* Kontakt */
    'Napište mi': 'Write to me',
    'Máte nápad?': 'Got an idea?',
    'Pojďme ho postavit.': 'Let us build it.',
    'Stačí pár vět o tom, co potřebujete. Ozvu se, jakmile si zprávu přečtu, a řekneme si, co to obnáší.':
      'A few sentences about what you need is enough. I will get back to you as soon as I read it, and we will talk about what it takes.',
    'Odsud jde práce ven a zpátky ne': 'Work goes out from here and does not come back',
    'Jméno': 'Name',
    'Jan Novák': 'John Smith',
    'jan@firma.cz': 'john@company.com',
    'Mysleli jste': 'Did you mean',
    'Použít': 'Use',
    'Zpráva': 'Message',
    'Co potřebujete postavit?': 'What do you need built?',
    'Odeslat zprávu': 'Send message',
    'Odesláním mi předáte jméno, e-mailovou adresu a text zprávy. Použiju je jen k tomu, abych vám odpověděl.':
      'By sending this you give me your name, e-mail address and the text of the message. I will use them only to write back to you.',
    'Co se s nimi děje': 'What happens to them',

    /* Hlášky formuláře. Skript si je bere přes PREKLAD.t. */
    'Vyplňte prosím všechna pole platnými údaji.': 'Please fill in every field with valid details.',
    'Zkontrolujte adresu, ať odpověď dojde. Odesláním znovu ji potvrdíte.':
      'Check the address so the reply gets through. Sending again confirms it.',
    'Odesílám...': 'Sending...',
    'Zpráva odeslána. Ozvu se co nejdřív.': 'Message sent. I will get back to you as soon as I can.',
    'Odeslání selhalo. Napište prosím přímo na filda.lochman12@gmail.com':
      'Sending failed. Please write to me directly at filda.lochman12@gmail.com',

    /* Patička */
    'Kroměříž a Zlín, CZ': 'Kroměříž and Zlín, CZ',
    'Ochrana osobních údajů': 'Privacy'
  };

  /* Hlava dokumentu. Titulek a popisek nejsou v těle, takže se
     mění zvlášť. */
  var HLAVA = {
    cs: {
      titul: 'Tvorba webů na míru — Filip Lochman, Kroměříž a Zlín',
      popis: 'Webový vývojář z Kroměříže. Postavím web na míru od návrhu po spuštění a opravím i ten, který nefunguje. Psáno ručně, bez šablon. Kroměříž, Zlín i na dálku.'
    },
    en: {
      titul: 'Custom websites — Filip Lochman, Czech Republic',
      popis: 'Web developer from Kroměříž, Czech Republic. I build custom websites from design to launch and fix the ones that are broken. Written by hand, no templates. Remote work welcome.'
    }
  };

  /* Opačný směr se odvodí ze slovníku, aby se nemusel psát dvakrát
     a nemohl se rozejít. */
  var CS = {};
  for (var k in EN) if (Object.prototype.hasOwnProperty.call(EN, k)) CS[EN[k]] = k;

  /* data-co nese podtitulek uzlu mapy. Popisek nad mapou se z něj
     skládá až při výběru, takže stačí přeložit atribut a věta se
     složí rovnou v tom jazyce, který na stránce běží. */
  var ATRIBUTY = ['placeholder', 'aria-label', 'data-popis', 'data-co'];
  var PRESKOCIT = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1 };

  var klic = function (s) { return s.replace(/\s+/g, ' ').trim(); };

  /* ── CO SE DÁ PŘELOŽIT ──────────────────────────────────────
     Textové uzly kromě těch, co leží ve skriptu, ve stylu nebo
     uvnitř kresby. Kresby jsou ikony a mapa, tam žádné věty
     nejsou a sahat do nich by bylo jen riziko. */
  var textoveUzly = function () {
    var chodec = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (uzel) {
        if (!uzel.nodeValue || !uzel.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var rodic = uzel.parentNode;
        while (rodic && rodic !== document.body) {
          if (PRESKOCIT[rodic.nodeName] || rodic.nodeName === 'svg') return NodeFilter.FILTER_REJECT;
          rodic = rodic.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var ven = [], u;
    while ((u = chodec.nextNode())) ven.push(u);
    return ven;
  };

  var jazyk = 'cs';

  var prepnoutNa = function (cil) {
    if (cil === jazyk) return;
    var slovnik = cil === 'en' ? EN : CS;

    textoveUzly().forEach(function (uzel) {
      var puvodni = uzel.nodeValue;
      var jadro = puvodni.trim();
      var novy = slovnik[klic(jadro)];
      if (novy === undefined) return;
      /* Okolní mezery a zalomení zůstanou: drží sazbu v dokumentu. */
      uzel.nodeValue = puvodni.replace(jadro, function () { return novy; });
    });

    ATRIBUTY.forEach(function (jmeno) {
      var prvky = document.querySelectorAll('[' + jmeno + ']');
      Array.prototype.forEach.call(prvky, function (prvek) {
        var novy = slovnik[klic(prvek.getAttribute(jmeno))];
        if (novy !== undefined) prvek.setAttribute(jmeno, novy);
      });
    });

    document.documentElement.lang = cil;
    document.title = HLAVA[cil].titul;
    var popis = document.querySelector('meta[name="description"]');
    if (popis) popis.setAttribute('content', HLAVA[cil].popis);

    jazyk = cil;
    obnovPrepinac();

    /* Adresa nese volbu, aby přežila obnovení stránky a dala se
       poslat odkazem. Do prohlížeče se neukládá nic. */
    try {
      var adresa = new URL(location.href);
      if (cil === 'cs') adresa.searchParams.delete('lang');
      else adresa.searchParams.set('lang', cil);
      history.replaceState(null, '', adresa.pathname + adresa.search + adresa.hash);
    } catch (chyba) { /* stará adresní lišta: volba zůstane jen do odchodu */ }
  };

  /* ── PŘEPÍNAČ ───────────────────────────────────────────────
     Dvě pole vedle sebe, aktivní svítí. Je to přepínač, ne odkaz:
     odkaz by stránku znovu načetl a opona by se odhrnovala podruhé. */

  var prepinac = null;

  var obnovPrepinac = function () {
    if (!prepinac) return;
    Array.prototype.forEach.call(prepinac.querySelectorAll('button'), function (b) {
      var je = b.dataset.jazyk === jazyk;
      b.classList.toggle('je-zvoleny', je);
      b.setAttribute('aria-pressed', je ? 'true' : 'false');
    });
  };

  var postavPrepinac = function () {
    var kam = document.querySelector('.hdr-in');
    if (!kam) return;

    prepinac = document.createElement('div');
    prepinac.className = 'jazyky';
    prepinac.setAttribute('role', 'group');
    prepinac.setAttribute('aria-label', 'Jazyk stránky / Site language');

    ['cs', 'en'].forEach(function (kod) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'jazyk';
      b.dataset.jazyk = kod;
      b.textContent = kod.toUpperCase();
      b.addEventListener('click', function () { prepnoutNa(kod); });
      prepinac.appendChild(b);
    });

    var cta = kam.querySelector('.hdr-cta');
    kam.insertBefore(prepinac, cta);
    obnovPrepinac();
  };

  /* ── ROZHODNUTÍ O JAZYKU ────────────────────────────────────
     Přednost má adresa: kdo dostal odkaz s ?lang=en, má dostat
     angličtinu bez ohledu na to, jak má nastavený počítač.
     Jinak rozhoduje jazyk zařízení. */
  var zvolit = function () {
    var zAdresy = null;
    try { zAdresy = new URL(location.href).searchParams.get('lang'); } catch (chyba) {}
    if (zAdresy === 'cs' || zAdresy === 'en') return zAdresy;

    var zarizeni = (navigator.languages && navigator.languages[0]) || navigator.language || 'cs';
    return /^(cs|sk)/i.test(zarizeni) ? 'cs' : 'en';
  };

  /* Překládá se ještě pod oponou, takže výměnu vět nikdo nevidí. */
  var spustit = function () {
    postavPrepinac();
    prepnoutNa(zvolit());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', spustit, { once: true });
  } else {
    spustit();
  }

  /* Skript stránky si sem chodí pro hlášky, které sám vypisuje. */
  window.PREKLAD = {
    t: function (cesky) {
      if (jazyk === 'cs') return cesky;
      var novy = EN[klic(cesky)];
      return novy === undefined ? cesky : novy;
    },
    jazyk: function () { return jazyk; }
  };
})();
