# Portfolio — bezpečnostní a výkonnostní úpravy

Hotová verze webu je ve složce **`web/`**. Vzhled i chování jsou 1:1 shodné s tím,
co teď běží na `filiplochman.cz` (ověřeno porovnáním pozic, rozměrů, fontů a barev
všech hlavních prvků — všechny hodnoty sedí na pixel, včetně celkové výšky stránky 2533 px).

---

## 1. Náhled odkazu (Instagram / Facebook / WhatsApp / LinkedIn)

**Problém:** stránka neměla žádné Open Graph značky, takže si scraper sám vybral
první velký obrázek na stránce — screenshot projektu Motivo.

**Řešení:** nový `og-image.png` (1200 × 630, logo FL v barvách webu) + kompletní
sada `og:` a `twitter:` značek v `<head>`.

> **Po nasazení je nutné promazat cache Facebooku**, jinak bude Instagram i FB
> pořád zobrazovat starý obrázek (drží si ho i několik týdnů):
> https://developers.facebook.com/tools/debug/ → vložit `https://www.filiplochman.cz/`
> → **Scrape Again**. LinkedIn má vlastní: https://www.linkedin.com/post-inspector/

---

## 2. Bezpečnost

| Co | Předtím | Teď |
|---|---|---|
| Content-Security-Policy | chybí (−25 bodů) | přísná, bez `unsafe-inline` |
| X-Frame-Options / `frame-ancestors` | chybí (−20) | `DENY` / `'none'` |
| X-Content-Type-Options | chybí (−5) | `nosniff` |
| Referrer-Policy | chybí | `strict-origin-when-cross-origin` |
| Permissions-Policy | chybí | kamera, mikrofon, geolokace… vypnuté |
| HSTS | 2 roky | + `includeSubDomains; preload` |
| COOP / CORP / X-Permitted-Cross-Domain-Policies | chybí | nastaveno |
| `target="_blank"` | jen `noopener` | `noopener noreferrer` |

Vše je v novém souboru **`vercel.json`** (musí ležet vedle `index.html`).

Aby mohla platit **přísná CSP bez `unsafe-inline`**, muselo se přesunout to,
co bylo napsané přímo v HTML (na vzhled to nemá vliv):

- `onerror="…"` u tří náhledů projektů → do `script.js` jako `addEventListener('error', …)`
- `style="--d:.1s"` atd. → CSS třídy `.d-06 / .d-10 / .d-12 / .d-18` ve `style.css`
- `style="opacity:.1"` → třída `.pt-arrow-faint`

Navíc opraveno: čtyři různé prvky měly stejné `id="pd-01"` a `aria-controls`
ukazovalo u všech projektů na první panel (neplatné HTML + rozbitá přístupnost).
Teď `pd-01`, `pd-02`, `pd-03`. Sekce jsou obalené v `<main>` (chyběl orientační bod
pro čtečky obrazovky) — na rozvržení to nemá žádný vliv, ověřeno měřením.

Očekávaný výsledek na https://developer.mozilla.org/en-US/observatory: **A+** (dnes C, 50/100).

---

## 3. Výkon

Změřeno Lighthouse 13.4.1 (mobil, Slow 4G) — obě verze na stejném stroji přes stejný
lokální server, takže se porovnávají opravdu jen ty změny:

| | původní | nová |
|---|---|---|
| **Performance** | 74 | **97–98** |
| SEO | 91 | **100** |
| Accessibility | 95 | **96** |
| Best Practices | 100 | 100 |
| First Contentful Paint | 3,0 s | **1,7 s** |
| Largest Contentful Paint | 5,7 s | **2,1 s** |
| Speed Index | 3,0 s | **2,3 s** |
| Cumulative Layout Shift | 0,002 | **0** |
| Přenesená data | 819 kB | **184 kB** |


- **Fonty hostované lokálně** (`web/fonts/`, 8 × woff2, 152 kB) místo Google Fonts CDN.
  Odpadá render-blocking požadavek na cizí doménu (Lighthouse hlásil úsporu ~2 s),
  IP adresy návštěvníků se neposílají Googlu (GDPR) a CSP může být přísnější.
  Jsou to úplně stejné soubory, jaké servíruje Google — písmo vypadá identicky.
  Tři fonty z prvního viewportu se přednačítají přes `<link rel="preload">`.
- **Náhledy projektů do WebP + lazy-loading:** `motivo.png` 265 kB → `motivo.webp` 83 kB,
  `restovski.png` 365 kB → `restovski.webp` 26 kB. Jsou schované v rozbalovacím panelu,
  takže se teď nestahují při načtení stránky vůbec.
- **Cache hlavičky** pro fonty (1 rok, immutable) a obrázky (7 dní).
- **`Link: rel=preload` hlavička** na `/` — prohlížeč začne stahovat `style.css`
  a tři fonty už z HTTP hlaviček, ještě než dorazí a rozparsuje se `<head>`.
- **Odstraněn forced reflow** ve `script.js`: scroll handler teď nejdřív čte layout
  a až potom zapisuje třídy, a běží nejvýš jednou za snímek (`requestAnimationFrame`).
  Chování navigace je stejné.

### Co jsem naopak neudělal a proč

- **Ořezání fontů jen na použité znaky** — vyzkoušeno, ušetřilo jen 19 kB ze 152 kB
  (Google má subsety už dost těsné). Za tu úsporu nestojí riziko, že se po přidání
  nového textu objeví znak, který ve fontu chybí.
- **Vložení CSS přímo do HTML** (ušetřilo by ~160 ms) — vyžadovalo by v CSP hash
  toho bloku a při každé budoucí úpravě stylů by se hash musel přepočítat, jinak by
  se web načetl úplně bez stylů. Nestojí to za to.
- **SRI hash u `script.js`** — Observatory za něj dává bonus, ale při každé úpravě
  skriptu by se musel ručně přepsat, jinak přestane fungovat formulář i rozbalování.

---

## 4. Jak to nasadit (GitHub → Vercel)

Ve svém repozitáři nahraď / přidej:

```
index.html      (změněno)
style.css       (změněno – @font-face nahoře + 5 nových tříd)
script.js       (změněno – fallback obrázků, scroll handler)
vercel.json     (NOVÉ – bezpečnostní a cache hlavičky)
og-image.png    (NOVÉ – náhled pro sociální sítě)
fonts/          (NOVÁ složka – 8 souborů woff2)
motivo.webp     (NOVÉ)  ← smazat motivo.png
restovski.webp  (NOVÉ)  ← smazat restovski.png
robots.txt      (NOVÉ)
sitemap.xml     (NOVÉ)
```

`favicon.svg` a `vyhlidkar.webp` zůstávají beze změny.

Po deployi zkontrolovat:
1. web vypadá stejně a rozbalovací projekty fungují,
2. https://developer.mozilla.org/en-US/observatory → rescan,
3. Facebook debugger → Scrape Again (viz bod 1).

---

## 5. Co ještě řešit mimo web

- **`email.txt` v této složce obsahuje heslo k účtu Formspree v čitelné podobě.**
  Na webu naštěstí nikdy nebyl (ověřeno – vrací 404), ale leží v OneDrive.
  Doporučení: heslo na Formspree změnit a soubor smazat.
- `send.php` + složka `PHPMailer/` jsou zbytek staré verze webu (má natvrdo zapsané
  SMTP údaje a odkazuje na neexistující `vendor/autoload.php`). Na Vercelu se PHP
  stejně nespouští — dá se smazat.
- **Kontrast textu** — jediná věc, která ještě sráží Accessibility (96 místo 100).
  Barva `--t3: #4a5568` má na tmavém pozadí poměr **2,5 : 1**, norma WCAG AA chce 4,5 : 1.
  Týká se odkazů v navigaci, tlačítka „Napsat zprávu" a popisků pod čísly v hero sekci.
  Oprava je na jeden řádek ve `style.css` (`--t3: #707d96` → 4,6 : 1), **ale je to
  viditelná změna** — ta místa by trochu zesvětlala. Neudělal jsem to, protože jsi
  chtěl zachovat vzhled; řekni, jestli to mám změnit.
- Volitelné: skrytá past na roboty (`_gotcha`) do formuláře proti spamu.
  Nenasadil jsem ji, protože prohlížeč umí do skrytého pole občas něco doplnit
  a zpráva by pak tiše zmizela — u kontaktu od firmy to nestojí za riziko.

---

## 6. Oprava lišty na mobilu (safe area)

Ve vestavěných prohlížečích (Instagram, Facebook) se nad fixní lištou prosvítal
scrollující obsah — layout viewport tam začíná až pod stavovým řádkem, ale obsah
se vykresluje i do něj. Řešení:

- `viewport-fit=cover` v meta viewportu → stránka zabírá celou plochu displeje,
- `--sat` / `--sab` z `env(safe-area-inset-*)`; lišta je o `--sat` vyšší a má o tolik
  větší horní padding, takže její pozadí sahá až úplně nahoru, ale logo a odkazy
  zůstávají přesně tam, kde byly,
- `#hero` má o `--sat` větší horní odsazení, `footer` o `--sab` větší spodní,
  `--ph` počítá s výřezem v landscape.

Na zařízeních bez výřezu jsou všechny `env()` nulové → ověřeno měřením, že se
nemění vůbec nic (lišta 0/52 px, logo 17–35 px, stejně jako předtím).
