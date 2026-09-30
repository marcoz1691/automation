# language: es
Característica: Requisitos no funcionales

  @AC-08 @smoke @a11y
  Esquema del escenario: Sin violaciones serias de accesibilidad
    Dado que abro la landing en "<dispositivo>"
    Cuando la analizo con axe (WCAG 2.1 A/AA)
    Entonces no hay violaciones de impacto serious o critical

    Ejemplos:
      | dispositivo |
      | escritorio  |
      | móvil       |

  @AC-09 @perf
  Escenario: La página aguanta carga ligera
    Dado 20 usuarios virtuales durante 30 segundos
    Cuando piden la landing
    Entonces el p95 es menor a 500 ms
    Y la tasa de error es menor al 1 %

  @AC-10 @security
  Escenario: Escaneo baseline de seguridad
    Cuando ZAP hace un escaneo baseline de la landing
    Entonces no hay alertas de riesgo alto
