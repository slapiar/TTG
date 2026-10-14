# TTG — TOPTOUR Guider

**Univerzálna webová aplikácia a používateľské rozhranie ekosystému TOPTOUR.**

> Radosť žiť!  
> Svetu mier a cestovaniu zvlášť!

## Poslanie

TOPTOUR Guider sprostredkúva návštevníkovi destinácie, ubytovanie, zážitky, podujatia a ponuky TOPTOUR. Nie je viazaný na jedinú destináciu. **Tenerife je prvá pilotná implementácia**, nie hranica produktu.

TTG je samostatný repozitár s jasnou zodpovednosťou: verejná aplikácia, navigácia, prezentácia, interakcie a ich prepojenie s dátovými službami. Existujúce systémy sa nemajú bezdôvodne kopírovať ani presúvať.

## Architektonické rozhodnutie TTG-ADR-001 — Headless TOPTOUR

**Stav:** prijatý smer architektúry; implementačné rozhrania ešte vyžadujú audit.

- **Frontend:** TypeScript a štandardné webové technológie pre obsah, navigáciu, responzívne UI, formuláre, prístupnosť a SEO.
- **BabylonJS:** interaktívne 3D scény, virtuálne prehliadky a vizualizácie. Nie náhrada HTML pre celý web.
- **CesiumJS:** voliteľná geografická a terénna vizualizácia tam, kde má zmysel.
- **WordPress (headless):** obsah, blog, médiá a prípadne katalóg, WooCommerce či rezervácie cez riadené API.
- **Buildery (Elementor, Royal Elementor a pod.):** nie sú súčasťou cieľového verejného rozhrania. Existujúce stránky sa nahrádzajú postupne, bez narušenia prevádzky.

## Hranice repozitárov

| Repozitár | Zodpovednosť |
| --- | --- |
| **TTG** | Univerzálna verejná aplikácia TOPTOUR, UI/UX, navigácia, BabylonJS prezentácia, API klient |
| **TOPTOUR-Core** | Spoločné WordPress/backend služby a integračné kontrakty; presný rozsah určí audit |
| **toptour-reference-finder** | Interný manažérsky systém: zariadenia, destinácie, ponuky, zdroje, referencie a analytika |
| **CTT (Canaria TopTour)** | Kanárske ostrovy, pilot Tenerife, destinančné dáta a špecifické funkcie |
| **termika** | Špecializované letecké, meteorologické a geografické funkcie |

**Pravidlo: Jeden komponent, jeden vlastník, viacero použití.**

### Pozor na existujúce CTT

CTT už obsahuje plánované balíky `packages/tourism`, `packages/map`, `packages/3d`, `packages/ui` a aplikáciu `apps/tenerife`. Pred presunom alebo novou implementáciou treba inventarizovať skutočný kód, určiť vlastníctvo komponentov a navrhnúť integračné kontrakty. **Nezakladáme druhý konkurenčný BabylonJS engine ani neduplikujeme UI.** Rozdelenie TTG/CTT je cieľový návrh, nie tvrdenie, že migrácia už prebehla.

## Ontológia a princípy

Spoločná ontológia pomenúva destinácie, miesta, produkty, zariadenia, aktivity, hostí, zážitky a vzťahy medzi nimi. Stabilné ID, definície, pôvod a stav rozhodnutí majú prednosť pred náhodným pomenovaním v kóde.

Základné vyjadrenia TOPTOUR:

- **Radosť žiť!** — hodnotový motív TOPTOUR.
- **Svetu mier a cestovaniu zvlášť!** — komunikačné motto.
- **Virtuosity attracts curiosity.** — prijatá projektová axióma, použiteľná aj mimo CTT.
- **Čistota a poriadok vychováva.** — princíp vzťahu prostredia a správania, ilustrovaný príbehom na TOPTOUR.top.
- **FLY-FREE** — schválený názvový prvok pre letecké podujatia; nie definícia bezplatnosti.

Podrobné definície a schvaľovanie nových pojmov budú vedené v samostatnej ontologickej dokumentácii; existujúci základ je v `CTT/docs/ONTOLOGY.md`. Názvy, mottá a slogany nemeniť potichu.

## Prvá etapa — audit pred vývojom

1. Zmapovať aktuálny WordPress TOPTOUR, dostupné REST API, publikovaný obsah a dátové väzby.
2. Prečítať manifesty, zdrojové kódy, závislosti a stav buildov v TOPTOUR-Core, Reference Finder, CTT a termika.
3. Určiť jediného vlastníka každej funkcie, dátovej entity a integračného kontraktu.
4. Zaznamenať rozdiel medzi hotovou funkcionalitou, prototypom a plánom.
5. Pripraviť malý overiteľný prototyp **WordPress dáta → TTG → BabylonJS**, bez zásahu do produkčného webu.
6. Až po overení stanoviť plán postupnej náhrady existujúceho frontendu.

## Zásady vývoja

- Najprv ontológia a kontrakty, potom implementácia.
- Žiadne veľké refaktoringy bez auditu, testov a návratovej cesty.
- Každú významnú zmenu architektúry zdokumentovať; viesť `CHANGELOG.md`.
- Verejný frontend nesmie obsahovať tajné kľúče ani súkromné údaje.
- Externé dátové zdroje musia mať zaznamenaný pôvod, licenciu a aktualizáciu.
- Repozitár je verejný; zverejnenie automaticky neznamená udelenie open-source licencie.

## Stav

**Architektonický základ / pred implementáciou.** Tento README definuje smer, nie hotové funkcie ani overené produkčné nasadenie.
