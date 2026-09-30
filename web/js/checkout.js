/**
 * Lógica de checkout — Hotmart / WhatsApp fallback.
 * Funciones puras (sin DOM) para poder probarlas con unit + mutation testing.
 */

export function getCheckoutUrl(config, edition) {
  const platformUrl = config.checkoutUrls[edition]?.trim();
  if (config.paymentMode === 'platform' && platformUrl) {
    return platformUrl;
  }
  const msg = encodeURIComponent(config.whatsappMessages[edition] || config.whatsappMessages.completa);
  const num = config.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${num}?text=${msg}`;
}

export function isHotmartReady(config) {
  return Boolean(
    config.paymentMode === 'platform' &&
      config.checkoutUrls.esencial?.trim() &&
      config.checkoutUrls.completa?.trim()
  );
}
