// Seed de los Playwright Test Agents (planner / generator / healer): deja la página
// en el estado base conocido (datos seed de qa/seed/hotmart.json) antes de explorar.
import { test } from './support/fixtures.js';

test.describe('Seed', () => {
  test('seed', async ({ landing }) => {
    await landing.goto();
  });
});
