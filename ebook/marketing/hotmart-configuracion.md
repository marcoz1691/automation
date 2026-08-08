# Configurar producto en Hotmart — InmoSmart AI

**Cuenta:** Hotmart activa ✅  
**Producto:** Vende tu Propiedad Más Rápido con Inteligencia Artificial  
**Mercado:** Ecuador + Latinoamérica · Precios en USD

---

## Paso 1 — Crear producto en Hotmart

1. Entra a [Hotmart](https://app.hotmart.com) → **Productos** → **Crear producto**
2. Tipo: **eBook** o **Producto digital**
3. Categoría sugerida: Finanzas / Desarrollo personal / Otros → Inmobiliario

### Producto 1: Edición Completa ⭐ (crear primero)

| Campo | Valor |
|-------|-------|
| **Nombre** | InmoSmart AI — Edición Completa |
| **Precio** | USD 29 (lanzamiento) → USD 47 (regular después) |
| **Descripción corta** | Guía práctica en español para vender tu casa o departamento con IA, ChatGPT, Canva y marketing digital. Incluye 110+ prompts, plantillas y guía Ecuador. |
| **Idioma** | Español |
| **País objetivo** | Ecuador, Colombia, México, Perú, Chile, etc. |

### Producto 2: Edición Esencial

| Campo | Valor |
|-------|-------|
| **Nombre** | InmoSmart AI — Edición Esencial |
| **Precio** | USD 17 (lanzamiento) → USD 27 (regular) |
| **Descripción corta** | Ebook completo 14 capítulos + 6 checklists. Método InmoSmart AI para vender propiedades con inteligencia artificial. |

---

## Paso 2 — Subir archivos digitales

### Edición Esencial — contenido

Sube **1 archivo**:
- `ebook/export/InmoSmart-AI-Ebook-Ecuador.pdf`  
  *(o `ebook-nucleo.md` exportado si prefieres versión sin anexos largos)*

### Edición Completa — contenido

Crea un **ZIP** con:

```
InmoSmart-AI-Completa/
├── InmoSmart-AI-Ebook-Ecuador.pdf      ← PDF principal
├── recursos/
│   ├── checklists.md
│   ├── plantillas.md
│   ├── prompts-ia.md                   ← 110 prompts
│   ├── mensajes-whatsapp.md
│   ├── calendario-contenido.md
│   └── casos-practicos.md
└── adaptaciones/
    └── ecuador.md
```

**Comando para generar ZIP** (desde la raíz del proyecto):

```bash
cd /workspace/ebook
zip -r ../InmoSmart-AI-Completa.zip \
  export/InmoSmart-AI-Ebook-Ecuador.pdf \
  recursos/checklists.md \
  recursos/plantillas.md \
  recursos/prompts-ia.md \
  recursos/mensajes-whatsapp.md \
  recursos/calendario-contenido.md \
  recursos/casos-practicos.md \
  adaptaciones/ecuador.md \
  adaptaciones/colombia.md \
  adaptaciones/peru.md \
  adaptaciones/chile.md \
  adaptaciones/mexico.md
```

Sube el ZIP en Hotmart → **Contenido del producto** → Archivos para descarga.

---

## Paso 3 — Página de ventas en Hotmart

Hotmart permite página propia o externa.

**Opción A (recomendada):** Usar tu landing `web/` como página externa  
- En Hotmart: **Página de ventas** → URL externa → tu dominio desplegado  
- Los botones ya llevan al checkout Hotmart

**Opción B:** Copiar descripción larga desde:
- `ebook/marketing/pagina-ventas.md` (bloques 1–12)
- `ebook/diseno/portada.md` (descripción larga)

**Textos listos para Hotmart** → ver `hotmart-textos-producto.md` (mismo folder)

---

## Paso 4 — Obtener links de pago

1. Hotmart → **Producto** → **Enlaces**
2. Copia el link de checkout. Formato típico:
   ```
   https://pay.hotmart.com/XXXXXXXX?checkoutMode=10
   ```
3. Repite para Esencial y Completa (2 productos = 2 links)

---

## Paso 5 — Conectar a la landing

Edita `web/js/config.js`:

```javascript
export const config = {
  paymentMode: 'platform',
  platform: 'hotmart',

  checkoutUrls: {
    esencial: 'https://pay.hotmart.com/TU_CODIGO_ESENCIAL',
    completa: 'https://pay.hotmart.com/TU_CODIGO_COMPLETA',
  },

  // WhatsApp solo para soporte (opcional)
  whatsappNumber: '593XXXXXXXXX',
  whatsappSupport: true,
};
```

Guarda → `npm run build` → redespliega `web/dist/`

---

## Paso 6 — Configuración recomendada en Hotmart

| Ajuste | Valor sugerido |
|--------|----------------|
| **Garantía** | 7 días (activar política de reembolso Hotmart) |
| **Moneda** | USD |
| **Afiliados** | Activar si quieres red de promotores (comisión 30–50%) |
| **Email post-compra** | Activar entrega automática + email bienvenida |
| **Área de miembros** | Opcional; el ZIP/PDF puede bastar |
| **Order bump** | Pack prompts extra USD 9 (fase 2, opcional) |

---

## Paso 7 — Probar compra

1. Hotmart → **Modo prueba** / compra con tarjeta de prueba si disponible  
2. Verifica que llega el email con descarga  
3. Comprueba que el PDF y ZIP se abren correctamente  
4. Prueba botones desde tu landing

---

## Checklist final

- [ ] Producto Esencial creado (USD 17)
- [ ] Producto Completa creado (USD 29)
- [ ] PDF/ZIP subidos
- [ ] Links de pago copiados a `web/js/config.js`
- [ ] Garantía 7 días activa
- [ ] Compra de prueba realizada
- [ ] Landing redesplegada con links reales

---

## ¿Me pasas tus links?

Cuando tengas los dos links de Hotmart, compártelos y los conecto automáticamente en la landing.

Formato:
```
Esencial: https://pay.hotmart.com/...
Completa: https://pay.hotmart.com/...
```

---

*InmoSmart AI · Integración Hotmart v1.0*
