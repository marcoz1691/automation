// Trazado a qa/features/checkout.feature — cada test se llama igual que su escenario.
import { test, expect, baseSeed } from '../support/fixtures.js';

const EDITIONS = ['esencial', 'completa'];
const waUrl = (digits, edition) => `https://wa.me/${digits}?text=${encodeURIComponent(baseSeed.whatsappMessages[edition])}`;

test.describe('Checkout', () => {
  test('Con Hotmart configurado cada botón abre el pago de su edición', { tag: ['@AC-01', '@smoke'] }, async ({ landing }) => {
    await landing.goto();
    for (const edition of EDITIONS) {
      const buttons = landing.checkoutButtons(edition);
      expect(await buttons.count()).toBeGreaterThan(0);
      for (const href of await landing.checkoutHrefs(edition)) {
        expect(href).toBe(baseSeed.checkoutUrls[edition]);
      }
      for (const btn of await buttons.all()) {
        await expect(btn).toHaveAttribute('target', '_blank');
        await expect(btn).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  test.describe('solo Completa en Hotmart', () => {
    test.use({ seed: { checkoutUrls: { esencial: '' } } });

    test('Solo una edición tiene link de Hotmart', { tag: ['@AC-01', '@AC-02', '@negative'] }, async ({ landing }) => {
      await landing.goto();
      for (const href of await landing.checkoutHrefs('completa')) expect(href).toBe(baseSeed.checkoutUrls.completa);
      for (const href of await landing.checkoutHrefs('esencial')) expect(href).toBe(waUrl('593987654321', 'esencial'));
    });
  });

  test.describe('sin links de Hotmart', () => {
    test.use({ seed: { checkoutUrls: { esencial: '  ', completa: '' } } });

    test('Sin links de Hotmart todo cae a WhatsApp', { tag: ['@AC-02', '@negative'] }, async ({ landing }) => {
      await landing.goto();
      for (const edition of EDITIONS) {
        for (const href of await landing.checkoutHrefs(edition)) expect(href).toBe(waUrl('593987654321', edition));
      }
    });
  });

  for (const [numero, digitos] of [
    ['593987654321', '593987654321'],
    ['+593 98 765 4321', '593987654321'],
    ['(593) 98-765-4321', '593987654321'],
  ]) {
    test.describe(`WhatsApp ${numero}`, () => {
      test.use({ seed: { paymentMode: 'whatsapp', whatsappNumber: numero } });

      test(`El modo WhatsApp ignora los links de Hotmart`, { tag: ['@AC-02', '@negative'] }, async ({ landing }) => {
        await landing.goto();
        for (const edition of EDITIONS) {
          for (const href of await landing.checkoutHrefs(edition)) expect(href).toBe(waUrl(digitos, edition));
        }
      });
    });
  }

  test.describe('CTA fijo en móvil', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

    test('El CTA fijo aparece al hacer scroll', { tag: ['@AC-03'] }, async ({ landing }) => {
      await landing.goto();
      await expect(landing.stickyCta).toHaveAttribute('aria-hidden', 'true');
      await landing.scrollTo(600);
      await expect(landing.stickyCta).toHaveAttribute('aria-hidden', 'false');
      await expect(landing.stickyCta).toHaveClass(/is-visible/);
      await expect(landing.stickyCtaButton).toHaveAttribute('href', baseSeed.checkoutUrls.completa);
    });

    test('Valor límite — con 400 px exactos el CTA sigue oculto', { tag: ['@AC-03', '@negative'] }, async ({ landing }) => {
      await landing.goto();
      await landing.scrollTo(400);
      await expect(landing.stickyCta).toHaveAttribute('aria-hidden', 'true');
      await expect(landing.stickyCta).not.toHaveClass(/is-visible/);
    });
  });
});
