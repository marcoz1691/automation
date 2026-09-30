# language: es
# Técnicas: transición de estados del menú móvil (cerrado ⇄ abierto, abierto → enlace → cerrado).
Característica: Navegación

  @AC-06 @smoke
  Escenario: Abrir y cerrar el menú móvil
    Dado que estoy en móvil
    Cuando pulso el botón de menú
    Entonces el menú es visible y el botón tiene aria-expanded "true"
    Cuando pulso de nuevo el botón de menú
    Entonces el menú está oculto y el botón tiene aria-expanded "false"

  @AC-06 @negative
  Escenario: Elegir un enlace cierra el menú
    Dado que el menú móvil está abierto
    Cuando elijo "Precios"
    Entonces el menú se cierra
    Y la sección de precios es visible

  @AC-07
  Esquema del escenario: Los enlaces internos llevan a su sección
    Dado que estoy en escritorio
    Cuando pulso el enlace "<enlace>" del header
    Entonces la sección "<seccion>" queda visible bajo el header fijo

    Ejemplos:
      | enlace    | seccion   |
      | Método    | metodo    |
      | Contenido | contenido |
      | Precios   | precios   |
      | FAQ       | faq       |
