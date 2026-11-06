// Outils partagés des tests de parité.
export const SEED = 12345;

/** Remplace Math.random par mulberry32 (graine fixe) avant le chargement du jeu. */
export async function seedRandom(page, seed = SEED) {
  await page.addInitScript((s) => {
    let a = s >>> 0;
    Math.random = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }, seed);
}

/** Collecte les erreurs console et les exceptions non attrapées. */
export function collectErrors(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

/** Ouvre le jeu, choisit la langue et ferme l'intro ; arrive au menu principal. */
export async function bootToMenu(page, lang = 'fr') {
  await page.goto('/');
  await page.locator(`#langpick button[data-l="${lang}"]`).click();
  const splash = page.locator('#splash');
  if (await splash.count()) await splash.click({ force: true }).catch(() => {});
  await page.locator('#splash').waitFor({ state: 'detached' });
  await page.locator('[data-a="m_new"]').waitFor();
}

/** Crée une carrière « Test Gym », Canada, Normal, deux premiers boxeurs. */
export async function newCareer(page) {
  await page.locator('[data-a="m_new"]').click();
  await page.locator('#ng-club').fill('Test Gym');
  await page.locator('[data-a="m_ngc"]').click();
  await page.locator('[data-a="m_nat"][data-k="CA"]').click();
  await page.locator('[data-a="m_nat"][data-k="CA"][aria-pressed="true"]').waitFor();
  await page.locator('[data-a="m_ngd"]').click();
  await page.locator('[data-a="m_diff"][data-k="normal"]').click();
  await page.locator('[data-a="m_diff"][data-k="normal"][aria-pressed="true"]').waitFor();
  await page.locator('[data-a="m_ng2"]').click();
  await page.locator('[data-a="m_pick"][data-k="0"]').click();
  await page.locator('[data-a="m_pick"][data-k="0"][aria-pressed="true"]').waitFor();
  await page.locator('[data-a="m_pick"][data-k="1"]').click();
  await page.locator('[data-a="m_pick"][data-k="1"][aria-pressed="true"]').waitFor();
  await page.locator('[data-a="m_go"]').click();
  await page.locator('[data-a="next"]').waitFor();
}
