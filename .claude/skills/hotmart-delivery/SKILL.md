---
name: hotmart-delivery
description: Prepara y verifica la entrega del ebook en Hotmart (PDF Edición Esencial, ZIP Edición Completa, textos del producto, links de pago en la landing). Úsalo cuando el usuario hable de Hotmart, publicar el producto, links pay.hotmart.com, el ZIP de entrega o precios.
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Entrega en Hotmart

| Producto | Precio | Archivo |
|----------|--------|---------|
| Edición Esencial | USD 17 | `ebook/export/InmoSmart-AI-Ebook-Ecuador.pdf` |
| Edición Completa | USD 29 | `ebook/export/InmoSmart-AI-Completa-Hotmart.zip` |

## Checklist

1. Regenera los archivos si el contenido cambió (skill `ebook-build`, modo `ecuador`).
2. Confirma que ambos archivos existen y no están vacíos: `ls -la ebook/export`.
3. Revisa que los textos del producto coincidan con `ebook/marketing/hotmart-textos-producto.md`.
4. Verifica que `web/js/config.js` tenga los links `pay.hotmart.com` reales (no placeholders).
5. Reporta qué falta; no inventes links ni credenciales.

## Referencias (léelas solo si hace falta)

- Configuración paso a paso: `ebook/marketing/hotmart-configuracion.md`
- Cuenta y pagos: `ebook/marketing/guia-crear-cuenta-pago.md`
- Precios: `ebook/marketing/estrategia-precios.md`
