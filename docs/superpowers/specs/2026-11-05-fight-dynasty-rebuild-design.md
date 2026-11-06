# FIGHT DYNASTY — Transformation du build « Boxing Manager »

Date : 2026-11-05. Auteur du design : Max (décisions), Claude Code (rédaction).
Documents de référence (source de vérité du produit) :
`Desktop\FIGHT DYNASTY\brief-fight-dynasty-2026-11-05.md` et
`Desktop\FIGHT DYNASTY\plan-execution-fight-dynasty-2026-11-05.md`.
Ce document ne répète pas le brief : il décrit **comment** on transforme le code existant pour livrer ce brief.

## 1. Intention

Le jeu actuel (« Boxing Manager », repo `PETSIM000/TESTG`) marche : carrière complète, combats, clubs,
légendes, tutoriel, mode en ligne, FR/EN. Mais il a été bâti vite : tout tient dans un seul `index.html`
de ~885 Ko (≈ 4 000 lignes de JS dans un seul bloc `<script>`), sans structure, sans tests, et
chaque changement risque d'en casser un autre.

Max veut **transformer** ce jeu — pas repartir de zéro — en **FIGHT DYNASTY**, un jeu mobile qui a
l'air et la sensation d'un jeu de studio pro, en suivant les 8 phases de son plan d'exécution.

## 2. Objectifs

1. Le nom « Boxing Manager » disparaît partout (titre, manifest, écrans, textes FR/EN, icônes). Le jeu s'appelle FIGHT DYNASTY, studio 10 Count Games.
2. Le code devient un vrai projet organisé, sur lequel on peut empiler la 3D, Capacitor et les stores sans tout casser.
3. Les 8 phases du plan sont livrées dans l'ordre, une à la fois, chacune vérifiée par Slime dans le build avant la suivante.
4. Les skills gamedev installés guident chaque domaine (voir §6).

## 3. Non-objectifs

- Pas de réécriture complète ni de changement de framework (pas de React, pas de Godot). Godot reste un plan B seulement (brief §12).
- Pas de sortie web publique : Vercel sert d'hébergement de développement et de test, pas de lancement (brief §12).
- L'étape R ne vise pas à garder l'apparence actuelle. Max (2026-11-05) : « pas grave si ça change, je veux qu'il soit mieux — l'UI est très très simple, je veux la meilleure UI ». L'étape R garde seulement le **fonctionnement** (règles, parcours, sauvegardes, en ligne) ; l'apparence est refaite au complet en Phase 1.

## 4. Anti-objectifs (échec même si « ça marche »)

- Un résultat qui a le « look IA » (les 5 règles du brief §11).
- Du code « bricolé » : Max exige un build fait comme par des pros (structure, tests, revues, aucun raccourci).
- Un jeu qui ne tourne pas sur les vieux téléphones (voir « Téléphones » au §5).
- Le classé qui se laisse acheter (brief §8).
- Un envoi sur `main` sans l'accord de Max : Vercel déploie `main` automatiquement.

## 5. Le comment — décidé

### Étape R — Restructuration (avant la Phase 1)

Décision de Max : on transforme le jeu existant. Proposition de Claude, acceptée par Max le 2026-11-05 :
découper le fichier unique en vrai projet.

- **Outil de build : Vite.** Le jeu reste en JavaScript « vanilla » (le code actuel manipule le DOM directement, sans framework). Modules ES, un dossier par domaine : `src/combat/`, `src/career/`, `src/economy/`, `src/online/`, `src/club/`, `src/legends/`, `src/ui/`, `src/i18n/`, `src/three/`, `src/styles/`.
- **three.js** passe de `vendor/three.min.js` au paquet npm `three`.
- **Tests :** Vitest sur la logique pure (moteur de combat, cartes des juges, économie, récupération, règles de carrière). C'est ce qui rendra les bugs de la Phase 2 vérifiables.
- **Parité fonctionnelle seulement :** à la fin de l'étape R, le jeu fait la même chose qu'avant (l'apparence peut bouger). On le vérifie en jouant les mêmes parcours que le playtest du 2026-11-04 (carrière année 1 → 2, une partie en ligne).
- **Sauvegardes :** Max est le seul joueur aujourd'hui (confirmé le 2026-11-05) : aucune sauvegarde existante à protéger, on peut renommer les clés `cr_*` / `bm_*` librement. À partir de maintenant, chaque sauvegarde porte un numéro de version de schéma avec migration (skill `save-systems`), pour les futurs joueurs.
- **Service worker / mise à jour :** on garde le mécanisme actuel (`sw.js` + `version.json` + bannière « Jeu mis à jour »), adapté à la sortie de Vite.

### Hébergement

- Le jeu est aujourd'hui servi à deux adresses : GitHub Pages (`petsim000.github.io/TESTG`, branche `gh-pages`, adresse codée en dur une fois dans `index.html`) et Vercel (`testg-two.vercel.app`).
- **Vercel devient l'unique hébergement** (choix de Claude ; aucun joueur à protéger). GitHub Pages est désactivé et l'adresse codée en dur remplacée, à l'étape R.

### Backend

- **Supabase est le seul serveur, Nakama est retiré du plan** (Max, 2026-11-05 : « actuellement le serveur en ligne c'est Supabase, on va build petit par petit »). La Phase 5 du plan (matchmaking, classements mondiaux, autorité serveur, anti-triche, temps réel partout) se fait avec Supabase : fonctions Postgres, Realtime, Edge Functions si besoin. Nakama ne revient que si Supabase atteint une limite mesurée.
- Vercel (projet lié à `PETSIM000/TESTG`) et Supabase (projet `hlqhasvorjdutyhyibao`) restent en place.
- **Accès à Supabase :** Max autorise la connexion par l'extension Supabase de Claude Code (2026-11-05).
- Le jeu parle à Supabase uniquement par des fonctions RPC `cr_*` (connexion maison avec jeton de 64 caractères, sauvegardes, combats en ligne `cr_ob_*`, quêtes, boutique, rangs, nouvelles, push). La clé dans le client est la clé publique (`sb_publishable_…`), c'est normal.
- **Le SQL de ces fonctions n'est pas dans le repo.** On l'extrait de Supabase et on le versionne dans `supabase/migrations/` avant de toucher au backend.

### Téléphones

Exigence de Max : le jeu doit être **jouable sur n'importe quel téléphone**, et tourner mieux sur les récents.
Donc : des niveaux de qualité automatiques (bas / moyen / haut) choisis au démarrage selon l'appareil et ajustés si les fps chutent, avec réglage manuel dans les options. Bas = 2D ou 3D très allégée, 30 fps acceptés. Haut = 3D complète à 60 fps. Téléphone de référence pour le niveau « haut » : Samsung Galaxy A54 ou équivalent (choix de Claude).

### Bugs (Phase 2)

Source : `Desktop\FIGHT DYNASTY\rapport-playtest-fight-dynasty-2026-11-04.md`. La Phase 2 couvre **tous** les bugs B1 à B22, plus B23 et B24 du plan, dans l'ordre de priorité du rapport (B1-B5 d'abord). Chaque bug corrigé reçoit un test qui le reproduit quand c'est de la logique pure.

### Façon de travailler

- **Qui approuve :** Max approuve chaque fusion sur `main`. Slime vérifie dans les aperçus Vercel.
- On travaille sur des branches. Chaque branche produit un déploiement de prévisualisation Vercel : c'est là que Slime vérifie.
- On ne fusionne sur `main` qu'avec l'accord de Max.
- Le repo est public : aucun secret, aucune clé `service_role`, aucun fichier Mixamo ou Meshy brut dans le repo (brief §11, plan Phase 3).

### Logo

L'image `9fd5b7bb-….jpg` (écusson rouge/or, gant couronné, lauriers, « MOBILE BOXING MANAGEMENT ») est la **référence**.
Elle est redessinée en vectoriel (SVG) propre : formes nettes, texte rendu par le moteur, déclinée en icône d'app
(192/512/180), écran de démarrage et en-tête. Elle sert d'ancre à la charte visuelle de la Phase 1.

### Ordre de livraison

Étape R → Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8, avec le contenu, les « fini quand » et les règles du plan d'exécution.
Le renommage en FIGHT DYNASTY se fait au début de la Phase 1, avec la charte.

**Phase 1 élargie (Max, 2026-11-05) :** pas seulement les badges et cadres — **toute l'interface** est refaite selon la charte, écran par écran, au niveau des meilleurs jeux mobiles (navigation, en-tête, cartes, transitions, retours tactiles, textes courts B24). Les idées du brief et du plan (profil style Clash Royale, deck de combattants, peak ELO, rangs animés, saison sur le cadre) entrent dans cette refonte quand l'écran concerné est refait.

## 6. Les skills par domaine

| Domaine | Skills |
|---|---|
| Charte, badges, cadres, logo, icônes | `create-game-assets`, `game-ui-ux` |
| Écrans, HUD, mobile étroit (B24) | `game-ui-ux`, `input-systems` |
| 3D aréna, boxeurs, éclairage | `threejs-scene-setup`, `threejs-materials-lighting`, `threejs-gltf-loading` |
| Polish (ralentis K.O., screen shake, particules) | `game-feel`, `camera-systems` |
| Économie, carrière, sauvegardes | `save-systems` |
| IA des adversaires / bots | `game-ai`, `ai-behavior-trees-utility-ai` |
| Performance 60 fps mobile | `performance-optimization` |
| Son | `audio-design` |

## 7. Décidé au début de leur phase (choix de Claude)

- **3D :** en carrière on regarde le combat ; en ligne on le joue (brief : carrière = gérer, en ligne = fighter). Le rendu three.js actuel (combat en direct, reprises) est la base, refaite en Phase 3.
- **Phase 1 sans les badges « glossy » :** ils ne sont pas dans le dossier. La charte part du logo comme ancre de style ; si Max retrouve les badges, ils s'ajoutent comme référence.
- **Phase 6 :** RevenueCat ne fonctionne que dans l'app native ; l'achat test se fait donc après un premier emballage Capacitor de test, ou en mode bac à sable. À trancher au début de la Phase 6.
- **Modèles 3D :** hébergés hors du repo public (stockage privé). À trancher au début de la Phase 3, avec Max qui ouvre le plan Meshy Pro.
- **Idées signature de carrière** (purse bids, ères, héritage…) : intégrées quand Max aura fait ses choix ; l'économie de la Phase 2 est construite pour les accueillir.

## 8. Laissé au constructeur

- Le découpage exact en fichiers et les noms des modules.
- La forme des tests et des fixtures.
- L'ordre interne des tâches à l'intérieur d'une phase.
