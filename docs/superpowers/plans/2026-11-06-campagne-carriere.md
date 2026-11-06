# Plan — Campagne / Carrière (prompt de Max du 2026-11-06)

Règle d'or : le joueur est un MANAGER. En carrière il REGARDE les combats ; tout son impact se fait avant
(adversaire, camp, forme, contrats). Rangs/badges/cadres et contrôle en ligne : hors périmètre.

## Déjà fait (à re-vérifier dans la simulation)
- B2 knockdowns comptés par les juges · B5 sponsors réalistes · B23 argent des galas verrouillé
- Règle 10 inactivité (avertissement à 11 semaines, perte à 13) · Règle 11 XP seulement en combat
- Règle 12 camp plus cher chaque semaine · Règle 8 bourse selon la crédibilité

## Étapes (une à la fois, testée, puis montrée à Slime)
1. **Audit du moteur carrière** : où vivent le temps, l'âge, la retraite, les sponsors, les bourses, la sauvegarde
   (src/game/legacy.js). Lister ce qui existe vs le prompt. Aucun code changé.
2. **Simulation automatique (Vitest)** : faire tourner N années de jeu sans interface. Sert de preuve pour
   la section 11 (temps qui avance, vieillissement, retraite, héritage, règles chiffrées, monde qui bouge).
3. **Bugs restants** : B1 prénom de l'adversaire · B3 combat accepté le jour exact de fin de récupération ·
   B4 sélecteur de boxeur qui se réinitialise · B24 textes courts mobile.
4. **Sauvegarde à un seul slot** : CONTINUER charge ; NOUVELLE CARRIÈRE demande « Écraser la carrière
   actuelle ? » ; écran LOAD = gym, date en jeu, argent ; idem côté cloud.
5. **Anti-plafond** : vieillissement → courbe de stats → retraite ; relève ; score d'héritage du manager
   (titres, champions formés, longévité, argent de carrière) + écran Records.
6. **Bourses / sponsors** : bourse = crédibilité du manager × classement du boxeur ; plafond sponsor
   relié à la crédibilité (jamais 152 000 $ pour un inconnu). Tests chiffrés.
7. **Monde vivant** : les IA se battent entre elles chaque semaine, classements et champions bougent,
   fil de nouvelles, mise à jour automatique (pas de bouton Actualiser).
8. **Anti-redondance** : ères (style dominant qui change), rivaux qui s'adaptent à ton boxeur, imprévus
   (blessures, offres surprises, boxeur qui renégocie, champion qui t'évite), anciens boxeurs qui reviennent.
9. **Chapitre de saison** : objectifs + récompenses cosmétiques datées de la saison, même méta pour tous.
10. **Rapport de vérification** (section 11) avec chiffres tirés de la simulation + liste honnête du reste.

## Hors limite (rappel)
Aucun input pendant un combat de carrière · aucune énergie en Classé · rien d'acheté qui donne des stats ·
aucun asset « IA » · ne pas toucher aux rangs/badges/cadres ni au contrôle en ligne.
