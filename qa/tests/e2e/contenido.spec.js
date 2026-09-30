// Trazado a qa/features/contenido.feature
import { test, expect } from '../support/fixtures.js';

test.describe('Contenido y conversión', () => {
  test('La sección de precios muestra ambas ediciones', { tag: ['@AC-04', '@smoke'] }, async ({ landing }) => {
    await landing.goto();
    await landing.pricing.scrollIntoViewIfNeeded();
    await expect(landing.pricingCard('Edición Esencial')).toContainText('USD 17');
    await expect(landing.pricingCard('Edición Completa')).toContainText('USD 29');
  });

  test('Abrir una pregunta frecuente', { tag: ['@AC-05'] }, async ({ landing }) => {
    await landing.goto();
    for (const q of await landing.faqQuestions.all()) await expect(q).toHaveAttribute('aria-expanded', 'false');
    await landing.faqQuestions.nth(0).click();
    await expect(landing.faqQuestions.nth(0)).toHaveAttribute('aria-expanded', 'true');
  });

  test('Abrir otra pregunta cierra la anterior', { tag: ['@AC-05', '@negative'] }, async ({ landing }) => {
    await landing.goto();
    await landing.faqQuestions.nth(0).click();
    await landing.faqQuestions.nth(1).click();
    await expect(landing.faqQuestions.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(landing.faqQuestions.nth(1)).toHaveAttribute('aria-expanded', 'true');
  });

  test('Pulsar la pregunta abierta la cierra', { tag: ['@AC-05', '@negative'] }, async ({ landing }) => {
    await landing.goto();
    await landing.faqQuestions.nth(0).click();
    await landing.faqQuestions.nth(0).click();
    for (const q of await landing.faqQuestions.all()) await expect(q).toHaveAttribute('aria-expanded', 'false');
  });
});
