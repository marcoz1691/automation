# language: es
# Técnicas: tabla de decisión (paymentMode × link de la edición) + particiones de equivalencia
# sobre el número de WhatsApp (solo dígitos / con símbolos / con espacios).
@checkout
Característica: Checkout de las ediciones del ebook
  Como visitante que quiere comprar
  Quiero que cada botón me lleve al pago correcto
  Para no pagar la edición equivocada ni perder la venta

  @AC-01 @smoke
  Escenario: Con Hotmart configurado cada botón abre el pago de su edición
    Dado que Hotmart tiene links para "esencial" y "completa"
    Cuando cargo la landing
    Entonces los botones "esencial" apuntan al link de Hotmart de la Edición Esencial
    Y los botones "completa" apuntan al link de Hotmart de la Edición Completa
    Y todos abren en pestaña nueva con rel "noopener noreferrer"

  @AC-01 @AC-02 @negative
  Escenario: Solo una edición tiene link de Hotmart
    Dado que Hotmart solo tiene link para "completa"
    Cuando cargo la landing
    Entonces los botones "completa" apuntan a Hotmart
    Pero los botones "esencial" apuntan a WhatsApp con el mensaje de la Edición Esencial

  @AC-02 @negative
  Escenario: Sin links de Hotmart todo cae a WhatsApp
    Dado que Hotmart no tiene links configurados
    Cuando cargo la landing
    Entonces cada botón apunta a "https://wa.me/<número>" con el mensaje de su edición

  @AC-02 @negative
  Esquema del escenario: El modo WhatsApp ignora los links de Hotmart
    Dado que paymentMode es "whatsapp" y el número es "<numero>"
    Cuando cargo la landing
    Entonces los botones apuntan a "https://wa.me/<digitos>"

    Ejemplos:
      | numero            | digitos      |
      | 593987654321      | 593987654321 |
      | +593 98 765 4321  | 593987654321 |
      | (593) 98-765-4321 | 593987654321 |

  @AC-03
  Escenario: El CTA fijo aparece al hacer scroll
    Dado que estoy al inicio de la landing en móvil
    Entonces el CTA fijo está oculto con aria-hidden "true"
    Cuando hago scroll más de 400 px
    Entonces el CTA fijo es visible
    Y apunta al checkout de la Edición Completa

  @AC-03 @negative
  Escenario: Valor límite — con 400 px exactos el CTA sigue oculto
    Dado que estoy al inicio de la landing en móvil
    Cuando hago scroll de exactamente 400 px
    Entonces el CTA fijo está oculto con aria-hidden "true"
