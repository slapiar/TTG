# TTG — prototyp #7

Izolovaná statická ukážka BabylonJS postavy HVGirl s animáciou Samba. Vychádza z používateľom dodaného súboru `babika.js`; zdrojový originál sa nemení.

## Spustenie

Hostovať priečinok `prototype/` cez ľubovoľný statický HTTP server a otvoriť `index.html`. Vyžaduje WebGL a internet pre ESM BabylonJS a externý GLB model. Žiadny zásah do WordPressu.

## Stav

- Implementovaná základná animovaná scéna a cleanup po zatvorení stránky zabezpečí prehliadač.
- Hudobný prepínač je **zámerne deaktivovaný**, pretože zvuková stopa zatiaľ neexistuje (#8). Nesľubujeme nefunkčné ovládanie.
- WordPress → TTG integrácia je **ďalší krok v rámci #7**, nie súčasť tejto prvej izolovanej fázy.
- Build ani vizuálne spustenie zatiaľ neboli overené.
- Pred použitím v produkcii treba potvrdiť licenciu modelu a externých zdrojov.
