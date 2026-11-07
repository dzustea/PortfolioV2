# filiplochman.cz

Portfolio Filipa Lochmana: weby na míru, Kroměříž a Zlín.
Čisté HTML, CSS a JavaScript bez frameworku a bez buildu. Co je
v repu, to se nasadí.

Nasazení: každý push do větve `main` na GitHubu nasadí Vercel sám.

## Složky

```
PortfolioV2/
├── index.html            hlavní stránka
├── soukromi.html         zásady soukromí
│
├── css/
│   └── style.css         veškerý vzhled webu (souřadnice mapy na konci
│                         souboru zapisuje generátor, viz níž)
├── js/
│   ├── preklad.js        čeština → angličtina, přepínač CS / EN
│   ├── script.js         chování stránky: nabídka, mapa, karty projektů,
│   │                     náhledová videa, formulář
│   └── roj.js            nastavení animace kurzorů (jen počítač)
├── vendor/
│   └── cursor-swarm/     cizí knihovna animace kurzorů (licence MIT)
│
├── fonts/                písma Archivo, JetBrains Mono a Chakra Petch
│                         (SIL Open Font License)
├── images/
│   ├── og-image.png      obrázek pro sdílení odkazu na sítích
│   └── icons/            ikony aplikace (manifest)
├── projects/             náhledy projektů: video (.mp4) a plakát (.webp)
│                         pro každý web v seznamu projektů
│
├── tools/
│   └── nahraj-nahledy.mjs  nahraje videa do projects/ (viz níž)
├── archive/              staré obrázky, které web už nepoužívá.
│                         Nemažou se, ale nenasazují (.vercelignore).
│
├── favicon.ico, favicon.svg, apple-touch-icon.png,
├── site.webmanifest, robots.txt, sitemap.xml
│                         musí zůstat v kořeni, prohlížeče a vyhledávače
│                         je hledají přesně tam
├── vercel.json           bezpečnostní hlavičky (CSP), mezipaměť,
│                         přesměrování
├── .vercelignore         co se nenasazuje
└── .gitignore
```

## Časté úpravy

**Text na webu.** Texty jsou v `index.html` česky. Anglický překlad
je v `js/preklad.js`: slovník, kde klíč je přesně česká věta. Když
se změní česká věta, musí se změnit i její klíč ve slovníku, jinak
zůstane v angličtině česky.

**Nový projekt.** Řádek v seznamu projektů v `index.html` (stačí
zkopírovat existující `<li class="polozka">`), překlady jeho textů
do `js/preklad.js`, uzel do mapy (generátor níž) a náhled do
`projects/`.

**Náhledová videa.** Poprvé `cd tools && npm install`, pak `node tools/nahraj-nahledy.mjs` nahraje všechny
weby znovu, `node tools/nahraj-nahledy.mjs natte` jen jeden. Potřebuje
Node 22+ a nainstalovaný Google Chrome. Videa mají 60 fps a 960 × 540. Video se na webu stahuje, až
když má hrát, takže nezpomaluje načtení stránky.

**Mapa projektů.** Strom projektů na počítači vyrábí generátor
`nastroje-v6/mapa.js` v pracovní složce portfolia (mimo tohle repo).
Zapisuje značky do `index.html` a souřadnice na konec `css/style.css`.

## Bezpečnost

Stránka má přísnou Content Security Policy (`vercel.json`): skripty,
styly, písma, obrázky i videa jen z vlastní domény, žádné vložené
skripty ani styly v atributech. Nový soubor proto musí ležet v repu,
ne na cizím serveru, a styl patří do `css/style.css`, ne do atributu
`style`.
