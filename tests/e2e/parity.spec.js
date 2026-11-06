import { test, expect } from '@playwright/test';
import { seedRandom, collectErrors, bootToMenu, newCareer } from './helpers.js';

test.beforeEach(async ({ page }) => { await seedRandom(page); });

test('boot: écran de langue visible, zéro erreur console', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('#langpick')).toContainText('Choisis ta langue');
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test('langue: Français puis intro passée mène au menu', async ({ page }) => {
  await bootToMenu(page, 'fr');
  await expect(page.locator('[data-a="m_new"]')).toContainText(/nouvelle carrière/i);
  await expect(page).toHaveScreenshot('menu.png', { mask: [page.locator('canvas')] });
});

test('carrière: création 4 étapes puis tableau de bord', async ({ page }) => {
  await bootToMenu(page);
  await newCareer(page);
  await expect(page.locator('#hdr')).toContainText(/test gym/i);
  await expect(page.locator('#hdr')).toContainText('S1');
  await expect(page.locator('#hdr')).toContainText('25 000');
  await expect(page.locator('[data-a="open"]')).toHaveCount(2);
  await expect(page).toHaveScreenshot('career-home.png');
});

test('carrière: avancer une semaine change la semaine affichée', async ({ page }) => {
  await bootToMenu(page);
  await newCareer(page);
  await page.locator('[data-a="next"]').click();
  await expect(page.locator('#hdr')).toContainText('S2');
});

test('carrière: sauvegarde rechargée', async ({ page }) => {
  await bootToMenu(page);
  await newCareer(page);
  await page.locator('[data-a="next"]').click();
  await expect(page.locator('#hdr')).toContainText('S2');
  await page.reload();
  await page.locator('#splash').click({ force: true }).catch(() => {});
  await page.locator('#splash').waitFor({ state: 'detached' });
  await page.locator('[data-a="m_cont"]').click();
  await expect(page.locator('#hdr')).toContainText(/test gym/i);
  await expect(page.locator('#hdr')).toContainText('S2');
});

test('en ligne: écran de connexion s\'affiche', async ({ page }) => {
  await page.route('**/*.supabase.co/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: 'null' }));
  await bootToMenu(page);
  await page.locator('[data-a="m_online"]').last().click();
  await expect(page.locator('input[type="password"]').first()).toBeVisible();
});

test('langue: English bascule les textes', async ({ page }) => {
  await bootToMenu(page, 'en');
  await expect(page.locator('[data-a="m_new"]')).toContainText(/NEW CAREER/i);
});

test('aucune erreur console sur le parcours carrière + en ligne', async ({ page }) => {
  await page.route('**/*.supabase.co/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: 'null' }));
  const errors = collectErrors(page);
  await bootToMenu(page);
  await newCareer(page);
  for (const t of ['combats', 'rank', 'defis', 'staff', 'club', 'ecurie']) {
    await page.locator(`[data-a="tab"][data-k="${t}"]`).first().click({ force: true });
  }
  await page.locator('[data-a="next"]').click();
  await expect(page.locator('#hdr')).toContainText('S2');
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('langue: le bouton Français/English des réglages change la langue', async ({ page }) => {
  await bootToMenu(page);
  await newCareer(page);
  await page.locator('[data-a="settings"]').click();
  const en = page.locator('[data-gl="en"]').first();
  await en.waitFor();
  await Promise.all([page.waitForEvent('load'), en.click()]);
  await page.locator('#splash').click({ force: true }).catch(() => {});
  await expect.poll(() => page.evaluate(() => localStorage.getItem('bm_lang'))).toBe('en');
});
