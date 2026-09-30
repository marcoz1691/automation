// Trazado a qa/features/navegacion.feature
import { test, expect } from '../support/fixtures.js';

test.describe('Navegación móvil', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('Abrir y cerrar el menú móvil', { tag: ['@AC-06', '@smoke'] }, async ({ landing }) => {
    await landing.goto();
    await expect(landing.mobileNav).toBeHidden();
    await landing.menuToggle.click();
    await expect(landing.mobileNav).toBeVisible();
    await expect(landing.menuToggle).toHaveAttribute('aria-expanded', 'true');
    await landing.menuToggle.click();
    await expect(landing.mobileNav).toBeHidden();
    await expect(landing.menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Elegir un enlace cierra el menú', { tag: ['@AC-06', '@negative'] }, async ({ landing }) => {
    await landing.goto();
    await landing.menuToggle.click();
    await landing.mobileNavLink('Precios').click();
    await expect(landing.mobileNav).toBeHidden();
    await expect(landing.menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(landing.section('precios')).toBeInViewport();
  });
});

test.describe('Navegación escritorio', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const [enlace, seccion] of [
    ['Método', 'metodo'],
    ['Contenido', 'contenido'],
    ['Precios', 'precios'],
    ['FAQ', 'faq'],
  ]) {
    test.describe(`ejemplo: ${enlace}`, () => {
    test('Los enlaces internos llevan a su sección', { tag: ['@AC-07'] }, async ({ landing }) => {
      await landing.goto();
      await landing.headerLink(enlace).click();
      const section = landing.section(seccion);
      await expect(section).toBeInViewport();
      // Queda bajo el header fijo, no tapada por él (tolerancia de 2 px por redondeo).
      await expect
        .poll(
          async () => {
            const top = await section.evaluate((el) => el.getBoundingClientRect().top);
            const headerBottom = await landing.header.evaluate((el) => el.getBoundingClientRect().bottom);
            return Math.round(top - headerBottom);
          },
          { message: `la sección #${seccion} queda tapada por el header fijo (px de solapamiento negativos)` }
        )
        .toBeGreaterThanOrEqual(-2);
    });
    });
  }
});
