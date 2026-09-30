// Page Object de la landing. TODOS los locators viven aquí.
// Regla de oro: el self-healing (healer) solo puede modificar este directorio (tests/pages/),
// nunca las aserciones de los *.spec.js. Lo verifica scripts/guard-healing.mjs en CI.

export class LandingPage {
  constructor(page) {
    this.page = page;
    this.header = page.locator('#header');
    this.menuToggle = page.getByRole('button', { name: 'Abrir menú' });
    this.mobileNav = page.getByRole('navigation', { name: 'Menú móvil' });
    this.stickyCta = page.locator('#stickyCta');
    this.stickyCtaButton = this.stickyCta.getByRole('link');
    this.pricing = page.locator('#precios');
    this.faqQuestions = page.locator('.faq-question');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.locator('[data-checkout]').first().waitFor({ state: 'attached' });
  }

  checkoutButtons(edition) {
    return this.page.locator(`[data-checkout="${edition}"]`);
  }

  headerLink(name) {
    return this.header.getByRole('link', { name, exact: true });
  }

  mobileNavLink(name) {
    return this.mobileNav.getByRole('link', { name, exact: true });
  }

  section(id) {
    return this.page.locator(`section#${id}`);
  }

  pricingCard(name) {
    return this.pricing.locator('.pricing-card').filter({ hasText: name });
  }

  async scrollTo(y) {
    await this.page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await this.page.waitForFunction((top) => Math.round(window.scrollY) === top, y);
  }

  /** Todas las URLs de checkout de una edición (header, precios, menú, sticky…). */
  async checkoutHrefs(edition) {
    return this.checkoutButtons(edition).evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  }
}
