# Guía de importación a Canva — InmoSmart AI

**Producto:** Vende tu Propiedad Más Rápido con Inteligencia Artificial  
**Formato:** A4 vertical (210 × 297 mm)  
**Tiempo estimado de maquetación:** 8–15 horas (primera vez)

---

## Paso 1: Crear el documento en Canva

1. Ir a [canva.com](https://www.canva.com) → **Crear un diseño** → **Tamaño personalizado** → **210 × 297 mm**.
2. Nombrar el diseño: `InmoSmart AI — Ebook v1`.
3. Activar **Ver → Mostrar márgenes y sangrado**.
4. Crear carpeta de páginas maestras (duplicar y renombrar):
   - `00 Portada`
   - `01 Legal`
   - `02 Apertura capítulo`
   - `03 Cuerpo texto`
   - `04 Checklist`
   - `05 Tabla`
   - `06 Ejercicio`
   - `07 Cita destacada`

---

## Paso 2: Aplicar identidad visual

| Elemento | Valor |
|----------|-------|
| Azul primario | `#1B3A5C` |
| Dorado acento | `#C9A962` |
| Fondo caja | `#F4F6F8` |
| Texto cuerpo | `#2D3748` |
| Título portada | Montserrat ExtraBold 36–40 pt |
| Título capítulo | Montserrat Bold 28–32 pt |
| Subtítulo | Montserrat SemiBold 18–20 pt |
| Cuerpo | Open Sans 11–12 pt |

Consulta paleta completa en `/diseno/guia-canva.md`.

---

## Paso 3: Prompt Canva AI (Magic Design)

Copia este prompt en **Canva AI → Magic Design** para generar una propuesta de portada:

```
Diseño de portada de ebook profesional A4 vertical para marca "InmoSmart AI".
Título: "Vende tu Propiedad Más Rápido con Inteligencia Artificial".
Estilo: moderno, confiable, tecnológico pero accesible. Bienes raíces + inteligencia artificial.
Colores: azul oscuro #1B3A5C, blanco, acento dorado #C9A962.
Imagen de fondo: interior de departamento luminoso o sala moderna con overlay azul semitransparente.
Tipografía sans-serif bold para título, legible en español.
Sin dinero, sin gráficos de enriquecimiento rápido, sin countdown.
Incluir logo texto "InmoSmart AI" arriba. Sensación premium editorial LATAM.
```

---

## Paso 4: Importar contenido por capítulo

Los archivos en `/export/canva-paginas/` contienen el texto listo para copiar:

| Archivo Canva | Origen | Páginas est. |
|---------------|--------|--------------|
| `00-portada-canva.md` | Portada + legal | 2–3 |
| `01-introduccion-canva.md` | Introducción | 4–6 |
| `02-capitulo-1-canva.md` … `15-capitulo-14-canva.md` | Capítulos | 5–8 c/u |
| `16-conclusion-canva.md` | Conclusión | 3–4 |
| `17-preguntas-frecuentes-canva.md` | FAQ | 4–6 |
| `18-glosario-canva.md` | Glosario | 3–5 |

**Procedimiento por capítulo:**
1. Duplicar página maestra «Apertura capítulo».
2. Pegar título y número del capítulo.
3. Duplicar páginas «Cuerpo texto»; pegar sección por sección (no más de 400 palabras por página).
4. Recrear tablas con herramienta **Tabla** de Canva o importar como imagen.
5. Checklists: usar página maestra con iconos ✓ en dorado.
6. Prompts/código: fondo `#F4F6F8`, fuente Space Mono o Courier 9–10 pt.

---

## Paso 5: Recursos premium (versión Completa)

Exportar como PDFs separados desde Canva o Google Docs:

| Recurso | Archivo fuente | Entrega al cliente |
|---------|----------------|-------------------|
| 6 checklists | `/recursos/checklists.md` | PDF editable |
| Plantillas | `/recursos/plantillas.md` | Google Sheets / Excel |
| 110 prompts | `/recursos/prompts-ia.md` | PDF + Notion opcional |
| WhatsApp | `/recursos/mensajes-whatsapp.md` | PDF 1 página |
| Casos | `/recursos/casos-practicos.md` | PDF anexo |
| Plan 30 días | `/recursos/calendario-contenido.md` | PDF + calendario |

---

## Paso 6: Exportar ebook final

1. **PDF estándar (digital):** Descargar → PDF para impresión → **150 DPI**, marcas de corte OFF.
2. **PDF premium:** 300 DPI si incluye impresión física.
3. **Peso objetivo:** Núcleo 5–8 MB · Completo con anexos 12–20 MB.
4. Proteger PDF si vendes en Hotmart/Gumroad (DRM de plataforma).

---

## Paso 7: Mockup promocional

1. En Canva buscar «mockup ebook» o «mockup tablet».
2. Importar portada exportada como PNG.
3. Añadir badge: «110+ prompts · Plantillas · Checklists».
4. Exportar PNG 1080×1080 (Instagram) y 1080×1920 (Stories).

Textos en `/diseno/portada.md` y `/marketing/contenido-redes.md`.

---

## Alternativa rápida: PDF automático

Si necesitas un PDF inmediato sin maquetar en Canva:

```bash
cd ebook/export
node build-ebook.js
```

Genera:
- `ebook-completo.md` — Todo el contenido combinado
- `ebook-nucleo.md` — Solo capítulos (sin anexos extensos)
- `InmoSmart-AI-Ebook-Completo.pdf` — PDF con estilos InmoSmart AI
- `/canva-paginas/` — Texto por capítulo para Canva

---

## Checklist QA antes de publicar

- [ ] Portada con título legible en miniatura (150×150 px)
- [ ] Numeración de páginas consistente
- [ ] Tablas no cortadas entre páginas
- [ ] Links funcionales (si aplica versión digital interactiva)
- [ ] Aviso legal visible en primeras páginas
- [ ] Sin `[ADAPTAR AL PAÍS]` sin resolver (usar `/adaptaciones/mexico.md` si vendes en MX)
- [ ] Nombre de autor y contacto completados
- [ ] Ortografía revisada en español mexicano/latinoamericano

---

*InmoSmart AI · Guía de importación Canva v1.0*
