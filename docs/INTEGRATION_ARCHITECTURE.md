# TTG — Integračná architektúra (ADR-002)

**Dátum:** 14. 10. 2026  
**Stav:** prijatý architektonický smer; konkrétne API schémy sa finalizujú pri integrácii.  
**Princíp:** Jeden komponent, jeden vlastník, viacero použití.

## Vlastníctvo

| Vlastník | Výlučná zodpovednosť |
| --- | --- |
| TTG | Zdieľané BabylonJS jadro, spoločné UI, doménové typy a klientské integračné rozhrania |
| CTT | Pilotná aplikácia a destinančné dáta Tenerife / Kanárske ostrovy |
| TOPTOUR-Core | WordPress obchodné ponuky, manažéri, požiadavky a rezervácie |
| Reference Finder | Interná evidencia, analytika, historické snapshoty, zdroje a verifikácia |
| termika | Špecializované fyzikálne, meteorologické, letecké a geografické výpočty |
| WordPress | Headless CMS, médiá, blog, WooCommerce a Tourfic podľa overených kontraktov |
| Nový Svet | Samostatná herná aplikácia, používateľ spoločného TTG jadra |

## Kontrakty a identita

- Zdrojové identifikátory sa neprerábajú: každá entita má `sourceSystem`, `sourceId` a typ entity. TTG môže mať vlastné stabilné verejné ID a mapovanie na zdroj.
- `Destination`: stabilný slug, názov, WGS84 longitude/latitude, voliteľná nadmorská výška, verejné médiá a pôvod dát. Základ CTT `packages/tourism` ponechať ako východisko.
- `Facility`: verejne schválené údaje zariadenia, väzby M:N na destinácie; interné poznámky a kontakty nevystavovať.
- `Offer`: obchodná ponuka TOPTOUR-Core/WooCommerce a analytický záznam Reference Finder sú rôzne entity. Prepojenie len cez explicitnú väzbu, nie rovnosť číselných ID.
- `Content/Media`: verejné WordPress REST `wp/v2` cez čítací adaptér; bezpečné spracovanie HTML a URL médií.
- `Scene`: BabylonJS scéna s jasným životným cyklom `mount/dispose`; aplikácie vlastnia obsah scény, TTG spoločné vykresľovacie nástroje.
- `GeoLayer`: voliteľný Cesium adaptér; súradnice WGS84 neukladať ako lokálne Babylon súradnice.
- `Simulation`: termika adaptér až po overení konkrétneho modulu; `NEOVERENE` nesmie znamenať produkčnú pripravenosť.

## Rozhrania a bezpečnosť

1. Verejné dáta sa získavajú z WordPress cez GET a kontrolované verejné rozhrania. Žiadne WP administrátorské tokeny v prehliadači.
2. Reference Finder zostáva interný; výstupy na publikovanie sa musia explicitne schváliť a filtrovať.
3. Rezervačné a platobné operácie zostávajú na backende; frontend neposiela priamo do databáz.
4. Nie je rozhodnuté, či kanonickým úložiskom požiadaviek budú `toptour_requests` alebo samostatný rezervačný model. Bez migrácie pred preskúmaním reálneho použitia.
5. Komponenty TTG sa neduplikujú do CTT či Nového Sveta; konkrétna distribúcia balíkov sa zvolí po prvom úspešnom prototype.

## Postup implementácie

1. Overiť malý build existujúceho CTT a vizuálny BabylonJS/Cesium smoke test na oddelenej URL.
2. Navrhnúť read-only adaptér WordPress `posts/pages/media` → TTG dátové objekty.
3. Pripojiť jednu verejnú obsahovú položku k jednoduchému BabylonJS zobrazeniu.
4. Až potom riešiť obchodné ponuky, zariadenia, autentifikáciu a špecializované moduly termiky.

## Otvorené body (neblokujúce)

- Príčina historického CI zlyhania CTT.
- Runtime overenie BabylonJS, Cesium a modulov termiky.
- Konkrétne verejné schémy WooCommerce/Tourfic a kanonické úložisko rezervácií.
- Licencie a pravidlá publikovania externých datasetov.

**Bez predčasného refaktoringu, migrácií a zásahov do produkcie.**
