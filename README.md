# ČT Sport - Automatizační testy (Playwright + TypeScript)

## Úvod

Tento projekt obsahuje automatizované UI testy pro web ČT Sport (https://sport.ceskatelevize.cz/), připravené pomocí Playwright a TypeScript.

## Technologický stack

- Playwright 1.53.2
- TypeScript 5.8.3
- Node.js 18.18.0

“Projekt byl vyvinut a testován na Node.js v18.18.0, ale měl by fungovat i na vyšších verzích (např. Node 20/22). Pokud by byly potíže se spuštěním, dejte mi prosím vědět.”

## Volba rubriky Cyklistika

V horním menu webu se aktuálně mění sportovní sekce podle sezóny (např. Tour de France). Aby byly testy robustní a udržitelné, volím cestu přes **"Všechny sporty" → "Cyklistika"**, která je stabilní a nezávislá na aktuálních událostech.

## Strategie testů

### Test 1

- Otevřít rubriku **Cyklistika**.
- Ověřit, že všechny články v seznamu mají zobrazené datum.
- Najít první článek, který není video (podle absence štítku "VIDEO").
  - Poznámka: Pokud na stránce nejsou žádné ne-video články, test bude tuto situaci hlásit (např. skip nebo fail s vysvětlením).
- Otevřít tento článek.
- Ověřit, že článek obsahuje:
  - autora (v horní pravé části nad textem)
  - zdroj (ve spodní části článku)
- Najít sekci **Související články**.
- Ověřit, že první související článek je ze stejné rubriky (kontrola URL → obsahuje např. "/cyklistika/").

### Test 2

- Otevřít web při šířce viewportu pod 700 px.
- Ověřit, že se zobrazuje hamburger menu.
- Ověřit, že v menu existuje položka **Cyklistika**.
- Kliknout na ni a ověřit, že jsme v rubrice Cyklistika.

## Poznámky k robustnosti

- Web ČT Sport je dynamický (články se mění, přibývají nové). Testy proto pracují s obecnými strukturami (např. kontrola přítomnosti data, nikoliv konkrétní hodnoty).
- Kategorie "Cyklistika" může být někdy méně viditelná, proto volím konzistentní cestu přes "Všechny sporty".

## Spuštění

```bash
npm install
npm test
```

Pro spuštění s otevřeným prohlížečem (headed mode):

```bash
npm test -- --headed
```

## Poznámky k ladění

- Během vývoje jsem jednotlivé články (datum a pořadí) nechal logovat do konzole 
- Tyto ladicí logy jsou aktuálně v kódu zakomentované (viz komentované řádky ve for-cyklu v souboru `cycling.spec.ts`). 