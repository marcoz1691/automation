# InmoSmart AI — Landing Page

Landing page premium para el ebook **Vende tu Propiedad Más Rápido con Inteligencia Artificial**.

**Mercado principal:** Ecuador 🇪🇨

## Desarrollo

```bash
cd web
npm install
npm run dev
```

Abre http://localhost:5173

## Producción

```bash
npm run build
npm run preview
```

El build estático queda en `web/dist/` — despliega en Vercel, Netlify, GitHub Pages o cualquier hosting estático.

## Estructura

```
web/
├── index.html          # Landing page
├── css/
│   ├── variables.css   # Design tokens
│   ├── base.css        # Reset + layout
│   ├── components.css  # UI components
│   └── sections.css    # Page sections
├── js/main.js          # Interactions
└── assets/logo.svg     # Brand logo
```

## Hotmart (cuenta activa)

1. **Esencial:** sube `ebook/export/InmoSmart-AI-Ebook-Ecuador.pdf`  
2. **Completa:** sube `ebook/export/InmoSmart-AI-Completa-Hotmart.zip`  
3. Copia links en `js/config.js`:

```js
checkoutUrls: {
  esencial: 'https://pay.hotmart.com/TU_CODIGO',
  completa: 'https://pay.hotmart.com/TU_CODIGO',
},
```

Guía completa: `ebook/marketing/hotmart-configuracion.md`

## Personalizar checkout

Edita `js/config.js` (modo `platform` + links Hotmart). Si falta un link, el botón usa WhatsApp como respaldo.

## Diseño

- Paleta: azul `#1B3A5C`, dorado `#C9A962`
- Fuentes: Montserrat + Open Sans (Google Fonts)
- Mobile-first, sticky CTA, FAQ accordion, scroll reveal
