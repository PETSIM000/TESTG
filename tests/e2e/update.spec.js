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
