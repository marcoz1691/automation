# Capítulo 8: ChatGPT para bienes raíces

---

## Introducción

Redactar anuncios, responder mensajes, preparar guiones para visitas, analizar comparables y crear contenido para redes puede consumir horas cada semana. **ChatGPT** y asistentes similares (Claude, Gemini, Copilot, asistentes integrados en portales) pueden acelerar ese trabajo — siempre que sepas **qué pedir, qué contexto dar y qué verificar antes de publicar**.

En Latinoamérica, muchos vendedores ya "usan IA" copiando textos genéricos que suenan iguales, incluyen datos inventados o prometen lo que la propiedad no cumple. Eso no es ventaja competitiva; es ruido digital con riesgo reputacional y, en casos extremos, legal [ADAPTAR AL PAÍS].

Este capítulo te enseña a escribir **prompts efectivos** para bienes raíces: cómo estructurarlos, qué contexto incluir, cómo detectar alucinaciones, cómo adaptar salidas a portales, WhatsApp y redes, y cómo combinar la IA con tu criterio humano. Incluye **más de 25 prompts listos para usar**, organizados por categoría. La biblioteca completa de **100+ prompts** está en `/recursos/prompts-ia.md` (Anexo C).

---

## Objetivo

Al terminar este capítulo podrás:

- Estructurar prompts con contexto, rol, tarea, restricciones y formato de salida.
- Usar ChatGPT para títulos, descripciones, mensajes, guiones y análisis sin inventar datos.
- Identificar y corregir alucinaciones, exageraciones y inconsistencias en textos generados.
- Adaptar un mismo contenido base a portales, WhatsApp, Instagram, email y llamadas.
- Integrar la IA en un flujo de trabajo documentado y verificable.

---

## Explicación

### Qué puede y qué no puede hacer ChatGPT por ti

| Sí puede ayudarte a… | No puede sustituir… |
|----------------------|---------------------|
| Redactar borradores de anuncios | Tu verificación de m², precio y estado real |
| Generar variantes de título | Asesoría legal, notarial o tributaria [ADAPTAR AL PAÍS] |
| Resumir comparables que tú proporcionas | Búsqueda confiable de precios sin fuente |
| Responder borradores a mensajes frecuentes | Tu juicio en negociación y seguridad |
| Crear guiones de video o visita | La visita presencial y la relación humana |
| Organizar listas, checklists y calendarios | Garantizar venta en plazo determinado |

### Anatomía de un prompt inmobiliario efectivo

Usa esta estructura (puedes omitir bloques si no aplican):

```
1. ROL — "Actúa como copywriter inmobiliario en [país/ciudad]..."
2. CONTEXTO — Datos reales de la propiedad (ficha completa)
3. TAREA — Qué quieres exactamente (título, descripción, mensaje...)
4. RESTRICCIONES — Qué NO hacer (no inventar datos, no prometer venta...)
5. FORMATO — Longitud, tono, bullets, tabla, etc.
6. EJEMPLO (opcional) — Un modelo que te guste
```

**Regla de oro:** La calidad de la salida depende de la calidad del contexto que tú proporcionas. Un prompt de tres palabras produce basura genérica; una ficha de 15 datos produce copy usable.

### Contexto mínimo recomendado (ficha para pegar en ChatGPT)

Copia y completa antes de cualquier prompt de redacción:

```
- Tipo: [casa/depto/terreno/oficina]
- Operación: [venta/renta]
- Ubicación referencia: [colonia/zona/ciudad — sin dirección exacta si no deseas]
- m² construcción / terreno:
- Recámaras / baños / estacionamiento:
- Antigüedad / piso / amenidades edificio:
- Precio: [moneda local]
- Mantenimiento / cuotas: [ADAPTAR AL PAÍS]
- Diferenciadores reales (3):
- Comprador ideal:
- Restricciones (mascotas, uso, etc.):
- Estado / reparaciones / staging virtual:
- Canal destino: [portal / WhatsApp / Instagram / email]
- Tono deseado: [profesional / cercano / institucional]
```

### Cómo evitar alucinaciones y errores

Las "alucinaciones" son datos inventados con tono convincente. En bienes raíces, son peligrosas.

**Señales de alerta:**

- Distancias exactas a puntos de interés que no proporcionaste ("a 400 m del metro X").
- Plusvalía, rendimientos o "zonas de mayor crecimiento" sin fuente.
- Características no listadas en tu ficha (alberca, cuarto de servicio, dos estacionamientos).
- Normativa legal específica inventada [ADAPTAR AL PAÍS].
- Testimonios o casos de compradores ficticios.

**Protocolo de verificación InmoSmart (antes de publicar):**

1. **Tachado cruzado:** Cada afirmación del texto vs. tu ficha. ¿Lo confirmaste tú?
2. **Regla del dato nuevo:** Si la IA añadió algo que no estaba en el prompt, elimínalo o verifícalo en campo.
3. **Lectura en voz alta:** Suena demasiado perfecto o genérico? Probablemente lo es.
4. **Coherencia numérica:** m², recámaras y precio idénticos en título, cuerpo y ficha del portal.
5. **Segunda pasada con prompt de auditoría** (ver prompts al final de este capítulo).

### Adaptación por canal

| Canal | Longitud | Tono | Prompt clave extra |
|-------|----------|------|-------------------|
| Portal inmobiliario | 250–450 palabras | Informativo, SEO local | Incluir fórmula de título Cap. 7 |
| WhatsApp | 400–700 caracteres | Cercano, directo | CTA con número y horario |
| Instagram caption | 150–220 palabras + hashtags moderados | Visual, emocional concreto | Primera línea = gancho |
| Facebook grupo | 120–200 palabras | Conversacional | Mencionar barrio, no spam |
| Email a prospecto | 100–180 palabras | Profesional | Personalizar nombre y propiedad |
| Script llamada | Bullet points | Natural oral | Incluir preguntas calificadoras |

### Flujo de trabajo recomendado con IA

```
Ficha verificada (tú)
    ↓
Prompt → Borrador ChatGPT
    ↓
Auditoría anti-alucinación (tú + prompt auditor)
    ↓
Edición humana (tono, datos, CTA)
    ↓
Publicación multicanal (variantes por prompt)
    ↓
Registro de consultas → ajuste de mensajes
```

### Herramientas: perspectiva amplia

Este capítulo usa **ChatGPT** como referencia porque es ampliamente conocido, pero los principios aplican a:

- **Claude** (Anthropic) — bueno para textos largos y tono natural.
- **Gemini** (Google) — integración con ecosistema Google.
- **Copilot** (Microsoft) — entornos Windows/Office.
- **Asistentes en portales** — algunos portales LATAM incorporan generadores de descripción; aplica las mismas reglas de verificación.

No dependas de una sola herramienta; depende de **tu proceso**.

---

## Procedimiento paso a paso

### Paso 1: Preparar ficha verificada

- Completa el bloque de contexto mínimo con datos que puedas defender en una visita.
- Adjunta restricciones éticas: "No inventes características. No prometas plusvalía."

### Paso 2: Elegir prompt de la biblioteca

- Selecciona categoría acorde a la tarea (título, descripción, WhatsApp, etc.).
- Pega ficha al inicio del prompt.

### Paso 3: Generar borrador

- Pide **2–3 variantes** cuando sea título o apertura; elige la mejor.

### Paso 4: Auditar con prompt de verificación

- Usa el prompt "Auditor de anuncio" (sección Prompts) sobre el borrador generado.

### Paso 5: Editar manualmente

- Ajusta tono local, modismos excesivos, datos y CTA real.

### Paso 6: Generar variantes multicanal

- Mismo contenido base → prompts de adaptación por canal.

### Paso 7: Guardar en tu biblioteca personal

- Conserva prompts que funcionaron con anotaciones: propiedad tipo, canal, resultado.

---

## Ejemplo práctico

**Situación:** Anuncio de departamento en renta en Bogotá. El vendedor pegó en ChatGPT: *"Escribe anuncio depto bonito en Chapinero"*.

**Salida genérica (problemática):**

> "Espectacular apartamento en una de las zonas de mayor plusvalía de Bogotá, a pasos del TransMilenio y los mejores restaurantes. Vista panorámica garantizada. ¡Última oportunidad!"

**Problemas detectados:** Plusvalía irrelevante en renta, distancias inventadas, "vista panorámica" no confirmada, urgencia falsa.

**Prompt corregido:**

```
Actúa como copywriter inmobiliario en Bogotá, Colombia. Tono profesional y honesto.

CONTEXTO:
- Tipo: Departamento en renta
- Ubicación referencia: Chapinero Alto, calle residencial
- 55 m², 1 recámara, 1 baño, sin estacionamiento
- Piso 2, sin ascensor, edificio de 4 pisos, sin portería
- Precio: COP [MONTO]/mes + administración COP [MONTO] (agua incluida)
- Diferenciadores: cocina recientemente pintada, closet empotrado, iluminación natural en sala
- Ideal para: profesionista soltero o pareja joven sin mascotas
- Restricciones: no mascotas, contrato mínimo 12 meses, codeudor requerido
- Staging virtual en fotos 2-3, etiquetado
- Canal: portal Inmuebles24

TAREA: Escribe título con fórmula (tipo+zona+diferenciador+dato) y descripción 280 palabras.

RESTRICCIONES:
- No inventes distancias, vistas, amenidades ni plusvalía
- No uses "oportunidad única" ni "no dejes pasar"
- Incluye transparencia staging y CTA WhatsApp [NÚMERO]
- Español latinoamericano

FORMATO: Título en una línea. Descripción en párrafos cortos con bullets de distribución.
```

**Resultado:** Texto usable con auditoría mínima — principalmente verificar precios y CTA.

---

## Caso simulado

**Contexto (simulado):** Roberto, agente en Guadalajara, generó con IA una descripción de casa en venta. Un comprador llegó preguntando por la "recámara en planta baja ideal para adulto mayor" — no existía; todas las recámaras estaban arriba.

**Origen del error:** Roberto no incluyó distribución por planta en el prompt. ChatGPT inventó un beneficio plausible.

**Corrección de proceso:**

1. Roberto actualiza su plantilla de ficha con **planta y distribución**.
2. Añade restricción explícita: *"No describas planta baja salvo que figure en CONTEXTO."*
3. Implementa **prompt auditor** obligatorio antes de publicar.
4. Envía mensaje de disculpa y aclaración al comprador; reprograma visita con transparencia.

**Lección:** La IA completó un "beneficio" creíble. El daño no fue legal en este caso simulado, pero sí pérdida de confianza. Verificar cuesta 5 minutos; recuperar confianza cuesta mucho más.

---

## Tabla / Checklist

### Checklist: Publicar contenido generado con IA

| ✓ | Verificación | OK |
|---|--------------|-----|
| ☐ | Ficha completa incluida en el prompt original | |
| ☐ | Cada dato numérico coincide con documentos/ficha | |
| ☐ | No hay distancias, vistas o amenidades no verificadas | |
| ☐ | Sin promesas de venta, plusvalía ni urgencia falsa | |
| ☐ | Staging virtual y defectos declarados si aplican | |
| ☐ | CTA con contacto y horario reales | |
| ☐ | Tono adaptado al canal | |
| ☐ | Revisión ortográfica humana | |
| ☐ | Coherencia con fotografías (Cap. 5–6) | |
| ☐ | Temas legales revisados [ADAPTAR AL PAÍS] | |

### Plantilla de prompt universal (copiar/pegar)

```
ROL: Actúa como [especialista] en bienes raíces en [ciudad, país].

CONTEXTO:
[Pegar ficha completa]

TAREA:
[Describir entregable]

RESTRICCIONES:
- No inventes datos no incluidos en CONTEXTO
- No prometas venta ni plusvalía
- Español latinoamericano
- Honesto y específico

FORMATO:
[Especificar]
```

---

## Biblioteca de prompts (25+ organizados por categoría)

> **Nota:** Sustituye textos entre corchetes. La biblioteca extendida (100+ prompts) está en **`/recursos/prompts-ia.md`**.

---

### Categoría A: Títulos y descripciones de anuncio

**Prompt A1 — Título con fórmula InmoSmart**

```
Actúa como copywriter inmobiliario en [CIUDAD, PAÍS]. CONTEXTO: [FICHA COMPLETA]. Genera 5 títulos usando la fórmula: tipo + zona + diferenciador + dato clave (máx. 75 caracteres). Sin adjetivos vacíos ("hermoso", "oportunidad"). Español LATAM.
```

**Prompt A2 — Descripción larga para portal**

```
Actúa como copywriter inmobiliario en [PAÍS]. CONTEXTO: [FICHA]. Escribe descripción de 300-380 palabras: apertura con comprador ideal, bullets de distribución, 3 diferenciadores verificables, transparencia (staging/defectos), CTA WhatsApp [NÚMERO]. No inventes distancias ni amenidades. Tono profesional.
```

**Prompt A3 — Descripción corta WhatsApp**

```
CONTEXTO: [FICHA]. Resume anuncio en máximo 550 caracteres para WhatsApp: tipo, zona, m², rec/baños, precio [MONEDA], 1 diferenciador, CTA. Sin emojis excesivos. Español LATAM.
```

**Prompt A4 — Variantes de apertura (primera frase)**

```
CONTEXTO: [FICHA]. Escribe 4 aperturas distintas de 1-2 frases enfocadas en comprador ideal. Específicas, sin superlativos. Indica para cuál perfil sirve cada una.
```

**Prompt A5 — Anuncio terreno con servicios**

```
CONTEXTO: [FICHA TERRENO con m², frente, servicios, uso suelo]. Redacta anuncio enfatizando datos del lote y uso de suelo verificado. Incluye advertencia de confirmar con municipio [ADAPTAR AL PAÍS]. No proyectes plusvalía.
```

**Prompt A6 — Anuncio oficina B2B**

```
CONTEXTO: [FICHA OFICINA]. Descripción tono institucional, 250 palabras: m², privados, estacionamiento, infraestructura, horario edificio. Comprador: empresa [TAMAÑO]. Sin lenguaje emocional exagerado.
```

---

### Categoría B: Adaptación multicanal

**Prompt B1 — Portal → Instagram caption**

```
Toma esta descripción de portal: """[PEGAR TEXTO]""" Adáptala a caption Instagram 180 palabras, gancho en primera línea, 8 hashtags locales relevantes (sin #inversiongarantizada). Incluye precio. No añadas datos nuevos.
```

**Prompt B2 — Portal → publicación Facebook grupo**

```
Adapta """[DESCRIPCIÓN]""" a post para grupo de Facebook de [BARRIO/ZONA], 150 palabras, tono conversacional, sin parecer spam. Pide contacto por DM o WhatsApp. No inventes vecinos ni testimonios.
```

**Prompt B3 — Anuncio → script Reel 30 segundos**

```
CONTEXTO: [FICHA]. Guion Reel vertical 30 seg, 4 escenas con texto en pantalla y voz sugerida. Menciona solo datos del CONTEXTO. CTA final: agendar visita.
```

**Prompt B4 — Email a base de datos local**

```
CONTEXTO: [FICHA]. Email 160 palabras para lista de prospectos previos en [CIUDAD]. Asunto + cuerpo. Personalizable con [NOMBRE]. Profesional, sin urgencia falsa.
```

**Prompt B5 — Carrusel 5 slides (texto por slide)**

```
CONTEXTO: [FICHA]. Texto para carrusel: Slide1 título+precio, Slide2 distribución, Slide3 diferenciador, Slide4 transparencia, Slide5 CTA. Máx. 40 palabras por slide.
```

---

### Categoría C: Respuestas a prospectos y calificación

**Prompt C1 — Respuesta primer contacto portal**

```
Un prospecto escribió: """[MENSAJE]""" sobre [FICHA]. Redacta respuesta WhatsApp cordial 120 palabras: agradece, responde preguntas solo si están en FICHA, invita a visita, pide nombre y disponibilidad. Si preguntan algo no en ficha, indica que confirmarás.
```

**Prompt C2 — Pregunta precio negociable**

```
CONTEXTO precio [MONTO], margen negociación [SÍ/NO / hasta X%]. Prospecto pregunta "¿cuál es el último precio?". Respuesta honesta 80 palabras sin presión. [ADAPTAR AL PAÍS — prácticas de negociación].
```

**Prompt C3 — Solicitud visita fin de semana**

```
Redacta mensaje confirmando visita sábado [HORA] en [ZONA REFERENCIA]. Incluye: identificación requerida, puntualidad, política mascotas [DETALLE], número contacto. 100 palabras.
```

**Prompt C4 — Calificación semáforo (preguntas)**

```
Genera 8 preguntas de calificación para prospecto de [VENTA/RENTA] en [CIUDAD]: presupuesto, tiempo decisión, financiamiento [ADAPTAR AL PAÍS], motivación, quien decide. Tono conversacional para WhatsApp.
```

**Prompt C5 — Prospecto no califica (rechazo amable)**

```
Prospecto busca renta [MONTO] pero el inmueble es [MONTO MAYOR]. Mensaje empático declinando sin quemar puente, ofreciendo mantener contacto si cambia presupuesto. 70 palabras.
```

---

### Categoría D: Objeciones y seguimiento

**Prompt D1 — Objeción "está caro"**

```
CONTEXTO: [FICHA + comparables que TÚ proporcionas]. Comprador dice "vi similares más baratos". Respuesta 130 palabras enfocada en diferenciadores verificables, invita a comparar m² y estado, sin despreciar competencia.
```

**Prompt D2 — Objeción "necesito pensarlo"**

```
Redacta seguimiento 48h post-visita, tono no invasivo, 90 palabras. Pregunta si necesita información adicional. Sin "última oportunidad".
```

**Prompt D3 — Reactivación prospecto frío (30 días)**

```
Prospecto no respondió en 30 días sobre [FICHA]. Mensaje corto 60 palabras mencionando [ajuste: precio reducido / misma disponibilidad]. Sin culpar. CTA sí/no.
```

**Prompt D4 — Post-visita solicitud feedback**

```
Mensaje post-visita mismo día: agradecer, pedir 1 feedback concreto (escala 1-5 o pregunta abierta), ofrecer resolver dudas. 80 palabras.
```

---

### Categoría E: Visitas, presentación y documentos

**Prompt E1 — Guion recorrido visita**

```
CONTEXTO: [FICHA + ruta espacios]. Guion visita 20 minutos en bullet points: orden recorrido, frase clave por espacio, qué NO exagerar, cierre con siguiente paso.
```

**Prompt E2 — Checklist pre-visita vendedor**

```
Genera checklist pre-visita para [TIPO PROPIEDAD]: limpieza, luces, temperatura, documentos a mano, seguridad [ADAPTAR AL PAÍS]. Formato tabla markdown.
```

**Prompt E3 — Lista documentos venta (general)**

```
Lista documentos habituales para venta de [CASA/DEPTO] en [PAÍS] — marca [ADAPTAR AL PAÍS] en cada ítem que varíe por estado/municipio. Sin afirmar lista exhaustiva legal.
```

---

### Categoría F: Análisis, comparables y estrategia (con tus datos)

**Prompt F1 — Tabla comparables**

```
Te proporciono comparables verificados: """[DATOS]""". Crea tabla: dirección ref, m², rec, precio, precio/m², diferencia vs mi propiedad [FICHA]. No añadas comparables inventados. Conclusión neutra 2 frases.
```

**Prompt F2 — Argumentos de valor sin hype**

```
CONTEXTO: [FICHA]. Lista 5 argumentos de valor para defensa de precio basados solo en CONTEXTO. Sin plusvalía futura.
```

**Prompt F3 — Ideas mejora antes de publicar**

```
CONTEXTO: [FICHA + estado actual]. Sugiere 5 mejoras de bajo costo antes de fotografiar/publicar, realistas para LATAM. No sugieras remodelaciones mayores sin pedir presupuesto.
```

---

### Categoría G: Redes sociales y contenido educativo

**Prompt G1 — 10 ideas posts comunidad local**

```
Soy agente en [ZONA]. Genera 10 ideas de post educativo (no vender directo): mantenimiento, documentos, errores al vender solo [ADAPTAR AL PAÍS]. Sin estadísticas inventadas.
```

**Prompt G2 — Post "propiedad vendida" (sin datos falsos)**

```
Redacta post agradeciendo venta concluida de [TIPO] en [ZONA] sin mencionar precio final ni datos personales. Tono profesional, invita contacto. 100 palabras.
```

**Prompt G3 — Story preguntas frecuentes**

```
5 slides FAQ para renta en [CIUDAD]: depósito, aval, mascotas, duración contrato [ADAPTAR AL PAÍS]. Respuestas 30 palabras cada una. Neutral, no reemplazar abogado.
```

---

### Categoría H: Auditoría y control de calidad

**Prompt H1 — Auditor de anuncio (anti-alucinación)**

```
Audita este anuncio vs FICHA oficial.

FICHA: """[PEGAR]"""
ANUNCIO: """[PEGAR]"""

Lista: (1) datos inventados o no verificables, (2) superlativos vacíos, (3) inconsistencias numéricas, (4) riesgos legales/reputacionales [ADAPTAR AL PAÍS], (5) versión corregida sugerida sin añadir datos nuevos.
```

**Prompt H2 — Simplificar texto genérico de IA**

```
Este texto suena genérico: """[PEGAR]""". Reescríbelo más específico usando solo: [LISTA DATOS]. Reduce 20% longitud. Español LATAM.
```

**Prompt H3 — Detectar promesas prohibidas**

```
Revisa """[TEXTO]""" y señala frases que impliquen venta garantizada, plusvalía, urgencia falsa o datos no comprobables. Propón alternativas honestas.
```

---

### Categoría I: Traducción y tono (mercados bilingües)

**Prompt I1 — Adaptar tono formal/informal**

```
Reescribe """[TEXTO]""" en tono [formal/cercano] manteniendo todos los datos exactos. Mismo idioma: español LATAM.
```

**Prompt I2 — Resumen ejecutivo para inversionista**

```
CONTEXTO: [FICHA comercial/oficina]. Resumen 120 palabras enfoque ROI solo con datos proporcionados (renta actual, vacancia, gastos). No proyectes ingresos futuros sin supuestos declarados [VERIFICAR FUENTE].
```

---

**Conteo:** 32 prompts en este capítulo (A1–A6, B1–B5, C1–C5, D1–D4, E1–E3, F1–F3, G1–G3, H1–H3, I1–I2).

Para prompts adicionales — negociación avanzada, plantillas legales generales, calendario 30 días, guiones TikTok, emails de nurturing, respuestas a portales específicos y más — consulta **`/recursos/prompts-ia.md`** (100+ prompts, Anexo C premium).

---

## Errores comunes

1. **Prompts demasiado cortos.** "Anuncio de casa en Lima" → salida inútil.

2. **No pegar restricciones.** Sin "no inventar", ChatGPT inventará encantado.

3. **Publicar sin auditoría.** El prompt H1 existe por una razón.

4. **Confiar en comparables generados.** ChatGPT no sustituye tu investigación de mercado del Capítulo 4.

5. **Mismo texto en todos los canales.** WhatsApp no es un portal truncado; adapta.

6. **Copiar prompts en inglés sin adaptar.** Pide siempre español LATAM explícito.

7. **Incluir datos personales sensibles en prompts.** Evita nombres completos de compradores, CURP, RFC, números de escritura en chats públicos; usa datos anonimizados.

8. **Usar IA para asesoría legal.** Prompt E3 es orientativo; no es abogado [ADAPTAR AL PAÍS].

9. **No versionar borradores.** Guarda qué prompt produjo qué texto para aprender qué funciona.

10. **Automatizar respuestas sin supervisión** en negociaciones delicadas o situaciones de seguridad.

---

## Consejos profesionales

- **Crea un "prompt madre"** con tu ficha tipo y reutilízalo en un documento Notas/Google Docs.

- **Pide formatos estructurados** (tabla, JSON, bullets) cuando vayas a pegar en portales o CRM.

- **Usa iteración:** "Acorta el párrafo 2" es más efectivo que reescribir desde cero.

- **Combina IA + voz humana:** graba notas de voz con fortalezas reales de la propiedad y pide a ChatGPT transcribir y pulir.

- **Para equipos:** estandariza prompts en una biblioteca compartida con reglas éticas InmoSmart.

- **Revisa políticas de OpenAI/proveedor** sobre datos que ingresas; no subas documentos confidenciales sin entender privacidad.

- **Cuando dudes, elimina la frase.** Menos copy honesto > más copy brillante y falso.

- **Mide:** anota qué prompt generó el anuncio que más consultas calificadas trajo (no solo volumen).

---

## Ejercicio

**Implementa tu flujo ChatGPT en 30 minutos**

1. Completa ficha verificada de tu propiedad (bloque de contexto mínimo).

2. Ejecuta **Prompt A1** (5 títulos) y elige uno.

3. Ejecuta **Prompt A2** (descripción portal) con el título elegido.

4. Ejecuta **Prompt H1** (auditor) sobre el borrador. Corrige todo lo señalado.

5. Ejecuta **Prompt A3** y **Prompt B1** para WhatsApp e Instagram.

6. Compara con tu borrador del Capítulo 7: ¿qué versión es más clara? Combina lo mejor manualmente.

7. Guarda en carpeta `prompts_usados/` capturas o textos con fecha.

**Entregable:** Paquete multicanal auditado + bitácora de qué prompt generó cada pieza.

---

## Resumen

- ChatGPT acelera redacción; **tú** garantizas veracidad, coherencia y ética.
- Prompt efectivo = rol + contexto completo + tarea + restricciones + formato.
- Protocolo anti-alucinación: tachado cruzado, regla del dato nuevo, prompt auditor.
- Adapta tono y longitud por canal; no copies el mismo bloque en todas partes.
- Este capítulo incluye **32 prompts** listos; la biblioteca **100+** está en `/recursos/prompts-ia.md`.
- La IA es ventaja cuando hay proceso; sin verificación, es riesgo.

---

## CTA

**Acción inmediata:** Elige 3 prompts de este capítulo (A2, H1, A3 como mínimo) y genera tu paquete de anuncio auditado hoy.

**Siguiente paso:** En el **Capítulo 9** llevarás esos textos a **Canva** — flyers, carruseles y fichas visuales coherentes con tu marca.

**Recurso premium:** Descarga y personaliza la biblioteca completa en **`/recursos/prompts-ia.md`** (Anexo C). Combínala con plantillas de `/recursos/plantillas.md` y mensajes de `/recursos/mensajes-whatsapp.md`.

---

*InmoSmart AI — Capítulo 8. Contenido educativo. ChatGPT y marcas mencionadas son herramientas de terceros; verifica términos, privacidad y regulaciones aplicables [ADAPTAR AL PAÍS].*
