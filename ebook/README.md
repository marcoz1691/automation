# InmoSmart AI — Ebook Premium

## Objetivo del proyecto

Ebook premium, práctico y comercializable titulado **"Vende tu Propiedad Más Rápido con Inteligencia Artificial"**, dirigido a propietarios, agentes inmobiliarios principiantes y emprendedores del sector que desean vender o promocionar propiedades utilizando inteligencia artificial, marketing digital y estrategias inmobiliarias modernas.

El producto entrega valor accionable: checklists, plantillas, 110 prompts, guiones y casos prácticos implementables de inmediato, sin prometer resultados garantizados.

## Público objetivo

| Segmento | Necesidad principal |
|----------|---------------------|
| Propietarios que venden por cuenta propia | Vender sin depender totalmente de una inmobiliaria |
| Agentes inmobiliarios principiantes | Profesionalizar su proceso de captación y venta |
| Asesores independientes | Diferenciarse con herramientas digitales e IA |
| Pequeños constructores | Promocionar unidades terminadas o en preventa |
| Emprendedores inmobiliarios | Aplicar IA al sector de forma ética y rentable |

## Estructura de carpetas

```
/ebook
  /investigacion     → Investigación de mercado, cliente ideal, propuesta de valor
  /contenido         → Capítulos, introducción, conclusión, FAQ, glosario (19 archivos)
  /recursos          → Checklists, plantillas, 110 prompts, casos, mensajes WhatsApp
  /diseno            → Guía Canva, portada, identidad visual
  /export            → PDF, HTML, paquete Canva, script de build
  /adaptaciones      → Adaptaciones por país (México, etc.)
  README.md          → Este archivo
  progreso.md        → Tabla de seguimiento del proyecto
```

## Índice del ebook

### Material preliminar
- Portada, página legal, aviso de responsabilidad
- Introducción y cómo usar este ebook

### Capítulos (14)

| # | Archivo | Título |
|---|---------|--------|
| 1 | `02-capitulo-1.md` | Cómo compran propiedades las personas actualmente |
| 2 | `03-capitulo-2.md` | Diagnóstico inicial de la propiedad |
| 3 | `04-capitulo-3.md` | Preparación de la propiedad |
| 4 | `05-capitulo-4.md` | Cómo definir un precio competitivo |
| 5 | `06-capitulo-5.md` | Fotografía inmobiliaria con teléfono celular |
| 6 | `07-capitulo-6.md` | Inteligencia artificial para mejorar la presentación |
| 7 | `08-capitulo-7.md` | Cómo crear un anuncio que genere interés |
| 8 | `09-capitulo-8.md` | ChatGPT para bienes raíces |
| 9 | `10-capitulo-9.md` | Canva y contenido visual inmobiliario |
| 10 | `11-capitulo-10.md` | Dónde publicar la propiedad |
| 11 | `12-capitulo-11.md` | Atención, calificación y organización de prospectos |
| 12 | `13-capitulo-12.md` | Visitas que aumentan la probabilidad de recibir una oferta |
| 13 | `14-capitulo-13.md` | Objeciones, ofertas y negociación |
| 14 | `15-capitulo-14.md` | Seguridad, documentación y cierre |

### Material complementario
- Conclusión y plan de acción final (30 días)
- 35 preguntas frecuentes del vendedor
- Glosario (50+ términos)
- Anexos en `/recursos/`: 6 checklists, 9 plantillas, 110 prompts, 12 mensajes WhatsApp, 5 guiones, 4 casos simulados, plan 30 días

**Extensión estimada en Canva:** 80–120 páginas A4 vertical (~11.700 líneas de contenido Markdown).

## Instrucciones para editar

1. Cada capítulo vive en un archivo Markdown independiente dentro de `/contenido`.
2. Formato consistente: introducción → objetivo → contenido → procedimiento → ejemplo → caso → tabla/checklist → errores → consejos → ejercicio → resumen → CTA.
3. Marca `[VERIFICAR FUENTE]` cuando una afirmación requiera respaldo estadístico.
4. Marca `[ADAPTAR AL PAÍS]` en temas legales, tributarios o notariales.
5. No inventes testimonios, estadísticas ni resultados verificados.
6. Los casos prácticos son **simulados** y están identificados como tales.
7. Completa placeholders de autor antes de publicar: nombre, correo, foto.

## Instrucciones para trasladar el contenido a Canva

1. Consulta `/diseno/guia-canva.md` (A4, márgenes, tipografías, paleta azul oscuro + dorado).
2. Copia sección por sección; no pegues el ebook completo de una vez.
3. Usa plantillas de página: apertura de capítulo, checklist, ejercicio, cita destacada.
4. Recrea tablas en Canva o impórtalas como imágenes.
5. Exporta recursos de `/recursos/` como PDFs separados para la versión premium.
6. Aplica identidad **InmoSmart AI** (`/diseno/identidad-visual.md`).
7. Usa el prompt de Canva AI incluido en la guía de diseño para la primera propuesta visual.

## Oferta comercial (resumen)

| Versión | Contenido | Precio lanzamiento | Precio regular |
|---------|-----------|-------------------|----------------|
| Esencial | Ebook + 6 checklists | USD 17 | USD 27 |
| Completa | Todo + plantillas, 110 prompts, guiones, casos, plan 30 días | USD 29 | USD 47 |

Detalle en `/marketing/estrategia-precios.md` y `/marketing/pagina-ventas.md`.

## Marca

**InmoSmart AI** — Tecnología inteligente para vender propiedades con confianza.

## Estado del proyecto

| Fase | Estado |
|------|--------|
| 1. Investigación de mercado | ✅ Completada |
| 2. Propuesta de valor | ✅ Completada |
| 3. Estructura e índice | ✅ Completada |
| 4. Capítulos del ebook | ✅ Completada |
| 5. Recursos premium | ✅ Completada |
| 6. Casos prácticos | ✅ Completada |
| 7. Diseño editorial Canva | ✅ Completada |
| 8. Portada y marca | ✅ Completada |
| 9. Estrategia de venta | ✅ Completada |
| 10. Plan de lanzamiento | ✅ Completada |

**Pendiente antes de publicar:** Diseño visual refinado en Canva (opcional; PDF base ya generado), nombre de autor, reseñas reales, adaptación legal por país.

## Exportar PDF y paquete Canva

```bash
cd ebook/export
npm install
npm run build          # PDF + paquete Canva + markdown combinado
npm run build:pdf      # Solo PDF
npm run build:canva    # Solo paquete Canva por capítulo
```

**Archivos generados:**
- `export/InmoSmart-AI-Ebook-Completo.pdf` — Ebook completo con anexos (~4 MB)
- `export/ebook-completo.md` — Markdown combinado (9.000+ líneas)
- `export/ebook-nucleo.md` — Solo capítulos principales
- `export/canva-paginas/` — Texto por capítulo listo para Canva
- `export/guia-importacion-canva.md` — Guía paso a paso para Canva

**Adaptación por país:** `/adaptaciones/mexico.md` (portales, documentos, impuestos, checklist cierre).

Consulta `progreso.md` para detalle archivo por archivo.

---

*Última actualización: 5 de agosto de 2026*
