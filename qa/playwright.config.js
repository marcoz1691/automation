// 04 · Automatización — Playwright (UI + a11y). Perf (k6) y seguridad (ZAP) viven en perf/ y security/.
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.QA_PORT || 4173);
const external = Boolean(process.env.BASE_URL); // ambiente efímero ya levantado (docker compose / preview)

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // un reintento permite al triage distinguir flaky de fallo real
  workers: process.env.CI ? 2 : undefined,
  outputDir: './test-results',
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/playwright.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: external
    ? undefined
    : {
        // Servidor de desarrollo de Vite: sirve web/js/config.js sin empaquetar, lo que permite inyectar los datos seed.
        command: `npm --prefix ../web run dev -- --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
