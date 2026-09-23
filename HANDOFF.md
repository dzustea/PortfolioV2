# Handoff — stav k 20. 9. 2026 (tmavý technický svět)

**Nic není commitnuté ani pushnuté.** Živý web pořád běží ve staré verzi.

## Kde co je

| | kde |
|---|---|
| Repo (pracovní klon) | `C:\Users\filda\PortfolioV2`, větev `redesign` |
| Poslední commit | `f4f36d2` — verze v4 |
| Rozdělaná práce | v pracovním adresáři repa, **necommitnutá** |
| Nástroje | `nastroje-v6\` (náhled pro sdílení, celostránkový snímek), `nastroje-v5\` (Lighthouse, lokální server, ikony, balíčky) |

## Zahozené verze

1. **Rozvaděč** (průmyslový panel se šrouby, rudá na grafitu).
2. **Modrý prostorový svět** s 3D deskami. Zahozena barva, ne ta sestava:
   3D se na přání vrátilo, jen v rudé.
3. **Rytá vlnovka** jako hlavní motiv. Nahradila ji mřížka a záře.
4. **Prostorová sestava desek** v úvodu. Nahradil ji rýsovaný obraz.

## Aktuální svět

Postaveno podle skillu `design-taste-frontend`, dialy **8 / 6 / 4**
(variance, pohyb, hustota), režim redesign-overhaul.

- **Písmo:** Archivo (proměnné 100 až 900) na všechno čtené, Space Mono na
  drobné popisky. Obojí na vlastní doméně, latin i latin-ext kvůli háčkům,
  staženo skriptem nastroje-v6/pisma.js. Nahradilo Geist a Geist Mono.
- **Barva:** uhlová čerň `#0b0b0c`, kostěná `#f2efe9`, jediná rudá
  `#e0242c` (text `#ef3a3a`). Žádná jiná barva na stránce není.
- **Tvar:** ostré rohy všude. Zaoblení nikde, ani na tlačítkách.
- **Hloubka:** pevné vrstvy pod celou stránkou (mřížka do perspektivy,
  dvě rudé záře, zrno, vinětace). Prostorová sestava desek z úvodu
  zmizela, nahradil ji rýsovaný obraz.
- **Ikony:** Phosphor, tenký řez, vložené jako SVG symboly a odkazované
  přes `use`. Třináct ikon na stránce stojí deset tvarů. Zdroj je
  `nastroje-v5\icons.json`, nic se nestahuje z CDN.
- **Živé prvky:** ukazatel postupu v liště (scroll timeline, bez skriptu),
  linky pod nadpisy a nad údaji se dokreslují, pás technologií jede,
  puntík dostupnosti dýchá. Pozadí nikdy nestojí: druhá záře plave po
  dráze dokola a jednou za osmnáct vteřin přes mřížku přejede světlo.
- **Tlačítka:** při najetí odskočí dvě rohové značky, jaké má vybraný
  prvek v nástrojích vývojáře; při stisku se přitáhnou zpět. Dva
  pseudoprvky, jeden transform. Platí i pro tlačítko v liště a ve
  formuláři. Tři dřívější varianty (prolnutí barvy, vyjíždějící výplň
  s výměnou popisku, dělená buňka s ikonou) byly zamítnuty.
- **Úvod: jméno, jedna věta a malá konzole o dvou sloupcích. Bez obrázku.**
  Vlevo výpis tří voleb, vpravo náhled té vybrané, jako v souborovém
  správci v terminálu: šipka tím dostane okamžitou odezvu, protože se
  vpravo přepíše popis dřív, než člověk stiskne enter. Text náhledu jde
  z atributu data-popis na řádku a vkládá se přes textContent. Kdo si vybrat nechce, jde prostě dál dolů. Sedm dřívějších podob
  úvodu bylo zamítnuto: věta jako nadpis, jméno vedle 3D sestavy, jméno
  přes celou šířku okna s razítkem, štítky s obrázkem, číslovaný pruh jako
  v editoru, list čtyř údajů vedle jména a velký prostorový rozcestník
  s deskami, které vyjížděly dopředu.

- **Opička na liánách.** Ukazatel postupu ve stránce. Visí pod lištou,
  jedna liána je jedna zastávka a opička na ně skáče, jak člověk šipkami
  postupuje. Hrazda ale neměří zastávky, nýbrž místa ve stránce: volby
  v konzoli se nepočítají (rozcestník je nabídka, ne cesta) a celá historie
  projektů je jedno místo, takže opička k ní doskáče, uvnitř ní počká
  a vyrazí zase, až z ní člověk odejde. Do té doby visí na začátku hrazdy.

  Pohyb je ve třech vrstvách, aby si transformace nepřekážely: vnější
  prvek jede do strany, prostřední se pořád houpe a vnitřní dělá skok
  v oblouku i s náklonem a výměnou polohy těla (visící a letící), jako
  sprite ve staré hře. Liány jsou provazy s uzlem a každá se houpe
  o kousek jinak; ta držená je rudá, delší a houpe se víc.

- **Řádky konzole.** U práce, projektů a kontaktu stojí pod odstavcem drobný
  řádek: vlevo příkaz, kterým se ta věc doopravdy dělá (npm run build,
  ls projekty/, git push), vpravo česky, co dělá. Příkaz je ozdoba, proto je
  schovaný čtečce obrazovky; význam vedle něj si přečte každý. Jen u kontaktu
  za příkazem bliká kurzor.

- **Vzkaz v konzoli prohlížeče.** Kdo si otevře nástroje vývojáře, najde
  tam česky psaný pozdrav.

- **Opona: sestavení v terminálu.** První obrazovka je tentýž terminál,
  jaký pak stojí v úvodu, jen přes celé okno. Řádky výpisu přibývají podle
  skutečných událostí (styl a skript, písma, obsah, hotovo) a čísla vedle
  nich nejsou pro efekt: kilobajty bere skript z měření prohlížeče, počet
  projektů z dokumentu a čas z hodin, které běží od prvního bajtu.

  Za oknem se přitom staví svět: s každým hotovým řádkem sílí mřížka
  i rudá záře, tedy totéž pozadí, jaké má pak stránka, takže opona není
  černá plocha, ale rozestavěný web. Okno samo naskočí jako stará
  obrazovka (dvakrát blikne), leží na něm skenovací linky a jednou za
  čas přes ně přejede světlejší pruh.

  Pod výpisem čeká příkaz. Nikdo ho nepíše, dokud člověk nestiskne šipku
  dolů (na telefonu nešvihne prstem); pak se ./start dopíše sám znak po
  znaku, obraz škubne, okno se rozletí přes celou obrazovku a pod ním
  zůstane hotová stránka. Terminál se promění ve web. Zamítnutý byl
  výjezd z tunelu, tedy rudé světlo rostoucí ze středu obrazovky.

- **Za oponou se stránka posouvá jen po zastávkách.** Vlastní posun
  prohlížeče je vypnutý: kolečko, prst, mezerník ani page down s ní
  nehnou. Vede ji šipka nahoru a dolů, enter otevře to, na čem ukazatel
  stojí. Na telefonu, kde žádné šipky nejsou, dělá totéž švihnutí prstem;
  práh je čtyřicet bodů, aby klepnutí nic neposunulo. Zastávek je
  jedenáct (tři volby v úvodu, tři obory, čtyři projekty, kontakt) a jsou
  označené atributem data-stanice, takže přidat další znamená přidat
  atribut. Skok obstará jedno volání scrollTo, plynulost scroll-behavior
  ve stylu; mezi dvěma skoky je krátká uzávěra, aby držená šipka stránku
  nerozjela. Ve formulářových polích patří šipky tomu, kdo píše, a textové
  pole zprávy si posun uvnitř sebe nechává. Odkazy v liště vede tentýž
  skok na první zastávku uvnitř cílové sekce.

- **Kurzor myši je schovaný na celé stránce.** Stránka se ovládá šipkami,
  ukazatel myši by jen mátl. Zároveň je schovaný posuvník, protože nikam
  nevede.

- **Brány mezi úrovněmi.** Místo holé dělicí linky stojí mezi sekcemi
  cedule „Úroveň 2 ze 4, Co pro vás udělám". Cedule projíždí do strany
  podle posunu (view timeline), takže se zastaví, když člověk zastaví.

- **Ukazatel stavu.** Vpravo dole nad zemí, jeden řádek: úroveň, její
  název a věta „Ovládá se šipkami, enter otevře". Úroveň přepisuje týž
  sledovač, který zvýrazňuje odkaz v liště. Na úzké obrazovce zbude
  číslo a název, věta o ovládání se ukáže jen tam, kde klávesnice je.

- **Projekty jako historie, ne seznam.** Vlevo svislá větev s body, jako
  když si vývojář vypíše, co se kdy dodělalo: nahoře rozdělaná práce
  s prázdným bodem na přerušované větvi, pod ní čtyři hotové s plnými
  body. Každý řádek nese jméno souboru projektu (herni-akademie),
  název, k čemu to je, a stav. Ukazatel po historii jenom jezdí; enter
  rozbalí panel, enter podruhé otevře živý web, esc zavře. Panel visí na
  téže větvi a uvnitř je výpis souboru: cat nazev.md, popis a pod ním to,
  co projekt přibyl, řádek po řádku se znaménkem plus. Snímky projektů
  byly zrušeny úplně, takže se při načtení ani při procházení nestahuje
  jediný obrázek. Zamítnuté podoby: obrázkový rejstřík s náhledy
  a výběr úrovně s rohovými značkami a rudým polem pořadí.

- **Kontaktní formulář a hra.** Do formuláře se šipkami psát nedá, proto
  má stránka dva režimy. Enter na zastávce kontaktu (nebo klepnutí do
  pole, nebo tabulátor) přepne stránku do režimu formuláře: šipky patří
  psaní, kolečko a prst zase posouvají a v ukazateli stavu stojí, jak se
  vrátit do hry. Ven vede esc nebo prostě odchod pozornosti z formuláře.
  Kurzor myši je schovaný na celé stránce kromě dvou míst: v kontaktu je
  obyčejný, jinak by do políčka nešlo trefit, a v liště je vlastní, tmavá
  šipka s kostěným obrysem a rudou špičkou, kreslená v SVG rovnou ve
  stylu. Lišta se tím dá ovládat myší jako na každém jiném webu. Pole,
  ve kterém se píše, drží rudou hranu.

- **Výběr vede jen šipka.** Najetí myší do výběru nemluví: když ukazatel
  stál jinde než myš, svítily dvě položky naráz a nebylo poznat, co enter
  otevře. Zvýrazněná je vždy nejvýš jedna zastávka.

- **Ukazatel stavu u paty mizí.** Je to plovoucí lišta v pravém dolním
  rohu a v patě stojí text na stejném místě; na užším okně se přes sebe
  položily. Hlídá to IntersectionObserver na patě.

- **Blikající kurzory zmizely.** Ani v úvodu, ani u kontaktu. Nápovědu
  k ovládání nese opona a potom ukazatel stavu vpravo dole.
- **Sekce:** úvod, práce (nesouměrné dva sloupce se stojícím
  nadpisem), rejstřík projektů, kontakt. Žádné karty, žádné tři stejné
  sloupce vedle sebe, žádné číslované popisky nad každým nadpisem.

## Texty

Psané pro člověka, který weby nedělá. V hlavním textu není „full-stack",
„REST API" ani „CSP"; technologie zůstaly jako drobný řádek pod každým
oborem, aby si je technický čtenář našel. Místo „Lighthouse 100" stojí
v úvodu „Rychlost 100 ze 100 podle Googlu".

## Snímky projektů

Nafoceny znovu, `nastroje-v6/snimky-projektu.js`: stejná šířka okna,
dvojnásobná hustota bodů, jeden formát. Výjimka je Herní akademie, která
dnes návštěvníka pustí jen na přihlašovací formulář; tam zůstal původní
snímek s obsahem, protože prázdné přihlášení jako ukázka práce neřekne nic.

## Projekty bez obrázků

Zavřený řádek je jen sazba, takže je seznam krátký i na telefonu.
Snímek se odkryje až tomu, kdo projeví zájem:

- na počítači se při najetí ukáže **výřez u ukazatele**,
- po otevření řádku **snímek vyjede zpod horní hrany**.

Obrázek se stahuje teprve v tu chvíli. Adresa jde z datového atributu
a skript ji ověřuje regulárním výrazem: povolený je jen prostý název
souboru, nic s lomítkem ani protokolem.

## Naměřeno

| | telefon | počítač |
|---|---|---|
| Lighthouse výkon | **99** | **100** |
| Přístupnost / Zásady / SEO | 100 / 100 / 100 | 100 / 100 / 100 |

Při načtení se nestahuje **ani jeden obrázek**, jen ikona do záložky. Nula chyb v konzoli,
nula porušení obsahové politiky, jeden `h1`, pořadí nadpisů bez přeskoku,
všechny obrázky mají `alt`, **nula pomlček em a en** v celém zdrojáku.

## Odchycené vady

- Prvky, přes které stránka přeskočí (kotva, návrat zpět, švihnutí prstem),
  zůstávaly průhledné napořád: `IntersectionObserver` o nich nedá vědět,
  protože nepřekročí žádný práh. Řeší to doběh po zastavení posunu.
- Na telefonu skákala značka pro otevření do prvního sloupce a vytlačila
  název projektu za okraj. Prvek s určeným řádkem a neurčeným sloupcem se
  v gridu umísťuje dřív než prvky bez určení. Teď má každý prvek řádku
  určený sloupec i řádek.
- `<picture>` s avif i webp vedle sebe stáhlo **oba** soubory naráz,
  takže úspora ve výsledku přidala 45 kB. Zůstal jeden formát, webp.
- Obsah `pattern` a `symbol` dědí barvu z místa, kde je **definovaný**,
  ne odkud se na něj odkazuje. U vzorků to znamenalo vlastní vzorek na
  každý odstín; u ikon to funguje obráceně, protože `use` vytváří stínový
  strom, který dědí z místa odkazu, takže `fill: currentColor` stačí.

## Co zbývá

- **Commitnuto a pushnuto** jako `967ed76` do větve `redesign`
  (github.com/dzustea/PortfolioV2). Do hlavní větve zatím nic nejde.
- **Texty prošly pročištěním.** Ven šla tvrzení, která nejdou doložit:
  server a aplikace v úvodu, weby, které prý někdo denně používá, odpověď
  do jednoho pracovního dne, čtyři weby v provozu i rychlost 100 ze 100.
  Stav u projektů je teď „hotovo", ne „v provozu". Stejně tak zmizelo,
  že si texty půjde měnit samostatně, a technologie pod obory.
- **Dva popisy projektů zůstaly nedotčené**, protože o nich rozhodne jen
  Filip: Vyhlídkář se hlásí jako „web i aplikace do telefonu" a Hrabalová
  jako objednávkový systém. Obojí je tvrzení o jeho vlastní práci.
- **og-image.png je ještě ze starého světa** a nese nápis full-stack
  developer, který na stránce už nikde není.
- **Čtyři soubory *.webp** (bývalé snímky projektů) v repu zůstaly, ale
  nic na ně neodkazuje.
- `DESIGN.md` a `.impeccable/` popisují **zahozený** svět Rozvaděče.
  Neplatí to; buď přepsat, nebo smazat.

## Jak si to pustit

```bash
node "C:\Users\filda\OneDrive\Plocha\portfolio\nastroje-v5\serve.js"
```

Servíruje repo se stejnými hlavičkami, jaké nastaví `vercel.json`.
Port z prostředí, jinak 4173.

## Kontrola vzhledu

Náhled v panelu editoru umí zamrznout: skrytá záložka staví přechody,
takže odhalované prvky zůstanou na snímku průhledné a stránka vypadá
prázdná. Spolehlivý je vlastní Chrome:

```bash
cd nastroje-v6 && NODE_PATH=../nastroje-v5/node_modules node snimek.js 1440 shots/desktop.png
```
