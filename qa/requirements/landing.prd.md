# PRD — Landing InmoSmart AI

Fuente de verdad de los **criterios de aceptación (CA)** que alimentan el loop de QA.
Cada CA tiene un ID estable (`AC-XX`), una **criticidad de negocio** (1–5, usada como
*impacto* en la matriz de riesgo) y, si aplica, la marca `[negativo]`: el diseño de
casos DEBE incluir al menos un escenario negativo para ese CA (gate 1).

Formato (lo parsea `scripts/ac-coverage-gate.mjs`, no lo cambies):
`- **AC-XX** (criticidad N) [negativo] Texto del criterio`

## Checkout (ingresos)

- **AC-01** (criticidad 5) [negativo] Con Hotmart configurado, cada botón `data-checkout` apunta al link de pago de SU edición (esencial → USD 17, completa → USD 29) y abre en pestaña nueva con `rel="noopener noreferrer"`.
- **AC-02** (criticidad 5) [negativo] Si falta el link de Hotmart de una edición, o `paymentMode` es `whatsapp`, el botón apunta a `https://wa.me/<número solo dígitos>?text=<mensaje de esa edición>`.
- **AC-03** (criticidad 4) El CTA fijo (sticky) está oculto (`aria-hidden="true"`) al inicio de la página, aparece al hacer scroll más de 400 px y lleva al checkout de la Edición Completa.

## Contenido y conversión

- **AC-04** (criticidad 4) La sección de precios muestra las dos ediciones con sus precios: Esencial USD 17 y Completa USD 29.
- **AC-05** (criticidad 3) [negativo] Las preguntas frecuentes funcionan como acordeón: al abrir una se cierran las demás y `aria-expanded` refleja el estado; volver a pulsar la abierta la cierra.

## Navegación

- **AC-06** (criticidad 3) [negativo] En móvil, el botón de menú abre y cierra la navegación (`aria-expanded`, `hidden`) y el menú se cierra al elegir un enlace.
- **AC-07** (criticidad 2) Los enlaces de navegación interna (`#metodo`, `#contenido`, `#precios`, `#faq`) llevan a su sección y la dejan visible bajo el header fijo.

## No funcionales

- **AC-08** (criticidad 4) Accesibilidad: la página no tiene violaciones axe de impacto `serious` o `critical` (WCAG 2.1 A/AA), en escritorio y en móvil.
- **AC-09** (criticidad 3) Performance: con 20 usuarios virtuales durante 30 s, p95 de la página < 500 ms y tasa de error < 1 % (k6).
- **AC-10** (criticidad 3) Seguridad: el escaneo baseline de OWASP ZAP no reporta alertas de riesgo alto.
