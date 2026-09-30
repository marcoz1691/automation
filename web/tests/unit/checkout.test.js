// Unit tests de la lógica de checkout (AC-01, AC-02). Son la base del mutation testing (gate 2).
import { describe, it, expect } from 'vitest';
import { getCheckoutUrl, isHotmartReady } from '../../js/checkout.js';

const base = () => ({
  paymentMode: 'platform',
  checkoutUrls: { esencial: 'https://pay.hotmart.com/E17', completa: 'https://pay.hotmart.com/C29' },
  whatsappNumber: '+593 98-765-4321',
  whatsappMessages: { esencial: 'Quiero la Esencial', completa: 'Quiero la Completa & bonos' },
});

describe('getCheckoutUrl — AC-01 Hotmart', () => {
  it('devuelve el link de Hotmart de cada edición', () => {
    expect(getCheckoutUrl(base(), 'esencial')).toBe('https://pay.hotmart.com/E17');
    expect(getCheckoutUrl(base(), 'completa')).toBe('https://pay.hotmart.com/C29');
  });

  it('recorta espacios del link', () => {
    const cfg = base();
    cfg.checkoutUrls.completa = '  https://pay.hotmart.com/C29  ';
    expect(getCheckoutUrl(cfg, 'completa')).toBe('https://pay.hotmart.com/C29');
  });
});

describe('getCheckoutUrl — AC-02 fallback WhatsApp', () => {
  it('usa WhatsApp si falta el link de la edición, con su propio mensaje', () => {
    const cfg = base();
    cfg.checkoutUrls.esencial = '';
    expect(getCheckoutUrl(cfg, 'esencial')).toBe(`https://wa.me/593987654321?text=${encodeURIComponent('Quiero la Esencial')}`);
    expect(getCheckoutUrl(cfg, 'completa')).toBe('https://pay.hotmart.com/C29');
  });

  it('trata un link solo con espacios como vacío', () => {
    const cfg = base();
    cfg.checkoutUrls.esencial = '   ';
    expect(getCheckoutUrl(cfg, 'esencial')).toMatch(/^https:\/\/wa\.me\//);
  });

  it('usa WhatsApp en modo whatsapp aunque haya links', () => {
    const cfg = { ...base(), paymentMode: 'whatsapp' };
    expect(getCheckoutUrl(cfg, 'completa')).toBe(`https://wa.me/593987654321?text=${encodeURIComponent('Quiero la Completa & bonos')}`);
  });

  it('usa el mensaje de la Completa si la edición no tiene mensaje', () => {
    const cfg = { ...base(), paymentMode: 'whatsapp' };
    expect(getCheckoutUrl(cfg, 'otra')).toBe(`https://wa.me/593987654321?text=${encodeURIComponent('Quiero la Completa & bonos')}`);
  });

  it('funciona si checkoutUrls no tiene la edición', () => {
    const cfg = base();
    cfg.checkoutUrls = {};
    expect(getCheckoutUrl(cfg, 'esencial')).toMatch(/^https:\/\/wa\.me\/593987654321\?text=/);
  });
});

describe('isHotmartReady', () => {
  it('true solo con modo platform y ambos links', () => {
    expect(isHotmartReady(base())).toBe(true);
  });

  it.each([
    ['falta esencial', (c) => (c.checkoutUrls.esencial = '')],
    ['falta completa', (c) => (c.checkoutUrls.completa = '')],
    ['esencial solo espacios', (c) => (c.checkoutUrls.esencial = '  ')],
    ['completa solo espacios', (c) => (c.checkoutUrls.completa = '  ')],
    ['no existe la clave esencial', (c) => delete c.checkoutUrls.esencial],
    ['no existe la clave completa', (c) => delete c.checkoutUrls.completa],
    ['modo whatsapp', (c) => (c.paymentMode = 'whatsapp')],
  ])('false si %s', (_, mutate) => {
    const cfg = base();
    mutate(cfg);
    expect(isHotmartReady(cfg)).toBe(false);
  });
});
