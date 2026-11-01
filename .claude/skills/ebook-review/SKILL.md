---
name: ebook-review
description: Revisión de solo lectura del contenido del ebook (capítulos en ebook/contenido): consistencia, errores, tono, términos de Ecuador, enlaces rotos y capítulos faltantes. Úsalo cuando el usuario pida revisar, auditar, corregir ortografía o verificar el ebook sin modificarlo.
allowed-tools: Read, Grep, Glob
---

# Revisión del ebook (solo lectura)

Este skill no puede editar archivos: reporta hallazgos y el usuario decide.

1. Lista capítulos con Glob `ebook/contenido/*.md` y confirma numeración 00–18 sin saltos.
2. Revisa cada archivo contra los criterios de `references/criterios.md`.
3. Entrega una tabla: archivo | problema | sugerencia.
4. Para aplicar correcciones, el usuario debe pedirlo aparte.
