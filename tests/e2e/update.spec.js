import { test, expect } from '@playwright/test';

test('version.json correspond au build chargé', async ({ page, request }) => {
  await page.goto('/');
  const build = await page.evaluate(() => window.BUILD);
  const v = await (await request.get('/version.json')).json();
  expect(v.v).toBe(build);
});

test('le service worker précharge les fichiers hachés du build', async ({ request, page }) => {
  await page.goto('/');
  const build = await page.evaluate(() => window.BUILD);
  const sw = await (await request.get('/sw.js')).text();
  expect(sw).toContain(`fd-${build}`);
  const scripts = await page.locator('script[type="module"][src]').evaluateAll((s) => s.map((x) => x.getAttribute('src').replace(/^\.\//, '')));
  for (const src of scripts) expect(sw).toContain(src);
});

test('une nouvelle version affiche la bannière de mise à jour', async ({ page }) => {
  await page.route('**/version.json*', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ v: 'nouvelle', m: 'Test' }) }));
  await page.goto('/');
  await expect(page.locator('#updbar')).toBeVisible({ timeout: 10_000 });
});

test('le bouton Mettre à jour recharge le jeu sans erreur', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/version.json*', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ v: 'nouvelle', m: 'Test' }) }));
  await page.addInitScript(() => localStorage.setItem('bm_lang', 'fr'));
  await page.goto('/');
  await page.locator('#splash').click({ force: true }).catch(() => {});
  await page.locator('#splash').waitFor({ state: 'detached' });
  const btn = page.locator('#updbar button').first();
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await Promise.all([page.waitForEvent('load'), btn.click()]);
  expect(errors).toEqual([]);
});
