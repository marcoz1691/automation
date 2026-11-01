---
name: landing-web
description: Desarrolla, modifica y despliega la landing page de InmoSmart AI (Vite + HTML/CSS/JS en web/). Úsalo cuando el usuario pida cambiar textos, secciones, estilos, precios, enlaces de pago, correr el servidor local, hacer build o desplegar en Vercel/Netlify/GitHub Pages.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Landing page InmoSmart AI

Estructura (ver `web/README.md`):

- `web/index.html` — contenido de la página
- `web/css/variables.css` — design tokens (colores, tipografía); cámbialos aquí, no inline
- `web/css/base.css`, `components.css`, `sections.css` — capas de estilo, en ese orden de responsabilidad
- `web/js/main.js` — interacciones; `web/js/config.js` — links de Hotmart y precios
- `web/assets/` — logo y recursos

## Reglas

- Mercado principal: Ecuador. Textos en español, precios en USD (Esencial 17, Completa 29).
- No pongas links de pago en el HTML: van en `web/js/config.js`.
- Mantén diseño responsive (probar ancho móvil).

## Flujo

1. Lee el archivo a tocar antes de editar.
2. Aplica el cambio mínimo.
3. Valida: `cd web && npm install && npm run build`. Debe terminar sin errores.
4. Deploy: sube `web/dist/` (instrucciones en `web/README.md`).
