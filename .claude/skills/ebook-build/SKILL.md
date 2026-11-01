---
name: ebook-build
description: Genera el ebook InmoSmart AI (Markdown consolidado, PDF, versión Ecuador y paquete Canva) desde ebook/contenido con build-ebook.js. Úsalo cuando el usuario pida compilar, exportar, regenerar el PDF, actualizar el ebook tras editar capítulos, o preparar archivos para Hotmart o Canva.
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Build del ebook

Fuente de verdad: `ebook/contenido/*.md` (capítulos numerados). Nunca edites a mano los archivos generados en `ebook/export/` (`ebook-*.md`, PDF, `canva-paginas/`).

## Pasos

1. Confirma qué cambió: `git status ebook/contenido`.
2. Ejecuta `bash .claude/skills/ebook-build/scripts/build.sh <modo>` donde `<modo>` es:
   - `md` → solo Markdown consolidado
   - `pdf` → Markdown + PDF
   - `ecuador` → PDF adaptado a Ecuador (mercado principal)
   - `canva` → páginas para importar en Canva
3. Verifica que los archivos de `ebook/export/` se actualizaron (fecha y tamaño) y reporta cuáles.
4. Si cambió contenido, actualiza `ebook/progreso.md` solo si el usuario lo pide.

## Notas

- Requiere Node. El script instala dependencias si falta `node_modules`.
- Detalles de adaptaciones por país: `ebook/README.md`.
- Para subir a Hotmart usa el skill `hotmart-delivery`.
