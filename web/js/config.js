/**
 * Configuración de pagos — InmoSmart AI
 *
 * HOTMART: Pega tus links de checkout abajo (Producto → Enlaces en Hotmart)
 * Guía: /ebook/marketing/hotmart-configuracion.md
 */

export const config = {
  /** 'platform' = Hotmart/Gumroad | 'whatsapp' = venta manual */
  paymentMode: 'platform',

  platform: 'hotmart',

  /**
   * LINKS HOTMART — Reemplaza con tus URLs reales:
   * Hotmart → Productos → [tu producto] → Enlaces → Copiar link de pago
   *
   * Formato: https://pay.hotmart.com/XXXXXXXX
   */
  checkoutUrls: {
    esencial: '', // ← Pega link Edición Esencial (USD 17)
    completa: '', // ← Pega link Edición Completa (USD 29)
  },

  /** Si checkoutUrls está vacío, redirige a WhatsApp como respaldo */
  whatsappNumber: '593XXXXXXXXX',

  whatsappMessages: {
    esencial:
      'Hola, quiero comprar la *Edición Esencial* de InmoSmart AI (USD 17) en Hotmart. ¿Me ayudas?',
    completa:
      'Hola, quiero comprar la *Edición Completa* de InmoSmart AI (USD 29) en Hotmart. ¿Me ayudas?',
  },

  /** Mostrar link de soporte WhatsApp en footer */
  whatsappSupport: true,
};
