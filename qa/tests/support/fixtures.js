import { test as base, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { LandingPage } from '../pages/landing.page.js';

const baseSeed = JSON.parse(readFileSync(new URL('../../seed/hotmart.json', import.meta.url), 'utf8'));

/** Sirve un config.js conocido en lugar del real (datos seed versionados). */
export async function seedConfig(page, overrides = {}) {
  const cfg = {
    ...baseSeed,
    ...overrides,
    checkoutUrls: { ...baseSeed.checkoutUrls, ...overrides.checkoutUrls },
    whatsappMessages: { ...baseSeed.whatsappMessages, ...overrides.whatsappMessages },
  };
  await page.route('**/js/config.js*', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: `export const config = ${JSON.stringify(cfg)};` })
  );
  return cfg;
}

export const test = base.extend({
  seed: [{}, { option: true }],
  landing: async ({ page, seed }, use) => {
    await seedConfig(page, seed);
    await use(new LandingPage(page));
  },
});

export { expect, baseSeed };
