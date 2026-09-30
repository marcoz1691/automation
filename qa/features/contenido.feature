# language: es
# Técnicas: transición de estados del acordeón (cerrado → abierto → cerrado, A abierto → B abierto).
Característica: Contenido y conversión

  @AC-04 @smoke
  Escenario: La sección de precios muestra ambas ediciones
    Cuando voy a la sección de precios
    Entonces veo la Edición Esencial a USD 17
    Y veo la Edición Completa a USD 29

  @AC-05
  Escenario: Abrir una pregunta frecuente
    Dado que todas las preguntas están cerradas
    Cuando abro la primera pregunta
    Entonces su aria-expanded es "true"

  @AC-05 @negative
  Escenario: Abrir otra pregunta cierra la anterior
    Dado que la primera pregunta está abierta
    Cuando abro la segunda pregunta
    Entonces la primera tiene aria-expanded "false"
    Y la segunda tiene aria-expanded "true"

  @AC-05 @negative
  Escenario: Pulsar la pregunta abierta la cierra
    Dado que la primera pregunta está abierta
    Cuando la vuelvo a pulsar
    Entonces ninguna pregunta está abierta
