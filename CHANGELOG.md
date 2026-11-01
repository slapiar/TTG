# CHANGELOG — TTG

## [Unreleased]

### Fixed — 0.1.2
- Odstránená potvrdená príčina odmietnutia admin stránok: map_meta_cap=false pri explicitnom primitívnom mapovaní oprávnení CPT. Predchádzajúce nastavenie registrovalo manage_options ako metacap a blokovalo ho aj administrátorovi.
- Reprodukcia so skutočným WordPressom 7.1.4/PHP 8.3: oba admin odkazy 403 pred opravou, 200 s formulárom po oprave. Regresný integračný test overuje zachovanie manage_options, registráciu admin stránky, správcu súkromných požiadaviek a anonymné zamietnutie.


### Fixed — 0.1.1
- Nezávislá administračná položka TOPTOUR Joyee a Nastavenia v zozname pluginov; pôvodný odkaz zachovaný.
- Overené produkčné oprávnenie admin/manage_options. Presná príčina blokovania settings stránky nepotvrdená.
- PHP lint a 18 izolovaných serverových kontrol prešli; admin runtime novej verzie zatiaľ nepotvrdený.

### Added — 2026-10-31
- WordPress plugin `plugins/toptour-communicator` 0.1.0: Gemini Live, presúvateľný a zbaliteľný panel, textový fallback a súkromné požiadavky so slovenským AI zhrnutím.
- Kontrakty modulov, nastavenia verejných podkladov a serverového kľúča, hodinové limity a izolované testy.

### Verification
- PHP lint oboch vstupných súborov; 15 serverových overení s WordPress doubles.
- Štyri Node testy: PCM AudioWorklet, DOM workflow, zrušenie čakajúceho mikrofónu, Live transport/barge-in/jazykový fallback.
- JavaScript syntax kontrola.
- Chromium vizuálna kontrola nedokončená: runtime nemal prehliadač a stiahnutie archívu vrátilo neplatný súbor. Browser test je pripravený v tests/widget.cjs.
- Živé Gemini volania a WordPress runtime nespustené: chýba nasadenie WordPressu a serverový kľúč.

### Deployment
- Zatiaľ bez produkčnej aktivácie. Plugin vyžaduje HTTPS, serverový kľúč a verejné podklady v nastaveniach.
- Existujúca vetva playgroundu sa nemení; tento changelog opisuje vetvu komunikátora založenú na main.
