// Trazado a qa/features/no-funcionales.feature (AC-08)
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../support/fixtures.js';

const DEVICES = {
  escritorio: { viewport: { width: 1280, height: 800 } },
  'móvil': { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

for (const [dispositivo, options] of Object.entries(DEVICES)) {
  test.describe(dispositivo, () => {
    test.use(options);

    test('Sin violaciones serias de accesibilidad', { tag: ['@AC-08', '@smoke', '@a11y'] }, async ({ landing, page }, testInfo) => {
      await landing.goto();
      // Las secciones aparecen con scroll-reveal: las mostramos para analizar el contenido final.
      // Sin transiciones, para que axe no mida colores a mitad de una animación.
      await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')));
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      await testInfo.attach('axe-results.json', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
      const serious = results.violations
        .filter((v) => ['serious', 'critical'].includes(v.impact))
        .map((v) => `${v.impact} · ${v.id}: ${v.help} (${v.nodes.length} nodos) — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`);
      expect(serious, serious.join('\n')).toEqual([]);
    });
  });
}
