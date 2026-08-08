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

## Personalizar checkout

En `js/main.js`, reemplaza `CHECKOUT_URLS` con tus enlaces de Hotmart/Gumroad:

```js
const CHECKOUT_URLS = {
  esencial: 'https://pay.hotmart.com/...',
  completa: 'https://pay.hotmart.com/...',
};
```

## Diseño

- Paleta: azul `#1B3A5C`, dorado `#C9A962`
- Fuentes: Montserrat + Open Sans (Google Fonts)
- Mobile-first, sticky CTA, FAQ accordion, scroll reveal
