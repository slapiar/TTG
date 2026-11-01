# Kontrakty čiernych skriniek — 0.1.0

| Modul | Vstup | Výstup | Chyby | Overenie |
|---|---|---|---|---|
| Relácia | Same-origin POST, súhlas | Náhodný bearer, platnosť 30 min | 400 súhlas, 403 origin, 429 limit, 503 konfigurácia | Bez súhlasu žiadne API volanie; cudzí origin zamietnutý; expirovaný bearer 401 |
| Live token | Bearer, voliteľný sk/en/de/fr/es | Jednorazový obmedzený token a model | 401/429/502 | Model, verejný kontext a modalita uzamknuté; trvalý API kľúč sa nevracia |
| Mikrofón | MediaStream | PCM16LE, deklarovaná frekvencia | Odmietnutie povolenia, nepodporovaný prehliadač | Stop aj pri čakaní na povolenie uvoľní dodatočne získaný stream |
| Prehrávanie | PCM16LE 24 kHz | Zvuk | Chyba pripojenia/dekódovania | Barge-in zastaví aktívne zdroje aj front |
| Prepis | Udalosti input/output | Texty role user/model | Chýbajúci použiteľný vstup | Neprítomnosť vstupného prepisu → jazyk → druhý pokus → ospravedlnenie a písanie |
| Text | Bearer, max 120 správ/40 kB | Odpoveď z verejného kontextu | 400 schéma, 429/502 | Výstup sa renderuje ako text, nie HTML |
| Evidencia | Kontakt, prepis/správa, potvrdenie | Súkromné ID | 400 neúplné, 409 súbeh, 500 uloženie | Dvojité odoslanie jedno ID; chyba DB neoznámi úspech |
| Zhrnutie | Uložený neoverený prepis | Slovenský AI návrh | Výpadok AI | Kontakt je uložený pred volaním AI; pri výpadku zostáva originál |
| Panel | Myš/klávesnica, veľkosť okna | Poloha/zbalenie | Nedostupný sessionStorage | Panel v hraniciach displeja, mobile layout, minimalizácia zachová prepis |

Každý verejný endpoint je POST. Odpovede s tokenmi a výsledkami: Cache-Control no-store. Požiadavka sa nikdy nevytvára samotnou rečovou odpoveďou modelu. Identita obchodného partnera je v tejto verzii jedna serverová konfigurácia, klient ju nemôže zmeniť.
