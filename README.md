# InmoSmart AI — Proyecto completo

Repositorio del ebook **Vende tu Propiedad Más Rápido con Inteligencia Artificial** + landing page + integración Hotmart.

**Mercado principal:** Ecuador 🇪🇨

---

## Estructura

| Carpeta | Contenido |
|---------|-----------|
| [`/ebook`](ebook/) | Ebook completo (Markdown), PDF, recursos, marketing, adaptaciones por país |
| [`/web`](web/) | Landing page premium (Vite + HTML/CSS/JS) |

---

## Empezar en Cursor (tu PC)

```bash
git clone https://github.com/marcoz1691/automation.git
cd automation
git checkout main
git pull origin main
```

### Landing page

```bash
cd web
npm install
npm run dev
```

Abre http://localhost:5173

### Hotmart — conectar pagos

1. Edita `web/js/config.js` → pega tus links `pay.hotmart.com`
2. Guía: [`ebook/marketing/hotmart-configuracion.md`](ebook/marketing/hotmart-configuracion.md)

### Archivos para subir a Hotmart

| Producto | Archivo |
|----------|---------|
| Edición Esencial (USD 17) | `ebook/export/InmoSmart-AI-Ebook-Ecuador.pdf` |
| Edición Completa (USD 29) | `ebook/export/InmoSmart-AI-Completa-Hotmart.zip` |

---

## Documentación clave

- [`ebook/README.md`](ebook/README.md) — Índice del ebook y export PDF
- [`ebook/progreso.md`](ebook/progreso.md) — Estado del proyecto
- [`web/README.md`](web/README.md) — Frontend y deploy
- [`ebook/marketing/hotmart-configuracion.md`](ebook/marketing/hotmart-configuracion.md) — Hotmart paso a paso

---

## Deploy landing (producción)

```bash
cd web && npm run build
```

Sube `web/dist/` a Vercel, Netlify o GitHub Pages.

---

## Otros archivos en el repo

- `Test1.java` / `SeleniumTestFirefox.zip` — Proyecto de pruebas Selenium (independiente del ebook)

---

*InmoSmart AI © 2026*
