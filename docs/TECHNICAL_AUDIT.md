# Technický audit TOPTOUR GUIDER

**Dátum:** 2026-10-14  
**Stav:** rozpracovaný audit zdrojových kódov; bez buildov, runtime testov a zásahov do produkcie.

## Overené repozitáre

- `slapiar/TTG`: centrálna architektúra a ontológia; aplikačný kód zatiaľ nie je prítomný.
- `slapiar/CTT`: npm workspaces, TypeScript, Vite, prototypy Cesium/Babylon, dáta Tenerife, UI a testy.
- `slapiar/TOPTOUR-Core`: WordPress moduly offers, managers, reservations.
- `slapiar/toptour-reference-finder`: evidencia destinácií, zariadení, ponúk a zdrojov; REST API čiastočné.
- `slapiar/termika`: XC/CC, geografické, meteorologické a analytické moduly; podrobný register migrácie.

## Mapa komponentov

| Zdroj | Implementácia | Cieľový vlastník | Overenie |
| --- | --- | --- | --- |
| CTT packages/3d | Babylon Engine, Scene, kamera, svetlo, demo objekt, cleanup | TTG | Zdroj prečítaný; runtime neoverený |
| CTT packages/map | Cesium Viewer, glóbus, bod destinácie, cleanup | TTG integračné rozhranie; Cesium špecializované | Zdroj prečítaný; runtime neoverený |
| CTT packages/tourism | GeoPoint, Destination, ViewHandle, validácia WGS84 | TTG | Zdroj prečítaný; testy nespustené |
| CTT packages/ui | DOM actionButton | TTG | Zdroj prečítaný |
| CTT apps/tenerife | prepínanie map/3d, lazy importy | CTT | Zdroj prečítaný |
| CTT data/tenerife | stred Tenerife, výška kamery | CTT | Zdroj prečítaný |
| TOPTOUR-Core offers | WooCommerce metadáta ponúk | TOPTOUR-Core | Zdroj prečítaný; show_in_rest=false |
| TOPTOUR-Core reservations | SQL schéma, bez aktivovanej inštalácie tabuľky | TOPTOUR-Core | Zdroj prečítaný; nie hotová rezervácia |
| Reference Finder REST | POST import-task-text; ďalšie endpointy v komentári TODO | Reference Finder | Zdroj prečítaný; runtime neoverený |
| termika CC | moduly terénu, meteo, vetra, UI a host-context | termika | Štruktúra a dokumentácia; funkčnosť neoverená |

## Technické závislosti

- CTT vyžaduje Node >=24 <25 a npm >=11 <12, packageManager npm@11.9.0.
- CTT používa TypeScript 7.0.2, Vite 8.3.3, BabylonJS @babylonjs/core 9.29.0, Cesium 1.146.0.
- CTT má `npm run check` pre typecheck, test a build. Prítomnosť skriptu neznamená úspešné vykonanie.
- Balíky CTT sú privátne, exportujú priamo TS zdroj; samostatné publikovanie vyžaduje ďalšie rozhodnutie.

## Zistené integračné hranice

1. WordPress → TTG: pre obchodné metadáta nie je možné predpokladať verejné REST sprístupnenie, keďže TOPTOUR-Core nastavuje `show_in_rest=false`. Vyžaduje sa návrh kontrolovaného API.
2. CTT → TTG: spoločné balíky preniesť alebo sprístupniť až po testoch a rozhodnutí o vlastníctve. Nevytvárať druhý Babylon engine.
3. termika → TTG: preferovať samostatné adaptéry a explicitné kontrakty; zachovať XC ako referenciu, nevyhlasovať WRAPPED_CC za VERIFIED_CC.
4. Ontológia: centrálna správa v TTG; existujúce CTT identifikátory zachovať do konsolidácie.

## Zostáva preveriť

- Celý kód a manifesty Reference Finder, TOPTOUR-Core a vybraných termika modulov.
- Skutočné REST odpovede WordPressu, oprávnenia, dátové schémy a ich mapovanie.
- Výsledky `npm ci`, `npm run check` a vizuálny test WebGL vo vhodnom izolovanom prostredí.
- Licencie, externé dátové zdroje, integráciu 3D s reálnymi dátami.
- Návrh minimálneho prototypu WordPress → TTG → BabylonJS.

**Princíp:** Jeden komponent, jeden vlastník, viacero použití. Bez migrácie a refaktoringu pred dokončením auditu.

## Doplnenie auditu — 14. 10. 2026

### CTT — stav zdrojov
- Overené zdrojové súbory: BabylonJS mountScene s cleanup, Cesium mountMap s cleanup, WGS84 validateDestination, UI actionButton, Tenerife prepínanie, dáta Tenerife, testy, npm workspaces a CI.
- Závislosti: Node 24, npm 11, BabylonJS 9.29.0, Cesium 1.146.0, Vite 8.3.3, TypeScript 7.0.2. Build ani WebGL sa v tomto audite nevykonali.

### TOPTOUR-Core — stav zdrojov
- Offers: metadáta WooCommerce produktov vrátane kapacity, ceny, sezóny, manažéra; `show_in_rest=false`.
- Managers: aktuálne iba prázdny init() bez hookov.
- Reservations: definícia SQL schémy; inštalácia tabuľky nie je zapojená.

### Reference Finder — stav zdrojov
- Manifest označuje aktívny interný manažérsky systém; triedy Destinations, Facilities a Offers obsahujú databázové CRUD a filtrovanie.
- REST API: implementovaný POST `/toptour-ref/v1/import-task-text` s capability kontrolou; ostatné uvedené endpointy sú plánované.
- Interné analytické dáta sa nesmú automaticky zverejňovať v TTG; treba explicitný publikačný kontrakt.

### termika — stav zdrojov
- `CC/registry/modules.json`: 70 transferable, 1 architectural, 12 kernels, 83 celkom. `CC/README.md` uvádza 69 prenesených položiek. Rozdiel vo vykazovaní preveriť podľa registra a kategorizácie.
- `CC/registry/host-code-owners.json` uvádza 48 JavaScript proxy; dokument `HOST-SEPARATION.md` uvádza 47. Rozdiel preveriť, pravdepodobne rôzny čas evidencie.
- `runtime_enabled=false` nie je dôkaz funkčného zapojenia. XC zostáva referenciou.

### Produkčný WordPress — overenie iba na čítanie
- WPVibe site_info potvrdilo pripojenie na `https://toptour.top`, tému Royal Elementor Kit, aktívne Elementor, WooCommerce, Tourfic a LiteSpeed Cache.
- REST index deklaruje namespace `wp/v2`, `wc/v3`, `wc/store` a `tf/v1`.
- GET `/wp/v2/posts`, `/wp/v2/pages` a `/wp/v2/media` vrátili existujúce záznamy; GET `/tf/v1` vrátil register rout.
- GET `/wp/v2/types` cez konektor vrátil prázdne pole; treba overiť, či ide o obmedzenie konektora alebo konfiguráciu API.
- Konektor hlási overené autentifikované čítanie; publikovanie a zápisy neboli testované.

### Záver a hranice overenia
**Dokončená inventúra a zdrojová analýza vybraných rozhodujúcich komponentov. Technický audit nie je úplne uzavretý:** chýba izolovaný build/test CTT, vizuálny WebGL test, detailný audit všetkých modulov termika, presné API kontrakty a runtime validácia integrácie. Tieto overenia zostávajú v Issues #1–#6; Issue #7 sa nezačne pred ich uzavretím.

## Záverečné doplnenie statického auditu — 14. 10. 2026

- TOPTOUR-Core MANIFEST: obchodná ponuka je WooCommerce produkt s vlastnými meta poľami; CTA preferuje „Overiť dostupnosť“ / „Rezervovať“; nejde o generický booking engine. Manažér je referencia na WP používateľa.
- Reference Finder installer obsahuje reálne SQL schémy destinácií, zariadení, ponúk a zberových úloh. Reference Finder eviduje analytické ponuky, zatiaľ čo TOPTOUR-Core predajné produkty; neztotožňovať ich bez mapovania.
- CTT README potvrdzuje výstup `apps/tenerife/dist` a vývojový charakter demonštračnej 3D scény.
- Zvolený spôsob následného overenia: existujúce základné kontroly a krátky browser smoke test na oddelenom testovacom webe; žiadna rozsiahla testovacia infraštruktúra.

**Stav:** statická inventúra kľúčových zdrojov dokončená v rozsahu vybraných rozhodujúcich súborov; plný audit runtime a všetkých modulov nie. Otvorené body zostávajú v tasks.md / Issues #1–#6. Neoznačovať celý technický audit za úspešne otestovaný.

## Kontrola backendových kontraktov — 14. 10. 2026

- TOPTOUR-Core `toptour-core.php`: verzia 1.0.0, aktivátor spúšťa installer. Installer vytvára `toptour_requests` a `toptour_request_meta`; samostatný modul reservations opisuje tabuľku `toptour_reservations`, ktorej inštaláciu výslovne nespúšťa. **Dva odlišné návrhy úložiska požiadaviek/rezervácií; nerozhodovať o migrácii pred určením kanonického modelu.**
- TOPTOUR-Core `managers`: placeholder; `assigned_manager_user_id` smeruje na WordPress používateľa.
- Reference Finder `toptour-reference-finder.php`: verzia 1.1.20, DB schéma 1.1.0; MANIFEST uvádza 0.2.9 (dokumentačný nesúlad).
- Reference Finder `class-facility-destinations.php`: väzba M:N medzi zariadeniami a destináciami, `is_primary`, `relation_type`; kandidát na dátový vzťah TTG, nie automaticky na zverejnenie interných záznamov.
- Reference Finder REST používa `manage_toptour_references` capability, primárne administrátorský prístup.

## Doplnenie auditov #2 a #3 — 14. 10. 2026

### #2 TOPTOUR-Core
- `modules/offers/class-offers.php` poskytuje metadátovú schému a WordPress administračné formuláre; neimplementuje verejný REST katalóg. Ponuky sú WooCommerce produkty.
- `modules/managers/class-managers.php` má zatiaľ iba prázdnu inicializáciu.
- `modules/reservations/class-reservations.php` má návrh SQL schémy, ale registrácia hookov je prázdna; existujúce `toptour_requests` a `toptour_request_meta` sú definované v inštalátore. Bez automatického zlúčenia alebo migrácie.

### #3 Reference Finder
- Loader registruje REST kontroléry `Toptour_Ref_REST_API` a `Toptour_Ref_Debug_Tracer_API`.
- `toptour-ref/v1`: implementovaný POST `import-task-text`; ostatné obchodné endpointy sú komentované TODO.
- **Oprava predchádzajúceho zistenia:** `toptour/v1` má päť implementovaných tracer POST rout: `initialize`, `generate-batch`, `process-ai`, `import-results`, `cleanup-run`. Každá používa capability `manage_toptour_references` a nie je verejným katalógovým API.
- Triedy Offer Snapshots a Reference Sources implementujú historizáciu ponúk a evidenciu zdrojov. Výstup do TTG vyžaduje samostatný publikačný adaptér a bezpečnostné pravidlá.

**Stav #2/#3:** statický audit hlavných integračných kontraktov uzavretý; runtime nasadenie neoverené. Nevyžaduje blokovať ďalšiu inventúru #4/#5. Definitívne integračné rozhodnutia patria do #6.
