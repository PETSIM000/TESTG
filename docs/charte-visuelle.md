# FIGHT DYNASTY — Charte visuelle

Version 1 — 2026-11-06. Référence officielle : **tout asset ou écran doit s'y conformer, sinon il est rejeté** (plan d'exécution, Phase 1).
Ancre de style : le logo de Max (écusson rouge et or, gant couronné, lauriers). Les badges « glossy » du 2026-11-05 ne sont pas dans le dossier ; ils s'ajouteront comme référence s'ils sont retrouvés.
Page de vérification dans le build : `/charte.html` (aperçu Vercel).

## 1. Intention

Une soirée de gala de boxe : salle noire, projecteurs, or, cuir rouge. Prestige, pas néon.
Le joueur est un **manager** : l'interface ressemble à un bureau de promoteur haut de gamme — cartes nettes, chiffres lisibles, récompenses qui brillent.

## 2. Palette (rôles)

| Rôle | Jeton CSS | Valeur | Usage |
|---|---|---|---|
| Fond nuit | `--bg` | `#07080c` | fond de toutes les pages |
| Surfaces | `--s1` → `--s3` | `#121621` → `#232a3b` | cartes, feuilles, champs |
| Texte | `--ink` | `#f5f6fa` | texte principal |
| Texte secondaire | `--muted` | `#8c95a8` | légendes, aides |
| **Or Dynasty** | `--gold` / `--gold-g` | `#f5c451` + dégradé `#fff1b8 → #f5c451 → #a8760a` | titres, récompenses, action principale du manager |
| **Rouge cuir** | `--red` / `--red2` | `#ff3b50` / `#c8102e` | combat, urgence, action « combattre » |
| Victoire | `--green` | `#38d98a` | gains, victoires, positif |
| Alerte | `--warn` | `#ff9f43` | avertissements (inactivité, fonds bas) |

Règles : l'or est réservé à ce qui a de la valeur (argent, titres, rangs, bouton principal). Une seule couleur d'accent forte par écran. Jamais de violet/cyan « tech » hors des rangs Maître/Diamant.

## 3. Couleurs des rangs

| Rang | ELO | Métal principal | Accent | Animation |
|---|---|---|---|---|
| Bronze | 0 – 1 499 | `#f0c49a → #7a4a28` | — | statique |
| Argent | 1 500 – 2 999 | `#ffffff → #8f9bb0` | — | statique |
| Or | 3 000 – 4 499 | `#fff1b8 → #c9960f` | — | statique |
| Platine | 4 500 – 5 999 | `#e8fbff → #5fa9bd` | — | statique |
| Diamant | 6 000 – 7 499 | `#e6f4ff → #4f80ff` | `#9fd2ff` | scintillement |
| Maître | 7 500 – 8 999 | `#efe3ff → #8a5cf5` | flammes `#b48cff` | flammes violettes + ailes |
| Champion | 9 000 – 9 999 | `#fff1b8 → #f5c451` | halo `#ffe27a` | halo doré |
| DYNASTY | 10 000 + | noir `#0b0b10` + or | rouge `#c8102e` | énergie qui circule (complète) |

Chaque rang a 3 divisions (III → I), notées en chiffres romains sur une plaque sous le badge.

## 4. Badges et cadres

- **Badge** = bouclier + gants croisés + ceinture, intemporel : **jamais de saison sur le badge**.
- **Cadre de profil** = anneau autour de l'avatar, couleur du rang ; **la saison (S1, S2…) est gravée sur le cadre**.
- **DYNASTY** porte deux plaques sur le cadre : le numéro mondial (#1 à #250) et la saison.
- Animé à partir de Diamant ; en dessous, statique. Les animations respectent `prefers-reduced-motion` (figées).
- Tous dessinés en **SVG dans le code** (`src/ui/ranks.js`) : formes nettes, texte rendu par le moteur, aucune image générée brute.

## 5. Typographie

| Usage | Police | Règle |
|---|---|---|
| Titres, chiffres forts | Big Shoulders Display 700/900 | MAJUSCULES, interlettrage serré |
| Texte | Barlow 400–800 | 14–16 px, jamais sous 12 px |
| Étiquettes compactes | Barlow Condensed 600/700 | onglets, statistiques |
| Valeurs tabulaires | DM Mono | argent, ELO, records |

## 6. Matériaux et lumière

- Lumière de projecteur venant du haut : reflets en haut des surfaces, ombre portée en bas.
- Métal « glossy » : dégradé à 3 arrêts + liseré clair intérieur (1 px, 40 % blanc) + ombre douce.
- Cartes : verre fumé sombre (`--glass`), bord fin `--line`, coins 16 px.
- Aucune texture bruitée, aucune lueur néon diffuse sur le texte.

## 7. Textes (B24) — courts, mobile d'abord

- Un libellé = 1 à 3 mots. Une phrase d'aide = 1 ligne à 360 px de large.
- Icône à la place du mot quand le sens est évident (argent, semaine, record).
- Jamais deux phrases quand une suffit. Les explications longues vont derrière « ⓘ ».
- Les nombres d'abord : « 25 000 $ », « 12-0, 9 KO », « #23 ».

## 8. Mouvement

- Transitions d'écran 180–240 ms, courbe `cubic-bezier(.2,.8,.2,1)`.
- Appui : échelle 0,97 + vibration légère (si dispo).
- Récompense : apparition en ressort + éclat doré, 600 ms max.
- K.O. et grands moments : ralenti, secousse d'écran (Phase 3, skill `game-feel`).

## 9. Règles anti-« look IA »

1. Un seul style partout (cette charte).
2. Jamais d'asset IA brut dans le jeu : les références générées servent de modèles, l'asset final est redessiné.
3. Les vrais assets portent l'identité : mocap réelle, vraie musique, vraies voix.
4. L'écriture vient de Max.
5. Le polish fait le « wow » : transitions, particules, ralentis — puis playtests.
