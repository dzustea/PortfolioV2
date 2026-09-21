---
name: Filip Lochman · Rozvaděč
description: Čelní panel stroje: eloxovaný grafit, gravírovaný štítek a jediná doutnavka.
colors:
  sasi: "#0c0b0d"
  deska: "#17161a"
  deska-2: "#1e1d22"
  jamka: "#080709"
  ryt: "#e4dfd4"
  ryt-2: "#a8a49b"
  ryt-3: "#8d8982"
  zar: "#ff2d3f"
  zar-vypln: "#b8091a"
  zar-jadro: "#ff8a7e"
  zar-tlum: "rgba(255,45,63,.14)"
  spara: "rgba(255,255,255,.07)"
  spara-2: "rgba(255,255,255,.14)"
  rez: "rgba(0,0,0,.85)"
  hrana: "rgba(255,255,255,.07)"
typography:
  display:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.5rem, 6.6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    textTransform: "uppercase"
  headline:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.2rem, 1.9vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "normal"
  body-tlumeny:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.2em"
    textTransform: "uppercase"
  hodnota:
    fontFamily: "Saira, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.92rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.01em"
    fontVariant: "tabular-nums"
rounded:
  deska: "14px"
  ovl: "8px"
  kulat: "999px"
spacing:
  spara: "2px"
  pad: "clamp(18px, 4.2vw, 56px)"
  sec: "clamp(72px, 8.5vw, 136px)"
  nav: "64px"
  wrap: "1180px"
components:
  btn:
    backgroundColor: "linear-gradient(180deg,#26252c,#191820)"
    textColor: "{colors.ryt}"
    rounded: "{rounded.ovl}"
    padding: "14px 24px"
    typography: "{typography.body}"
  btn-hover:
    textColor: "#ffffff"
  btn-sm:
    padding: "9px 16px"
  btn-wide:
    width: "100%"
    padding: "15px 24px"
  btn-ghost:
    textColor: "{colors.ryt-2}"
    rounded: "{rounded.ovl}"
    padding: "14px 22px"
  btn-ghost-hover:
    textColor: "{colors.ryt}"
  btn-plate:
    backgroundColor: "linear-gradient(180deg,#232229,#17161c)"
    textColor: "{colors.ryt}"
    rounded: "{rounded.ovl}"
    padding: "10px 16px"
  doutnavka:
    backgroundColor: "rgba(255,45,63,.05)"
    textColor: "{colors.ryt}"
    rounded: "{rounded.kulat}"
    padding: "9px 18px 9px 13px"
    typography: "{typography.label}"
  pole:
    backgroundColor: "{colors.jamka}"
    textColor: "{colors.ryt}"
    rounded: "{rounded.ovl}"
    padding: "13px 15px"
  deska:
    backgroundColor: "{colors.deska}"
    rounded: "{rounded.deska}"
    padding: "clamp(30px,4.4vw,60px) clamp(24px,3.6vw,52px)"
  modul:
    backgroundColor: "linear-gradient(170deg,#1e1d22,#17161a 76%)"
    rounded: "{rounded.deska}"
    padding: "clamp(22px,2.4vw,30px)"
  stitek-chip:
    textColor: "{colors.ryt-3}"
    rounded: "{rounded.kulat}"
    padding: "4px 10px"
    typography: "{typography.label}"
---

# Design System: Filip Lochman · Rozvaděč

## Overview

**Creative North Star: "Rozvaděč"**

Stránka je čelní panel stroje. Není to tmavé portfolio s přechodem, velkým
jménem a mřížkou dlaždic; je to deska, na kterou se šroubují štítky a do které
jsou zapuštěná pole a tlačítka. Kdo přijde, čte hodnoty ze štítku, ne
přídavná jména. Panel má být poznatelný i bez obsahu: podle brusu eloxu,
šroubů v rozích, vlasových spár a jediné rudé kontrolky.

Materiály jsou tři a každý má jednu práci. **Eloxovaný grafit s jemným
brusem** je jediná plocha. **Gravírovaný laminátový štítek** — světlé písmo
vyříznuté do tmavé desky — je jediný nosič textu; hloubku bere z řezu, ne ze
záře. **Doutnavka za sklem** je jediná rudá. Žádný čtvrtý materiál se
nepřidává; když je potřeba nová věc, udělá se z těchto tří.

Hustota je klidná: velké svislé rozestupy mezi sekcemi, těsné řádky uvnitř
štítků. Tmavý režim není volba uživatele, je to jediný režim — `color-scheme:dark`
je zamčené a světlá varianta neexistuje. Celá stránka je vanilla HTML, CSS
a jeden skript; nic se nenačítá z cizí domény.

**Key Characteristics:**
- Tři materiály, žádný čtvrtý: brus, gravírování, doutnavka.
- Jediné písmo (Saira 300–800), rozdíly dělá řez, prostrkání a verzálky.
- Rudá je stav, nikdy běžný text.
- Hloubka z řezu a spáry, ne z vržených stínů karet.
- Jediný autorský pohyb: stohování modulů přes `position:sticky`.
- Tmavý režim zamčený; světlé téma neexistuje.

## Colors

Paleta je jedna tmavá kovová řada, jedna teplá slonovina na text a jedna
rudá, která svítí jen tam, kde něco hlásí stav.

### Primary
- **Doutnavka** (`{colors.zar}`): světlo kontrolky. Jádro doutnavky, podtržení
  aktivní sekce v liště, rozsvícený rámeček ovladače, chybová hláška
  formuláře, odrážky ve výpisu, proužek loaderu. Na běžný text nikdy.
- **Doutnavka, výplň** (`{colors.zar-vypln}`): tmavší rudá pro plochy, na
  kterých leží bílý text — přeskakovací odkaz a označení textu.
- **Žhavé jádro** (`{colors.zar-jadro}`): nejsvětlejší bod uvnitř kontrolky,
  jen jako první zastávka jejího radiálního přechodu.

### Neutral — kov
- **Šasi** (`{colors.sasi}`): nejhlubší plocha, pozadí stránky a barva okolo
  všech desek.
- **Čelní deska** (`{colors.deska}`): plocha, na které stránka stojí — úvodní
  deska, moduly, základ přechodů.
- **Vyvýšená deska** (`{colors.deska-2}`): horní konec přechodů u modulů,
  typového štítku, formuláře a dialogu; o stupeň blíž ke světlu.
- **Jamka** (`{colors.jamka}`): zapuštěná prohlubeň — pozadí vstupních polí
  a dráha posuvníku.

### Neutral — gravírování
- **Rytina** (`{colors.ryt}`): hlavní text a nadpisy, teplá slonovina jádra
  laminátu, ne bílá. Kontrast 15,2 : 1 proti šasi.
- **Rytina, druhý stupeň** (`{colors.ryt-2}`): odstavce, popisky v liště,
  štítky technologií. 7,0 : 1.
- **Rytina, třetí stupeň** (`{colors.ryt-3}`): gravírované popisky verzálkami,
  názvy řádků typového štítku, patička. 4,8 : 1 i na vyvýšené desce — je to
  spodní mez, níž se nejde.

### Neutral — spáry a hrany
- **Spára** (`{colors.spara}`) a **spára, silnější** (`{colors.spara-2}`):
  vlasová čára mezi moduly a obrys desek. Kreslí se vnitřním stínem
  `inset 0 0 0 1px`, ne vlastností `border`.
- **Řez** (`{colors.rez}`) a **hrana** (`{colors.hrana}`): stín nad tahem
  písma a odlesk pod ním. Z téhle dvojice bere gravírování hloubku.

### Named Rules
**Pravidlo jedné doutnavky.** Na jedné obrazovce svítí v klidu jedna jediná
věc: východ ze stránky. Dokud je vidět úvod, tlačítko v liště zůstává klidnou
deskou; teprve když úvod zmizí, přebírá světlo ono (třída `uvod-pryc`).

**Pravidlo rudé jako stavu.** Rudá hlásí stav nebo to, co právě reaguje:
aktivní sekce, najetí, zaostření, chyba, dostupnost. Nikdy není barvou textu,
nadpisu ani dekorativní plochy.

**Pravidlo kovu.** Barvy jsou pojmenované po materiálu, ne po roli
(`--deska`, `--jamka`, `--ryt-2`). Nová barva se přidává jen tehdy, když
vznikne nový materiál — a nový materiál nevzniká.

## Typography

**Jediné písmo:** Saira, proměnný řez 300–800, vlastní hosting, dvě podmnožiny
(latin, latin-ext), obě přednačtené. Záloha `system-ui, -apple-system,
'Segoe UI', sans-serif`.

**Character:** Hranaté dříky a krátké výběhy jsou písmo přístrojových štítků,
ne webová klasika. Nese displej, text i číslice. Druhá rodina — a zvlášť
monospace — na panelu není a nebude; rozdíl mezi rolemi dělá řez, prostrkání
a verzálky.

### Hierarchy
- **Display** (800, `clamp(2.5rem,6.6vw,5rem)`, řádkování 0.95, prostrkání
  -0.035em, verzálky): jméno na gravírovaném názevníku. Jediný výskyt na
  stránce, zalomený do dvou řádků.
- **Headline** (700, `clamp(1.7rem,3.2vw,2.5rem)`, 1.1): nadpisy sekcí.
  Stojí samy, bez popisku nad sebou.
- **Title** (700, `clamp(1.2rem,1.9vw,1.5rem)`): názvy modulů a projektových
  jednotek.
- **Body** (400, 16px, 1.58): běžný text. Odstavce se drží mezi 34 a 64 ch
  podle místa — úvodní text 46ch, popis modulu 42ch, popis jednotky 64ch,
  kontaktní úvod 34ch.
- **Label** (600, 0.72rem, prostrkání 0.2em, verzálky): gravírované popisky —
  hlava typového štítku (0.24em), doutnavka (0.15em), označení projektu
  (0.18em), proužek s profesí (0.22em), patička (0.14em).
- **Hodnota** (700, 0.92rem, `tabular-nums`): pravý sloupec typového štítku.
  Číslice se musí srovnat pod sebe.

### Named Rules
**Pravidlo gravírování.** Každý text, který má působit vyříznutě do desky,
nese `text-shadow:0 -1px 0 var(--rez), 0 1px 0 var(--hrana)`: stín řezu nad
tahem, odlesk hrany pod ním. Platí pro značku, nadpisy, názvy modulů a pás
technologií. Text nikdy nesvítí sám od sebe.

**Pravidlo jednoho písma.** Nepřidává se druhá rodina ani na kód, ani na
číslice. Když je potřeba „technický" dojem, použije se prostrkání a verzálky.

**Pravidlo štítku bez hrdiny.** Hodnoty na typovém štítku mají všechny stejnou
velikost. Žádné jedno velké číslo; je to výrobní štítek, ne dashboard.

## Layout

Obsah drží jeden střed: `--wrap` 1180px, vnitřní okraj `--ph` = větší
z `--pad` (`clamp(18px,4.2vw,56px)`) a bezpečných zón displeje. Svislý rytmus
sekcí je `--sec` (`clamp(72px,8.5vw,136px)`), pod 560px se stáhne na
`clamp(58px,12vw,88px)`. Lišta je pevná, vysoká `--nav` 64px (58px pod 560px),
a všechny kotvy mají `scroll-margin-top: calc(var(--nav) + 18px)`.

Úvodní deska je mřížka 1.2fr / 0.8fr: vlevo gravírovaný názevník se jménem,
text a akce, vpravo typový štítek a pod ním doutnavka. Zaměření jsou dva
moduly vedle sebe a pod nimi pás devíti gravírovaných popisků technologií.
Projekty jsou svislý rám, kontakt je 0.85fr / 1.15fr — vlevo řádky kontaktu,
vpravo formulář.

Dva zlomy a oba mají důvod:
- **900px** — popisky v liště se sbalí pod tlačítko nabídky, úvodní deska
  a kontakt jdou pod sebe, snímek projektu z jednotky mizí. Nad 900px se
  jednotka přepíná do mřížky s pojmenovanými oblastmi (`hlava / popis / tech
  / akce` vlevo, `okno` vpravo).
- **560px** — moduly do jednoho sloupce, akce na celou šířku, řádky kontaktu
  se přeskládají do dvou řádků. Pod 400px dostane každé tlačítko v úvodu
  vlastní řádek.

### Named Rules
**Pravidlo vlasové spáry.** Sousední moduly v rámu dělí 2px spára, ne mezera.
Odstup patří mezi sekce, ne mezi díly jedné sestavy.

**Pravidlo bezpečné zóny.** Vnitřní okraje a pevné prvky počítají
s `env(safe-area-inset-*)`. Na telefonu s výřezem nesmí nic vjet pod hranu.

## Elevation & Depth

Systém nemá vržené stíny pod kartami. Hloubka vzniká třemi způsoby: **řezem**
(tmavá čára nad tahem, světlá pod ním), **spárou** (`inset 0 0 0 1px` místo
rámečku) a **zapuštěním** (vnitřní stín shora, který dělá z plochy jamku).
Vnější stín se používá jen dvakrát, a pokaždé jako ukotvení desky ke stěně,
ne jako zvednutí: pod úvodní deskou a pod formulářem, v obou případech
s velkým záporným rozostřením, takže je vidět jen jako ztmavení pod hranou.
Jediný zdroj světla v místnosti je shora — `body::before` drží slabý radiální
přechod ukotvený nad panelem.

### Shadow Vocabulary
- **Hrana desky** (`inset 0 1px 0 rgba(255,255,255,.085), inset 0 -1px 0 rgba(0,0,0,.6), inset 0 0 0 1px var(--spara)`):
  každá deska a modul. Světlo na horní hraně, tma na spodní, spára kolem.
- **Ukotvení** (`0 40px 70px -50px rgba(0,0,0,1)`): pod úvodní deskou;
  u formuláře slabší (`0 24px 46px -34px`).
- **Jamka** (`inset 0 2px 5px rgba(0,0,0,.75), inset 0 0 0 1px var(--spara)`):
  vstupní pole a gravírovaný názevník.
- **Zapuštěná deska ovladače** (`inset 0 1px 0 rgba(255,255,255,.1), inset 0 0 0 1px var(--spara-2), 0 2px 5px rgba(0,0,0,.6)`):
  klidové tlačítko.
- **Svit doutnavky** (`inset 0 0 0 1px rgba(255,45,63,.85), inset 0 0 14px rgba(255,45,63,.2), 0 3px 14px -4px rgba(255,45,63,.45)`):
  rozsvícený rámeček při najetí a zaostření. Světlo je v rámečku, ne v ploše.
- **Hřbet modulu** (`0 -14px 28px -20px rgba(0,0,0,1)`): stín nahoru pod
  zasunutou jednotkou, aby se pod ní dalo číst, že něco překrývá.

### Named Rules
**Pravidlo rozsvíceného rámečku.** Reakce na najetí je rámeček, ne přelití
plochy barvou. Tlačítko se při stisku zamáčkne (`translate:0 1px` plus vnitřní
stín) — je to cvaknutí spínače.

**Pravidlo světla shora.** Všechny vnitřní odlesky jsou na horní hraně,
všechny řezy na spodní. Obrácený odlesk čte oko jako chybu odlitku.

## Shapes

Zaoblení jsou přesně tři a žádné jiné: **14px** (`--r-deska`) pro desky,
moduly, formulář, dialog a pás; **8px** (`--r-ovl`) pro ovládací prvky, pole,
zapuštěný názevník a okno se snímkem; **999px** (`--r-kulat`) pro doutnavku,
drobné štítky, hřbet modulu a proužek loaderu. Mezistupeň se nevymýšlí.

Obrys je vždycky vnitřní stín o síle 1px, ne `border` — hrana tak patří desce,
ne rámečku kolem ní. Kruhové geometrie jsou dvě: **šroub** (11px, radiální
přechod, zapuštěná hrana a drážka pootočená o 38°) v rozích úvodní desky,
a **nýt** (9px) v horních rozích typového štítku a formuláře. Kreslí se
v CSS, nikdy jako obrázek.

Textura eloxu je jedna a jmenuje se `.brus`: svislý opakovaný přechod s
periodou 5px. Nosí ji jedna plocha na stránce — úvodní deska. Je to povrch
materiálu, ne dekorace, a proto se neopakuje na každém modulu.

## Components

### Buttons
- **Tvar:** zaoblení ovladače (8px), vždy vnitřní obrys, nikdy `border`.
- **Zapuštěná deska (`.btn`):** přechod `#26252c → #191820`, text rytina,
  odsazení 14px/24px. Varianty: `.btn-sm` (9px/16px), `.btn-wide` (plná šířka).
  Šipka uvnitř se při najetí posune o 4px doprava.
- **Najetí a zaostření:** rámeček se rozsvítí doutnavkou, text zbělá.
  Stisk zamáčkne o 1px. Zakázané tlačítko ztratí reakci a dostane
  `cursor:progress`.
- **Duchový (`.btn-ghost`):** samotný gravírovaný rámeček bez desky, text
  druhý stupeň rytiny. Druhá akce, nikdy první.
- **Deskový (`.btn-plate`):** menší a plošší varianta pro akci uvnitř modulu.
- **Svítící (`.btn-lampa`):** modifikátor, který nese doutnavku i v klidu.
  Patří jedinému východu ze stránky — akci „napsat zprávu". V liště se
  potlačí, dokud je vidět úvod.
- **Odkaz (`.lnk`):** text v barvě doutnavky, podtržení vyjede zleva
  (`scale:0 1 → 1 1`), šipka se posune doprava nahoru.

### Doutnavka (signature)
Kontrolka za sklem: 8px jádro s radiálním přechodem
(`--zar-jadro → --zar → #8c0d19`), bloom `0 0 9px 1px` kolem něj a skleněný
kroužek `inset 0 0 0 1px rgba(255,255,255,.25)`. Sedí v pilulce s velmi
slabou rudou výplní a gravírovaným popiskem verzálkami. Svítí klidně —
neblikat; blikání nesděluje nic navíc.

### Typový štítek (signature)
Deska s nýty v horních rozích, centrovanou hlavou verzálkami a definičním
seznamem: vlevo název řádku (0.82rem, třetí stupeň rytiny), vpravo hodnota
(0.92rem, 700, `tabular-nums`). Řádky dělí velmi slabá čára
(`rgba(255,255,255,.04)`). Pod nimi řádek původu, který říká, odkud se hodnoty
berou. Všechny hodnoty mají stejnou velikost.

### Jednotka projektu (signature)
Modul v rámu. Na levé hraně **hřbet** — 3px svislý úchyt, podle kterého se
pozná, že jednotka je zasunutá a ne položená. Nad 900px mřížka s oknem snímku
vpravo (zapuštěné do desky, poměr 16/10.4, krytí 0.92 → 1 při najetí). Hlava
nese název a označení v drobném štítku, pod ní popis, vodorovný seznam
technologií a akce: detail (otevře nativní `<dialog>`) plus odkaz na živý web.

Jednotky se při scrollu zasouvají pod lištu a stohují se: `position:sticky`
s postupně rostoucím `top` (14 / 26 / 38 / 50px pod lištou), takže pod každou
je vidět hřbet té předchozí. Drží to jediná vlastnost, žádný posluchač scrollu.
Při najetí na rám ostatní jednotky ztmavnou na krytí 0.52 a držená zůstane
plná — jen tam, kde `hover:hover` skutečně existuje.

### Cards / Containers
- **Zaoblení:** 14px.
- **Pozadí:** přechod z vyvýšené desky do čelní (`170deg` u modulů, `168deg`
  u formuláře, štítku a dialogu).
- **Stín:** viz Elevation — hrana desky, vnější jen u úvodní desky a formuláře.
- **Obrys:** vnitřní spára.
- **Vnitřní odsazení:** `clamp(22px,2.4vw,30px)` u modulů,
  `clamp(30px,4.4vw,60px) clamp(24px,3.6vw,52px)` u úvodní desky.

### Inputs / Fields
- **Styl:** pole je jamka — pozadí `--jamka`, vnitřní stín shora, žádný
  `border`. Popisek nad polem je gravírovaný verzálkami (0.72rem, 0.2em).
- **Najetí:** spára zesílí na `--spara-2`.
- **Zaostření:** okraj se rozsvítí doutnavkou a přibude slabá rudá aureola
  `0 0 0 3px rgba(255,45,63,.13)`. Stejné cvaknutí jako u tlačítka.
- **Chyba:** třída na skupině rozsvítí okraj pole a odkryje hlášku v barvě
  doutnavky s malou rudou tečkou před textem. Hlášky jsou věty, ne kódy.
- **Odezva formuláře:** jeden živý řádek pod tlačítkem (`role="status"`),
  neutrální / rytina při úspěchu / doutnavka při chybě.

### Navigation
Pevná lišta je v klidu průhledná; jakmile projde sentinel na začátku stránky,
dostane `rgba(12,11,13,.86)` a rozostření pozadí. Vlevo značka `FL.` s rudou
tečkou, uprostřed popisky sekcí (0.92rem, druhý stupeň rytiny), vpravo východ
a pod 900px tlačítko nabídky. Aktivní sekci drží **doutnavka pod popiskem** —
2px rudá čárka se svitem — ne posuvná pilulka. Mobilní panel je plocha přes
šířku s řádky 1.22rem oddělenými spárou; řádek se při najetí posune o 7px
doprava a zčervená.

### Dialog
Nativní `<dialog>`: šířka `min(92vw,680px)`, deska se zaoblením 14px, pozadí
za ním ztmavne a rozostří. Nahoře snímek projektu (16/9.4), pak název, popis,
úplný seznam technologií a tlačítko na živý web. Zavírací křížek je 38px
zapuštěný ovladač v rohu. Otevírá se krátkým `dlgIn` (0.3s, posun 12px,
měřítko 0.985) — a jen pokud návštěvník pohyb neomezil.

### Named Rules
**Pravidlo jediného východu.** Na stránce je jedna akce, která smí svítit:
napsat zprávu. Všechno ostatní je klidná deska.

**Pravidlo kreslené geometrie.** Šrouby, nýty, doutnavka, šipky — všechno
vzniká v CSS a v inline SVG s `currentColor`. Žádná ikona z fontu, žádné cizí
logo, žádný obrázek místo tvaru.

## Do's and Don'ts

### Do:
- **Do** stavět novou plochu ze tří materiálů, které už existují: brus,
  gravírování, doutnavka.
- **Do** používat přesně tři zaoblení — 14px deska, 8px ovladač, 999px
  kontrolka a drobný štítek.
- **Do** kreslit obrysy vnitřním stínem `inset 0 0 0 1px var(--spara)`, ne
  vlastností `border`.
- **Do** dávat gravírovaným textům dvojici `text-shadow` řez + hrana.
- **Do** nechat rudou jen stavu: aktivní sekce, najetí, zaostření, chyba,
  dostupnost.
- **Do** psát pohyb na křivky `--out` (`cubic-bezier(.16,1,.3,1)`) a `--mech`
  (`cubic-bezier(.3,.9,.2,1)`) — exponenciální doběh, nikde `ease-in`.
- **Do** sledovat pozici pomocí `IntersectionObserver`; posluchač scrollu
  se na téhle stránce nepoužívá vůbec.
- **Do** vázat stavy najetí na `@media (hover:hover)` a nabízet u každého
  z nich odpovídající chování pro zaostření z klávesnice.
- **Do** držet `prefers-reduced-motion`: jednotky přejdou na `position:static`,
  animace se zkrátí na nulu, loader zmizí.
- **Do** držet nejnižší stupeň rytiny na `--ryt-3`; níž se s kontrastem nejde.

### Don't:
- **Don't** přidávat druhou rodinu písma, zvlášť ne monospace. Saira nese
  displej, text i číslice.
- **Don't** zavádět světlé téma ani přepínač; tmavý režim je zamčený.
- **Don't** svítit dvěma věcmi na jedné obrazovce. Východ v liště zůstává
  klidný, dokud je vidět ten v úvodu.
- **Don't** psát rudou běžný text ani nadpis.
- **Don't** přelévat tlačítko barvou při najetí. Rozsvítí se rámeček.
- **Don't** používat vržené stíny jako zvednutí karty; hloubka je z řezu,
  spáry a zapuštění.
- **Don't** vkládat cizí loga ani ikonové fonty. Technologie jsou gravírované
  popisky, ikony jsou inline SVG s `currentColor`.
- **Don't** nechávat sekce naskakovat při scrollu. Jediný autorský okamžik
  pohybu je stohování jednotek; obsah je vidět od začátku.
- **Don't** zavádět čtvrté zaoblení nebo mezistupeň mezi 8px a 14px.
- **Don't** pojmenovávat novou barvu podle role. Token se jmenuje po
  materiálu.
- **Don't** nechat doutnavku blikat nebo pulzovat.
