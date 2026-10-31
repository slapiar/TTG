# TOPTOUR Communicator 0.1.0

Samostatne inštalovateľný WordPress plugin, zdroj vlastnený TTG. Jeden komunikátor na webe, jeden serverový profil; nejde o viacnájomnícku službu. TOPTOUR-Core zostáva cieľovým vlastníkom obchodných dát. Prvá verzia má súkromný CPT `ttg_inquiry` bez migrácie existujúcich tabuliek. Budúce prepojenie použije explicitný adaptér, bez druhej evidencie.

## Inštalácia

1. Adresár `toptour-communicator` vložiť do `wp-content/plugins/` alebo nahrať jeho ZIP cez administráciu WordPressu. Vyžaduje WP 6.5+, PHP 8.1+, HTTPS.
2. Na serveri nastaviť premennú `GEMINI_API_KEY` alebo konštantu `TTG_GEMINI_API_KEY` vo `wp-config.php`. Kľúč nie je súčasťou balíka, databázy nastavení ani výstupu do prehliadača.
3. Aktivovať plugin. Nastavenia → TOPTOUR Joyee: vložiť schválené **verejné** podklady, zvoliť hlas a polohu, povoliť zobrazenie. Prázdne podklady alebo chýbajúci kľúč panel nezobrazia.
4. Požiadavky sa zobrazia v administrácii „Joyee — požiadavky“. Prístup má správca s `manage_options`. Plugin nemaže údaje pri deaktivovaní.

## Implementované správanie

- Presun myšou za hlavičku aj klávesmi šípok, zbalenie bez ukončenia hovoru, poloha v sessionStorage; mobil má kompaktný spodný panel.
- Gemini Live cez natívny WebSocket, bez externého CDN a bez klientského SDK. AudioWorklet odosiela PCM16LE s deklarovanou skutočnou vzorkovacou frekvenciou prehliadača; Gemini ju podľa dokumentácie prevzorkuje. Výstup PCM16LE 24 kHz.
- Osemminútový serverový token, jedna inicializácia, uzamknutý model, systémové pokyny a hlas; klient ukončí hlas po 7,5 minútach. Nové zapnutie zachová textový kontext. Automatické obnovenie relácie zatiaľ nie je implementované.
- Vstupný aj výstupný prepis, prerušenie vyprázdni front zvuku. Pri ukončení sa uvoľní mikrofón aj AudioContext. Zbalenie ponechá hovor aktívny.
- Automatický jazyk. Pri neprítomnosti prepisu prvých 20 sekúnd sa ponúkne jazyk; druhý neúspech ponúkne text. Ticho sa nedá spoľahlivo odlíšiť od nerozpoznanej reči. Pri nesprávne rozpoznanom texte návštevník použije „Jazyk / Language“. SK/EN/DE/FR/ES.
- Text používa serverový Gemini 3.5 Flash-Lite. Je dostupný aj bez mikrofónu alebo pri chybe Live. UI je zatiaľ slovensko-anglické; plná lokalizácia UI nie je implementovaná.
- Návštevník výslovne potvrdí kontakt a odovzdanie prepisu. Najprv sa uloží súkromná požiadavka, potom sa skúsi slovenské zhrnutie. Pri výpadku AI zostáva kontakt aj prepis uložený. Prepis je označený ako klientský, neoverený; zhrnutie ako AI návrh.
- Jeden obchodný záznam na návštevnú reláciu (idempotentné zopakovanie odoslania). Rozpracovaný prepis zostáva iba v pamäti karty, zatiaľ bez automatického serverového checkpointu.

## Prevádzkové hranice

Predvolene najviac 20 nových relácií/hodinu na web, 5/IP/hodinu, 3 Live tokeny/reláciu, 40 textových odpovedí/reláciu; relácia platí 30 minút. Globálny limit nastavuje správca. Limity účtu Google zostávajú samostatné. Súbeh limitera je serializovaný cez WordPress options, na kolíziu odpovie 429. Služba nevytvára interné nástroje, rezervácie ani platby.

Origin kontrola a krátkodobý bearer token chránia prehliadačový tok; verejná služba potrebuje pri väčšej návštevnosti aj ochranu proti botom na okraji hostingu. V IP limite sa zámerne nedôveruje klientskym proxy hlavičkám. Stránka aj REST musia byť na rovnakej origin; headless subdoména potrebuje samostatný explicitný origin kontrakt. REST tokenové odpovede sú `no-store`.

Žiadny interný dokument nevkladať do verejného kontextu. Klientské údaje sa považujú za nedôveryhodné, neudeľujú žiadne oprávnenia. Serverové slovenské zhrnutie sa nevracia návštevníkovi. Oznámenie o AI a spracovaní je v paneli; návštevník ho potvrdí pred odoslaním dát.

## Kontrakty a overenie

[CONTRACTS.md](CONTRACTS.md) definuje moduly a testy. Spustenie kontrol:

```sh
node --check assets/widget.js
node --check assets/capture.js
php -l toptour-communicator.php
php tests/server.php
node --test tests/audio.test.mjs
node --test tests/dom.cjs
node --test tests/widget.cjs
```

DOM test vyžaduje jsdom (premenná TTG_CHECK_MODULES môže určovať adresár node_modules). Browser test vyžaduje Playwright a Chromium. `CODEX_PRIMARY_RUNTIME_NODE_MODULES` môže určovať jeho umiestnenie; mimo tohto prostredia použiť lokálne nainštalovaný `playwright`. Kontroly používajú simulované služby, neúčtujú Gemini volania. Živý API tok a WordPress runtime sa v tomto pracovnom prostredí bez nainštalovaného WordPressu a serverového kľúča nepotvrdzujú.

## Zdroje protokolu (31. 10. 2026)

- https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens
- https://ai.google.dev/api/live
- https://ai.google.dev/gemini-api/docs/live-api/capabilities
- https://ai.google.dev/gemini-api/docs/structured-output

Bez závislosti na Babylone: následné napojenie avatara použije stavové udalosti; nevytvára sa druhý Babylon engine.

### Výsledok kontrol pri implementácii

PHP 8.3 lint: oba súbory OK. Serverové testy: 15/15. Node AudioWorklet + DOM testy: 4/4 vrátane constrained endpointu, barge-in, jazykového fallbacku a zrušenia čakajúceho mikrofónu. Browser screenshot/layout test zostal nevykonaný, pretože sťahovanie Chromium vrátilo neplatný archív; nejde o potvrdené vizuálne overenie.

Pri REST tokenoch používame **wire formát** `bidiGenerateContentSetup` a `fieldMask`, nie SDK parameter `liveConnectConstraints`. WebSocket používa `BidiGenerateContentConstrained`. Mapovanie bolo porovnané so zdrojmi oficiálneho SDK `googleapis/js-genai/src/tokens.ts`, `src/converters/_tokens_converters.ts` a `src/live.ts`; dokumentačná curl ukážka tieto vrstvy zamieňa. v1beta vychádza z aktuálnej dokumentácie tokenov; samotný online handshake bez serverového kľúča nebol vykonaný.
