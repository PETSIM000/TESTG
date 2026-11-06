import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5178';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  workers: 2,
  reporter: [['list']],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  use: { baseURL: BASE_URL, serviceWorkers: 'block', locale: 'fr-CA' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'small', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 740 } } },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: process.env.WEB_CMD || 'npm run build && npm run preview',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
