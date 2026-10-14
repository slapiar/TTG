# TTG — Register úloh

**Aktualizované:** 14. 10. 2026  
**Aktuálna etapa:** Technický audit. Pred jeho uzavretím nevykonávame migrácie, refaktoring ani zásahy do produkcie.

## Poradie a stav úloh

| Poradie | GitHub Issue | Úloha | Stav | Výstup / poznámka |
| --- | --- | --- | --- | --- |
| 1 | [#1](https://github.com/slapiar/TTG/issues/1) | Audit CTT: zdrojový kód, závislosti a build | ROZPRACOVANÉ | Zdrojový kód a konfigurácia prečítané; build, testy a WebGL neoverené |
| 2 | [#2](https://github.com/slapiar/TTG/issues/2) | Audit TOPTOUR-Core: modely a REST | HOTOVÉ — STATICKÝ AUDIT | Modely a prístupové hranice preskúmané; rozhodnutie o úložisku rezervácií v #6 |
| 3 | [#3](https://github.com/slapiar/TTG/issues/3) | Audit Reference Finder: entity a API | HOTOVÉ — STATICKÝ AUDIT | CRUD, väzby, REST a oprávnenia preskúmané; publikačný kontrakt v #6 |
| 4 | [#4](https://github.com/slapiar/TTG/issues/4) | Audit termika XC/CC: moduly a vlastníctvo | NASLEDUJE | Overiť registre, závislosti a stav jednotlivých modulov |
| 5 | [#5](https://github.com/slapiar/TTG/issues/5) | Audit WordPress TOPTOUR: API a obsah | ČIASTOČNE OVERENÉ — NASLEDUJE | REST posts/pages/media a pluginy overené; zostáva mapovanie dátových väzieb |
| 6 | [#6](https://github.com/slapiar/TTG/issues/6) | Uzavrieť audit a schváliť mapu komponentov | ČAKÁ | Konsolidovať technický audit a integračné rozhrania |
| 7 | [#7](https://github.com/slapiar/TTG/issues/7) | Po audite: prototyp WordPress → TTG → BabylonJS | ODLOŽENÉ | Realizovať až po schválení auditu |

## Zistenia evidované na ďalšie riešenie

| Zdroj | Zistenie | Riešiť v |
| --- | --- | --- |
| CTT | Node.js >=24 <25, npm >=11 <12; potrebné zosúladiť prostredie | #1 |
| CTT | BabylonJS a CesiumJS majú zdrojový prototyp, ale nie overený runtime | #1 |
| CTT | CI vykonáva npm ci a npm run check; výsledky behu zatiaľ neoverené | #1 |
| TOPTOUR-Core | Meta ponúk sú registrované s show_in_rest=false | #2, #5 |
| TOPTOUR-Core | Rezervačný modul obsahuje schému, nie aktivovaný systém | #2 |
| Reference Finder | REST endpoint import-task-text existuje; mnohé ostatné sú TODO | #3 |
| termika | Stav prenesenia modulu nie je dôkaz funkčnosti; XC je referencia | #4 |
| TTG / CTT | Spoločné komponenty a ontológia majú smerovať pod jedného vlastníka TTG | #6 |

## Pravidlá evidencie

- `tasks.md` je prehľadný poradovník a stavový register; GitHub Issues obsahujú detaily a priebeh.
- `docs/TECHNICAL_AUDIT.md` uchováva technické zistenia a dôkazy.
- Nové významné zistenie priradíme k existujúcej úlohe alebo vytvoríme nové Issue.
- Stav `HOTOVÉ` používame až po overení výstupu; plán nie je implementácia.
- Po každej pracovnej etape aktualizujeme tento register.
- **Jeden komponent, jeden vlastník, viacero použití.**

## Doplnené zistenia (14. 10. 2026)

| Zistenie | Úloha | Stav |
| --- | --- | --- |
| CTT: CI existuje, ale build/test/WebGL neboli spustené | #1 | OTVORENÉ |
| TOPTOUR-Core: managers je placeholder; rezervácie bez inštalácie tabuľky | #2 | ZDROJ OVERENÝ, RUNTIME NIE |
| Reference Finder: CRUD pre destinácie, zariadenia a ponuky; REST väčšinou TODO | #3 | ZDROJ OVERENÝ, RUNTIME NIE |
| termika: register 83 položiek, rozdiel počtov oproti dokumentácii (69/70 a 47/48) | #4 | OTVORENÉ |
| WordPress: WP REST posts/pages/media čítanie funguje, Tourfic namespace existuje; /wp/v2/types cez konektor vrátil [] | #5 | ČIASTOČNE OVERENÉ |
| Schváliť publikačné kontrakty a mapovanie ponúk medzi Reference Finder a TOPTOUR-Core | #6 | OTVORENÉ |

**Brána k implementácii:** #7 zostáva ODLOŽENÉ až do uzavretia auditu a schválenia jeho záverov.

## Rozhodnutie o testovaní — 14. 10. 2026

- Uprednostniť jednoduché overenie buildu a vizuálne overenie priamo na testovacom webe; nezavádzať rozsiahlu testovaciu infraštruktúru.
- Historické testovacie URL Guider TEREM: https://jarmok.shop/guider/dist/ ; Babylon Lite: https://jarmok.shop/guider/lite-lab/ . Aktuálna dostupnosť a vhodnosť na TTG sa musí preveriť.
- Zachovať existujúce základné kontroly CTT (typecheck/test/build), bez rozširovania testovacieho frameworku.
- Pred použitím hostingu overiť izoláciu od existujúceho Guider TEREM; nič neprepisovať bez výslovného rozhodnutia.
- Úloha #1: skrátiť testovací plán na minimálny build + browser smoke test. Úloha #7 zostáva odložená do uzavretia auditu.

## Nové zistenie — GitHub Actions CTT (14. 10. 2026)

- Posledný zistený CI beh CTT z 7. 10. 2026 má výsledok **failure**: https://github.com/slapiar/CTT/actions/runs/37608061174 .
- GitHub API pri tomto behu nevrátilo diagnostické kroky jobu; príčina zatiaľ **nezistená**. Nesmieme tvrdiť, že je chybný build aplikácie.
- Priradenie: Issue #1. Nasledujúci krok: overiť dostupné logy alebo lokálny minimálny build; opravu navrhnúť až po identifikácii príčiny.

## Rozhodnutie — priorita CI (14. 10. 2026)

- Neúspešný GitHub Actions CI beh CTT **neblokuje dokončenie statického auditu ani pokračovanie ďalšími úlohami**.
- Diagnostiku CI odložiť do fázy prípravy buildu, ak sa ukáže ako potrebná. Preferovať krátke overenie na testovacom webe.
- Neodbočovať od auditu kvôli infraštruktúrnym testom.

## Nové zistenia — 14. 10. 2026 (audit backendu)

| Zistenie | Úloha | Stav |
| --- | --- | --- |
| TOPTOUR-Core installer vytvára `toptour_requests` a `toptour_request_meta`, zatiaľ čo modul reservations definuje samostatnú `toptour_reservations` bez inštalácie. Overiť zamýšľaný jediný model požiadaviek/rezervácií. | #2 | OTVORENÉ — integračné rozhodnutie |
| TOPTOUR-Core aktivácia iba zisťuje WooCommerce, jeho neprítomnosť však neblokuje inštaláciu. | #2 | ZDROJ OVERENÝ |
| Reference Finder má väzbu zariadenie ↔ destinácia M:N a označenie primárnej destinácie. | #3 | ZDROJ OVERENÝ |
| Reference Finder má v hlavnom súbore verziu 1.1.20, ale MANIFEST uvádza 0.2.9. Zjednotiť dokumentačnú verziu bez zásahu do runtime. | #3 | OTVORENÉ |

## Pokračovanie úloh #2 a #3 — 14. 10. 2026

| Úloha | Zistenie | Stav |
| --- | --- | --- |
| #2 | TOPTOUR-Core: offers registruje 14 vlastných polí produktov, managers nemá implementované hooky; reservations nemá aktívnu registráciu hookov. | STATICKY OVERENÉ |
| #2 | Installer používa requests/request_meta, reservations má alternatívnu neinštalovanú schému; kanonické úložisko určiť až pri návrhu integrácie. | ODLOŽENÉ ROZHODNUTIE |
| #3 | Reference Finder má CRUD a väzby, snapshoty ponúk a zdrojové referencie. Loader registruje dva REST kontroléry. | STATICKY OVERENÉ |
| #3 | Okrem import-task-text existuje päť autentifikovaných tracer endpointov v namespace toptour/v1. Predchádzajúce tvrdenie o jedinom implementovanom endpointe platilo len pre toptour-ref/v1. | OPRAVENÉ |
| #3 | Tracer endpointy sú interné, chránené capability manage_toptour_references; nepatria do verejného TTG API. | KONTRAKT |

**#2 a #3:** hlavná zdrojová inventúra hotová; bez runtime validácie a bez zmien v pluginoch. Nasleduje #4 a #5; integračné rozhodnutia uzavrieť v #6.
