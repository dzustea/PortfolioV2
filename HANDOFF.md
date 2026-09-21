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
- **Úvod:** sazba vlevo (štítky, pozdrav, jméno, věta, dvě tlačítka),
  rýsovaný obraz vpravo v rámu. Předchozí podoby úvodu: věta jako nadpis,
  jméno vedle 3D sestavy, jméno přes celou šířku okna s razítkem. Všechny
  zamítnuty.
- **Obraz v úvodu** je rozložený drátěný model webové stránky ve třech
  patrech: nahoře rozvržení, které návštěvník vidí, uprostřed konstrukce
  bloků, dole tabulka dat. Rudá linka vede od zvýrazněné karty dolů
  k řádku, ze kterého karta čerpá. Vzniká v nastroje-v6/kresba.js
  a váží **2 kB**. Předchozí pokus, vlnová plocha, byl zamítnut.
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

Při načtení se nestahuje ani jeden snímek projektu. Nula chyb v konzoli,
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

- **Nic není commitnuté ani nasazené.**
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
