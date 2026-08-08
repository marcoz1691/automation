/**
 * Configuración de pagos — InmoSmart AI
 *
 * INSTRUCCIONES:
 * 1. Cuando tengas cuenta Gumroad/Hotmart, pega tus links en checkoutUrls
 * 2. Mientras tanto, usa modo WhatsApp con tu número de Ecuador (593...)
 *
 * Guía completa: /ebook/marketing/guia-crear-cuenta-pago.md
 */

export const config = {
  /** 'whatsapp' | 'platform' */
  paymentMode: 'whatsapp',

  /** Número WhatsApp Ecuador: código país + número sin + ni espacios
   *  Ejemplo Quito: 593991234567
   *  REEMPLAZA con tu número real */
  whatsappNumber: '593XXXXXXXXX',

  /** Mensajes prellenados */
  whatsappMessages: {
    esencial:
      'Hola, quiero comprar la *Edición Esencial* de InmoSmart AI (USD 17). ¿Cómo puedo pagar?',
    completa:
      'Hola, quiero comprar la *Edición Completa* de InmoSmart AI (USD 29). ¿Cómo puedo pagar?',
  },

  /** Pega aquí tus links cuando tengas Gumroad/Hotmart */
  checkoutUrls: {
    esencial: '',
    completa: '',
  },
};
