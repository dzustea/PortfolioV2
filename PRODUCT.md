# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primární návštěvník je **personalista nebo firma, která nabírá vývojáře**
(potvrzeno uživatelem). Přichází z odkazu v životopise, z LinkedInu nebo
z e-mailu, obvykle s krátkou pozorností a s otevřenou další záložkou
s jiným kandidátem. Jeho úkol: během několika desítek vteřin rozhodnout,
jestli má smysl Filipa oslovit.

Sekundárně stránku čte klient, který shání web na míru, ale hierarchie se
podle něj neřídí.

## Product Purpose

Osobní portfolio Filipa Lochmana na **filiplochman.cz**. Má návštěvníkovi
doložit, co Filip umí postavit, a dovést ho k jedinému kroku: napsat
zprávu. Úspěch je odeslaný kontaktní formulář nebo e-mail.

Stav dostupnosti („Otevřen nabídkám") je na stránce záměrně: signalizuje,
že poptávka je vítaná.

## Positioning

Full-stack vývojář, který píše bez frameworků a řeší bezpečnost a výkon
jako součást zadání, ne jako dodatek. Stránka sama je důkaz: statický web
s přísnou obsahovou politikou, vlastními písmy, bez cizích skriptů, se
skóre Lighthouse 100/100/100/100 na počítači.

## Operating Context

Prohlížení převážně na telefonu (odkaz z e-mailu nebo LinkedInu), doplňkově
na počítači. Návštěvník typicky proskenuje úvod, prolétne projekty a buď
odejde, nebo napíše. Do hloubky čte málokdo.

## Capabilities and Constraints

- Statická stránka bez build kroku. HTML, CSS a jeden skript, žádný framework.
- Hostováno na **Vercelu**, repo `dzustea/PortfolioV2`, větev `main`.
  Push do `main` je produkční nasazení.
- **Přísná obsahová politika (CSP):** `script-src 'self'`, `style-src 'self'`,
  `font-src 'self'`, `img-src 'self' data:`. Žádné CDN, žádné vložené
  skripty ani styly, žádná cizí doména kromě Formspree.
- Písma jsou hostovaná na vlastní doméně, aby se IP adresa návštěvníka
  nikam neodesílala.
- Kontaktní formulář odesílá na **Formspree** (`https://formspree.io/f/xnjryend`).
  Web nemá vlastní backend; jiné řešení není v plánu.
- `index.html` se neskládá ručně, vzniká z šablony v `nastroje-v5/`.
- Jazyk stránky je čeština.

## Brand Commitments

- **Rudá na tmavém podkladu** je závazná (potvrzeno uživatelem). Odstín
  a rozsah použití závazné nejsou.
- Značka **FL.** s rudou tečkou.
- Doména a název: Filip Lochman, filiplochman.cz.
- Čeština a tón textů závazné **nejsou**; kopie se smí upravit.

## Evidence on Hand

Čtyři nasazené projekty se screenshoty (screenshoty jsou závazné,
potvrzeno uživatelem):

- **Herní akademie** (Motivo) — PHP, MySQL, JS — `motivo.free.nf`
- **Restovski Webový Koncept** — HTML, Tailwind, JS — `restovski.vercel.app`
- **Vyhlídkář web/app** — Next.js, TypeScript, PostGIS — `vyhlidkar.vercel.app`
- **Kadeřnictví Hrabalová** (Denisa Hair) — PHP, TiDB Cloud, Resend API —
  `denisa-hair.vercel.app`

Pátý projekt je rozdělaný, bez odkazu i názvu.

Ilustrace `art-stack.webp` (izometrické schéma vrstev aplikace) je vlastní.

**Co neexistuje a nesmí se vymyslet:** žádné reference od zákazníků, žádná
čísla o návštěvnosti nebo obratu, žádné ceny, žádní jmenovaní klienti,
žádné certifikace. Údaj „20 let" je věk, ne praxe.

## Product Principles

1. **Rozhodnutí padne do půl minuty.** Co personalista potřebuje k oslovení,
   musí být nad přehybem nebo na jedno posunutí.
2. **Stránka je portfolio i vzorek práce.** Když je pomalá, nepřístupná nebo
   se rozpadne na telefonu, popírá sama sebe.
3. **Telefon je hlavní zařízení, ne odvozenina.** Návrh začíná u úzké
   obrazovky.
4. **Nic se nevymýšlí.** Chybějící důkaz se nenahradí smyšleným.
5. **Přidání projektu je jedna změna v šabloně,** ne přestavba stránky.

## Accessibility & Inclusion

Cílem je WCAG AA na text i ovládací prvky, plná ovladatelnost klávesnicí,
viditelné zaostření a funkční `prefers-reduced-motion`. Ověřuje se
Lighthouse a vlastními kontrolami v `nastroje-v5/check-v5.js`.
