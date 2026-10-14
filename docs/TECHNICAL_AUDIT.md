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
