# Étape 1 — Audit du moteur carrière (src/game/legacy.js), 2026-11-06

Aucun code changé. Ce qui existe déjà vs le prompt Campagne / Carrière.

| Prompt | État | Où |
|---|---|---|
| Le temps avance (semaines, années) | ✅ existe | `nextWeek()` l.719, `newYear()` l.696 |
| Vieillissement des stats | ✅ existe : déclin dès 32 ans, accéléré à 35 ; progrès des jeunes ≤ 21 ans | `newYear()` |
| Retraite | ✅ existe : IA dès 34 ans (aléatoire), tes boxeurs à `RET_AGE` ; retraite volontaire dès 30 ans | `newYear()`, `retireB()` l.1207 |
| Relève (le manager continue) | ✅ partiel : agents libres renouvelés toutes les 4 semaines, académie, 64–78 boxeurs/catégorie | `nextWeek()`, `newYear()` |
| Temple de la renommée | ✅ existe | `hofAdd()` |
| Score d'héritage du manager | ❌ manquant (titres, champions formés, longévité, argent de carrière) | à créer |
| Monde qui vit sans toi | ✅ existe : combats IA chaque semaine, nationaux, ceintures | `aiWeek()`, `aiNational()` |
| Rivaux | ✅ existe (managers rivaux) ; ❌ « rival qui s'adapte à ton style » manquant | `rivalsWeek()` l.1222 |
| Imprévus (blessures, offres, renégociation) | ✅ partiel | `maybeEvent()` l.2988, `offersWeek()`, négociation de contrat |
| Ères (style dominant qui change) | ❌ manquant | à créer |
| Anciens boxeurs qui reviennent | ❌ manquant | à créer |
| Chapitre de campagne par saison | ❌ manquant | à créer |
| Inactivité 3 mois avertie | ✅ fait (règle 10) | `inactivityTick()` |
| XP seulement en combat | ✅ fait (règle 11) | `train()` |
| Camp plus cher chaque semaine | ✅ fait (règle 12) | |
| Bourses selon crédibilité + classement | ✅ fait (règle 8) | `drawOf()` l.760 |
| Sponsors réalistes (B5) | ✅ fait ; à re-prouver dans la simulation | `sponsWeek()` |
| Sauvegarde à UN slot | ❌ aujourd'hui plusieurs slots (`SK(n)`, liste `slots:[` l.4007) | à changer (étape 4) |
| B1 / B3 / B4 / B24 | ❓ à reproduire | étape 3 |
| Simulation sur plusieurs années (preuve) | ❌ manquante | étape 2 |

## Ordre de travail retenu
1. ✅ cet audit
2. Simulation Vitest sur 5 ans (sans interface) : sert de preuve pour tout le reste
3. B1, B3, B4, B24
4. Un seul slot de sauvegarde (confirmation « Écraser la carrière actuelle ? »)
5. Score d'héritage + écran Records
6. Ères, rivaux qui s'adaptent, anciens boxeurs qui reviennent
7. Chapitre de saison
8. Rapport chiffré (section 11 du prompt)
