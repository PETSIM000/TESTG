# Étape R — Restructuration du build en projet Vite : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le fichier unique `index.html` (~885 Ko) en projet Vite organisé par domaine, testé, déployé sur Vercel — sans aucun changement visible pour le joueur.

**Architecture:** Migration « étrangleur » : on fige d'abord le comportement actuel avec des tests de bout en bout et des captures d'écran de référence, puis on déplace le code par couches (assets → CSS → JS en un seul module → modules par domaine). Chaque déplacement doit garder les tests de parité au vert. La logique pure (moteur, combat, économie) reçoit des tests unitaires avec un générateur aléatoire injectable.

**Tech Stack:** Node 24, Vite 6, JavaScript vanilla (modules ES), three@0.149.0 (même révision r149 que `vendor/three.min.js`), Vitest, Playwright Test, Vercel, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-05-fight-dynasty-rebuild-design.md` (et le brief / plan d'exécution de Max dans `Desktop\FIGHT DYNASTY\`).

## Global Constraints

- Aucun changement de gameplay pendant l'étape R. L'apparence peut bouger (Max : « pas grave si ça change ») : les captures d'écran servent de repère visuel pour repérer un écran cassé, pas de contrat pixel près. La refonte UI complète se fait en Phase 1.
- Pas de framework UI (pas de React/Vue). Le système d'événements `data-a=` existant est conservé.
- three.js épinglé à `0.149.0` tant que la Phase 3 ne le met pas à jour.
- Travail sur la branche `restructure`. Aucun envoi sur `main` sans l'accord explicite de Max.
- Repo public : aucun secret. Seule la clé `sb_publishable_…` (publique par conception) peut rester dans le client.
- Vercel = unique hébergement final. GitHub Pages est désactivé seulement après validation de Vercel par Max.
- Les commits se terminent par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Mode strict des modules ES : le code actuel tourne en script classique ; une affectation à une variable non déclarée ou un `this` global plante en module. Attendu : aucune erreur console sur les parcours de parité (Task 4 vérifie la console).
2. Gestionnaires `onclick="setLang(...)"` / `openFB()` inline et `typeof openMenu==='function'` du bloc Capacitor : en module, ces noms ne sont plus globaux. Attendu : changer de langue et ouvrir l'avis marchent toujours (test e2e en Task 4).
3. Service worker qui sert une vieille version : après un déploiement, le joueur doit recevoir le nouveau build (bannière « Jeu mis à jour »). Attendu : `version.json` et le nom du cache changent à chaque build (test en Task 7).
4. Écran mobile étroit (390 × 844) et petit téléphone (360 × 740) : aucun écran vide ou cassé pendant la migration (captures de Task 1 regardées à chaque tâche ; un écart n'échoue pas le test, un élément attendu absent oui).
5. Hasard non reproductible : sans graine, les tests du moteur deviennent instables. Attendu : même graine ⇒ même combat (test en Task 5).

---

## Structure des fichiers (cible de fin d'étape R)

```
index.html                 # coquille HTML seulement (markup des conteneurs + splash)
public/                    # copié tel quel : fonts/, icons/, manifest.webmanifest
src/main.js                # point d'entrée : importe styles + modules, démarre le jeu
src/styles/                # base.css, game.css, online.css (découpage des 3 blocs <style>)
src/core/rng.js            # générateur aléatoire injectable (graine)
src/core/state.js          # état partagé mutable (remplace les `let` globaux)
src/core/utils.js          # section OUTILS
src/i18n/                  # langue FR/EN + table I18N_EN
src/data/                  # DONNÉES, PAYS, PROMOTIONS
src/engine/                # MOTEUR BOXEURS, MONDE, CIRCUIT AMATEUR, COMBAT
src/career/                # ceintures, installations, camp, galas, tournois, contrats, négociations, investir, carrière, rivaux, super série
src/online/                # MODE EN LIGNE, combat en direct, profils, clubs, légendes, boutique, push, nuage
src/ui/                    # RENDU, ÉVÉNEMENTS, MENU, VUES, tutoriel, en-tête, glisser-retour
src/three/                 # rendu 3D (combat en direct, reprises, entrées)
src/boot/                  # splash + logo, mise à jour (version.json), pont Capacitor
tests/unit/                # Vitest
tests/e2e/                 # Playwright (parité)
scripts/                   # génération sw.js / version.json au build
supabase/migrations/       # SQL des fonctions cr_* (Task 8)
```

---

### Task 1: Filet de sécurité — tests de parité sur le build actuel

**Files:**
- Create: `package.json`, `playwright.config.js`, `tests/e2e/parity.spec.js`, `.gitignore`

**Interfaces:**
- Produces: script npm `test:e2e` ; variable d'env `BASE_URL` (défaut `http://localhost:5178`) ; captures de référence dans `tests/e2e/parity.spec.js-snapshots/`.

- [ ] **Step 1:** Créer la branche `restructure` depuis `main`, y committer le design et ce plan.
- [ ] **Step 2:** `package.json` (`"type": "module"`, `private: true`) avec devDependencies `@playwright/test`, `http-server` ; script `serve:legacy` = `http-server . -p 5178 -c-1 --silent` ; `test:e2e` = `playwright test`. `npx playwright install chromium`.
- [ ] **Step 3:** `playwright.config.js` : deux projets `mobile` (390 × 844, `hasTouch`, `isMobile`) et `small` (360 × 740) ; `webServer` lance `serve:legacy` quand `BASE_URL` n'est pas fourni ; `expect.toHaveScreenshot` avec `maxDiffPixelRatio: 0.01`, animations désactivées ; service workers bloqués (`serviceWorkers: 'block'`).
- [ ] **Step 4:** Écrire `tests/e2e/parity.spec.js`. Avant chaque test : `page.addInitScript` qui fige `Math.random` sur un générateur à graine fixe (mulberry32, graine `12345`) et `Date.now` à `2026-11-05T12:00:00Z`, et vide `localStorage`. Tests :
  - `boot: écran de langue visible, zéro erreur console` — attend `text=Choisis ta langue` ; console error + `pageerror` ⇒ tableau vide.
  - `langue: Français puis intro passée mène au menu` — clique `Français`, passe le splash, attend le menu principal ; capture `menu.png`.
  - `carrière: création 4 étapes puis tableau de bord` — Nouvelle carrière → Club « Test Gym » → Canada → Normal → boxeurs par défaut ; capture `career-home.png`.
  - `carrière: avancer une semaine change la semaine affichée`.
  - `carrière: sauvegarde rechargée` — recharge la page, Continuer ⇒ même club et même semaine.
  - `en ligne: écran de connexion s'affiche` — menu → En ligne ⇒ formulaire de connexion visible.
  - `langue: English bascule les textes` — un libellé connu du menu passe en anglais.
  Les sélecteurs exacts se lisent dans le DOM du build (`data-a=` des boutons).
- [ ] **Step 5:** Run `npx playwright test --update-snapshots` puis `npx playwright test` deux fois. Expected : PASS les deux fois. Un test instable est stabilisé (attendre l'état) avant de continuer.
- [ ] **Step 6:** Commit `test: filet de parité e2e sur le build actuel`.

### Task 2: Vite sert le jeu tel quel

**Files:**
- Create: `vite.config.js`, `public/` (déplacer `fonts/`, `icons/`, `manifest.webmanifest`, `sw.js`, `version.json`, `vendor/`)
- Modify: `package.json`, `playwright.config.js`

**Interfaces:**
- Produces: scripts `dev` (`vite --port 5178`), `build` (`vite build`), `preview` (`vite preview --port 5178`) ; sortie `dist/`.

- [ ] **Step 1:** Installer `vite`. `vite.config.js` : `base: './'`, `build.outDir: 'dist'`, `build.assetsInlineLimit: 0`.
- [ ] **Step 2:** `git mv` des assets statiques dans `public/` (mêmes chemins publics). Les `<script>` inline restent dans `index.html` ; `vendor/three.min.js` reste chargé en script classique.
- [ ] **Step 3:** `playwright.config.js` : `webServer` = `npm run build && npm run preview`.
- [ ] **Step 4:** Run `npm run build` (Expected : `dist/index.html` sans erreur) puis `npx playwright test` (Expected : PASS, captures identiques).
- [ ] **Step 5:** Commit `build: Vite sert le jeu sans changement`.

### Task 3: CSS sortis du HTML

**Files:**
- Create: `src/main.js`, `src/styles/base.css` (bloc ligne 7), `src/styles/game.css` (bloc lignes 12-622), `src/styles/online.css` (bloc lignes 654-681)
- Modify: `index.html` (retirer les `<style>`, ajouter `<script type="module" src="/src/main.js">`)

- [ ] **Step 1:** Déplacer chaque bloc `<style>` à l'identique, dans le même ordre, importés depuis `src/main.js`.
- [ ] **Step 2:** Run `npm run build && npx playwright test`. Expected : PASS, captures identiques.
- [ ] **Step 3:** Commit `refactor: CSS dans src/styles`.

### Task 4: JS sorti du HTML en modules ES

**Files:**
- Create: `src/game/legacy.js` (i18n lignes 682-732 + bloc principal lignes 768-4839), `src/boot/splash.js` (bloc 733-762 : `bmLogo` + splash), `src/boot/native.js` (bloc 4841-4849 Capacitor), `src/boot/update.js` (bloc 4850-4854 : BUILD, service worker, `checkUpd`)
- Modify: `index.html` (ne garde que le markup), `src/main.js`, `package.json` (dépendance `three@0.149.0`)
- Test: `tests/e2e/parity.spec.js`

**Interfaces:**
- Produces: `src/game/legacy.js` exporte `start(): void` ; tout nom utilisé hors du module (`setLang`, `openFB`, `openMenu`, `checkUpd`) est exporté et importé là où il sert — aucun nouveau `window.*`, sauf `window.BUILD` / `window.BUILD_MSG` existants.
- `src/boot/splash.js` exporte `bmLogo(ctx, cx, cy, R, opts)` (aussi utilisé par la section « logo Boxing Manager » ligne 3560).

- [ ] **Step 1:** Ajouter le test `aucune erreur console sur tout le parcours carrière + en ligne`. Run : PASS sur l'état actuel.
- [ ] **Step 2:** Remplacer les 6 `onclick=` inline (lignes 3227, 4320, 4578) par des `data-a=` traités par le répartiteur existant (`setlangfr`, `setlangen`, `openfb`).
- [ ] **Step 3:** Déplacer les blocs JS. Remplacer `<script src="vendor/three.min.js">` par `import * as THREE from 'three'` dans les modules qui l'utilisent ; supprimer `public/vendor/`.
- [ ] **Step 4:** Run `npm run build && npx playwright test`. Corriger chaque erreur de mode strict jusqu'à PASS, captures identiques.
- [ ] **Step 5:** Commit `refactor: JS en modules ES, three via npm`.

### Task 5: Moteur pur et hasard injectable (tests unitaires)

**Files:**
- Create: `src/core/rng.js`, `src/core/utils.js`, `src/data/*.js`, `src/engine/boxers.js`, `src/engine/world.js`, `src/engine/amateur.js`, `src/engine/combat.js`, `tests/unit/rng.test.js`, `tests/unit/combat.test.js`, `vitest.config.js`
- Modify: `src/game/legacy.js` (sections DONNÉES, PAYS, PROMOTIONS, OUTILS, MOTEUR BOXEURS, CIRCUIT AMATEUR, MOTEUR MONDE, COMBAT — lignes ~805-1440 de l'ancien fichier)

**Interfaces:**
- Produces: `createRng(seed: number): () => number` (mulberry32, valeurs dans [0, 1)) ; `setRng(fn: () => number): void` et `rnd(): number` dans `src/core/rng.js`. Le moteur utilise `rnd()` au lieu de `Math.random`. Par défaut `rnd` délègue à `Math.random`.
- Les fonctions du moteur gardent leurs noms actuels.

- [ ] **Step 1:** Tests `rng.test.js` : `createRng(1)` deux fois ⇒ mêmes 100 valeurs ; toutes dans [0, 1) ; `createRng(2)` diffère.
- [ ] **Step 2:** Run `npx vitest run` — Expected FAIL (module absent). Implémenter. Expected PASS.
- [ ] **Step 3:** Déplacer les sections listées ; `Math.random` ⇒ `rnd()` dans le moteur uniquement.
- [ ] **Step 4:** Tests `combat.test.js` (comportement ACTUEL, bugs compris — corrigés en Phase 2) : avec `setRng(createRng(42))`, un combat entre deux boxeurs générés ⇒ résultat valide (vainqueur ∈ {A, B, nul}, 3 cartes de juges, rounds ≤ prévus) ; même graine ⇒ résultat identique (`toEqual`) ; sur 20 graines, au moins deux résultats différents.
- [ ] **Step 5:** Run `npx vitest run && npm run build && npx playwright test`. Expected PASS partout.
- [ ] **Step 6:** Commit `refactor: moteur en modules, hasard injectable, tests unitaires`.

### Task 6: Découpage du reste par domaine + état partagé

**Files:**
- Create: `src/core/state.js`, `src/i18n/*.js`, `src/career/*.js`, `src/online/*.js`, `src/ui/*.js`, `src/three/*.js`, `eslint.config.js`
- Modify / Delete: `src/game/legacy.js` (vidé au fil de la tâche, supprimé à la fin)

**Interfaces:**
- Produces: `src/core/state.js` exporte `export const S = {...}` qui porte chaque variable de niveau supérieur réassignée depuis plusieurs sections (ex. `ON`). Les modules lisent/écrivent `S.ON`. Les constantes restent des `export const` dans leur module.

- [ ] **Step 1:** Inventorier les `let` de niveau supérieur réassignés depuis plusieurs sections ⇒ champs de `S`.
- [ ] **Step 2:** Déplacer une couche à la fois, `npm run build && npx playwright test` au vert après CHAQUE couche, un commit par couche : `i18n` → `career` → `online` → `three` → `ui`.
- [ ] **Step 3:** Supprimer `src/game/legacy.js`. ESLint (`no-undef`, `no-unused-vars`), script `lint`. Expected : `npm run lint` sans erreur.
- [ ] **Step 4:** Commit final `refactor: code découpé par domaine`.

### Task 7: Déploiement Vercel, service worker et version

**Files:**
- Create: `scripts/gen-sw.js`, `tests/e2e/update.spec.js`
- Modify: `vite.config.js` (plugin fin de build), `vercel.json`, `src/boot/update.js`, l'URL `petsim000.github.io/TESTG` codée en dur (⇒ `location.origin + location.pathname`)

**Interfaces:**
- Produces: au build, `dist/version.json` = `{ "v": <hash git court>, "m": <sujet du dernier commit> }` et `dist/sw.js` avec `const C='fd-<hash>'` et `FILES` = tous les fichiers de `dist/`.

- [ ] **Step 1:** Test `update.spec.js` : `version.json` servi avec un `v` différent de `window.BUILD` (via `page.route`) ⇒ la bannière de mise à jour apparaît.
- [ ] **Step 2:** Implémenter `gen-sw.js` en gardant le comportement actuel de `sw.js` (navigation réseau d'abord, push, notificationclick). Run : PASS.
- [ ] **Step 3:** `vercel.json` : `buildCommand: "npm run build"`, `outputDirectory: "dist"`, en-têtes `no-cache` sur `sw.js` et `version.json`.
- [ ] **Step 4:** Créer le projet Vercel `fight-dynasty` lié à `PETSIM000/TESTG` (l'ancien `testg-two` répond DEPLOYMENT_NOT_FOUND). Pousser la branche `restructure` ⇒ aperçu. Expected : `BASE_URL=<aperçu> npx playwright test` PASS.
- [ ] **Step 5:** Commit `build: déploiement Vercel et service worker généré`.

### Task 8: SQL Supabase versionné

**Files:**
- Create: `supabase/migrations/20261105000000_baseline_cr_functions.sql`, `supabase/README.md`

- [ ] **Step 1:** Connexion par l'extension Supabase (autorisée par Max). Lister les fonctions `public.cr_*`, les tables et les politiques RLS du projet `hlqhasvorjdutyhyibao`.
- [ ] **Step 2:** Écrire leur définition exacte (`pg_get_functiondef`, DDL des tables, `CREATE POLICY`). Vérifier : aucune donnée de joueur, aucun mot de passe ni jeton dans le fichier.
- [ ] **Step 3:** Chaque `rpc('cr_…')` du client existe dans la migration. Expected : zéro manquant.
- [ ] **Step 4:** Commit `chore: SQL Supabase versionné (base)`.

### Task 9: Intégration continue et passage sur main

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1:** CI sur push et PR : `npm ci`, `npm run lint`, `npx vitest run`, `npm run build`, `npx playwright install --with-deps chromium`, `npx playwright test`.
- [ ] **Step 2:** Pousser ; Expected : CI verte.
- [ ] **Step 3:** PR `restructure` → `main` avec le lien d'aperçu Vercel. **Arrêt : Max et Slime valident l'aperçu.** Fusion seulement sur accord explicite de Max.
- [ ] **Step 4:** Après fusion et vérification de la production Vercel par Max : désactiver GitHub Pages et supprimer `gh-pages` (accord explicite de Max requis).
