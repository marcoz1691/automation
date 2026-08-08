# Guía: Crear cuenta y conectar pagos — InmoSmart AI

**Para:** Vendedores en Ecuador y Latinoamérica sin cuenta previa  
**Tiempo estimado:** 30–60 minutos (más verificación bancaria)

> **Importante:** Nadie puede crear esta cuenta por ti. Debes usar **tu** correo, **tu** cédula/RUC y **tu** cuenta bancaria. Esta guía te lleva paso a paso.

---

## ¿Qué plataforma elegir?

| Plataforma | Mejor para | Ecuador | Dificultad | Comisión aprox. |
|------------|-----------|---------|------------|-----------------|
| **Hotmart** | LATAM, ebooks, afiliados | ✅ Muy usada | Media | ~10% + fee [VERIFICAR FUENTE] |
| **Gumroad** | Digital simple, global | ✅ Tarjeta/PayPal | Baja | ~10% + fee [VERIFICAR FUENTE] |
| **Beacons** | Creadores + link en bio | ✅ | Baja | Variable |

**Recomendación Ecuador:** Empieza con **Gumroad** (más rápido) o **Hotmart** (más alcance LATAM + afiliados).

---

## Opción A — Gumroad (la más rápida)

### 1. Crear cuenta (5 min)

1. Ve a [https://gumroad.com](https://gumroad.com)
2. Clic en **Start selling**
3. Regístrate con **Google** o **email + contraseña**
4. Confirma el correo que te envían

### 2. Configurar perfil (10 min)

1. **Settings → Profile:** nombre, foto, bio corta  
   - Ejemplo bio: *«InmoSmart AI — Guías prácticas para vender propiedades con inteligencia artificial en Latinoamérica.»*
2. **Settings → Payments:** conecta **PayPal** y/o **Stripe**  
   - En Ecuador muchos usan PayPal internacional o cuenta bancaria vía Stripe si está disponible para tu país [VERIFICAR en Gumroad al registrarte]

### 3. Crear producto — Edición Esencial (USD 17)

1. **Products → New product**
2. **Name:** `InmoSmart AI — Edición Esencial`
3. **Price:** `17` USD
4. **Description:** copia de `/ebook/marketing/pagina-ventas.md` (bloque Esencial)
5. **Content:** sube el PDF  
   - Archivo: `ebook/export/InmoSmart-AI-Ebook-Ecuador.pdf` (o versión solo núcleo si prefieres)
6. **Thumbnail:** portada del ebook (Canva 1280×720)
7. Publicar → copiar **link del producto**

### 4. Crear producto — Edición Completa (USD 29)

1. Repetir pasos con nombre `InmoSmart AI — Edición Completa`
2. **Price:** `29` USD
3. **Content:** ZIP con:
   - PDF completo
   - Carpeta `/ebook/recursos/` (checklists, plantillas, prompts)
4. Copiar link

### 5. Conectar a tu landing

Edita `web/js/main.js`:

```javascript
const CHECKOUT_URLS = {
  esencial: 'https://TU-USUARIO.gumroad.com/l/esencial',
  completa: 'https://TU-USUARIO.gumroad.com/l/completa',
};
```

---

## Opción B — Hotmart (más LATAM + afiliados)

### 1. Crear cuenta

1. [https://hotmart.com/es-es](https://hotmart.com/es-es)
2. **Registrarme** → Productor
3. Email, contraseña, país **Ecuador**
4. Verificar correo y completar perfil

### 2. Verificación y cobro

1. **Mi cuenta → Datos financieros:** cuenta bancaria ecuatoriana o método disponible
2. Documento de identidad (cédula) — puede tardar 1–3 días hábiles [VERIFICAR plazos actuales]

### 3. Registrar producto

1. **Productos → Crear producto → eBook**
2. Título: `Vende tu Propiedad Más Rápido con Inteligencia Artificial`
3. Precio en USD: 29 (Completa) — crea variante o producto separado para Esencial 17
4. Página de ventas: puedes usar la URL de Hotmart o redirigir desde tu landing `web/`
5. Área de miembros / descarga: sube PDF + ZIP

### 4. Links de pago

Hotmart genera URLs como:
`https://pay.hotmart.com/XXXXXXXX`

Pégalas en `web/js/main.js` en `CHECKOUT_URLS`.

---

## Opción C — Vender sin plataforma (mientras creas cuenta)

Si necesitas vender **hoy** sin Hotmart/Gumroad:

### WhatsApp + transferencia (manual)

1. Publica en redes con link a tu landing `web/`
2. Botón «Comprar» → abre WhatsApp con mensaje prellenado
3. Cliente transfiere a tu cuenta bancaria ecuatoriana
4. Tú envías PDF por email/WhatsApp

**Implementación rápida en la landing** — reemplaza en `index.html`:

```html
<a href="https://wa.me/593XXXXXXXXX?text=Hola,%20quiero%20la%20Edición%20Completa%20InmoSmart%20AI%20(USD%2029)"
   class="btn btn--primary btn--block">
  Comprar por WhatsApp
</a>
```

*(Cambia `593XXXXXXXXX` por tu número con código de Ecuador)*

**Ventajas:** cero comisión de plataforma, inmediato  
**Desventajas:** sin garantía automatizada, más trabajo manual, menos escala

---

## Checklist antes de vender

- [ ] PDF subido y probado (descarga funciona)
- [ ] Precio correcto en USD (17 / 29)
- [ ] Descripción honesta (sin «venta garantizada»)
- [ ] Política de reembolso 7 días configurada en plataforma
- [ ] Links pegados en `web/js/main.js`
- [ ] Prueba de compra tú mismo (modo test si existe)
- [ ] Correo de soporte configurado

---

## Datos que necesitarás tener a mano

| Dato | Uso |
|------|-----|
| Correo electrónico | Registro en plataforma |
| Cédula ecuatoriana | Verificación de identidad |
| Cuenta bancaria EC | Cobros (Hotmart) |
| PayPal (opcional) | Cobros (Gumroad) |
| RUC (opcional) | Si facturas como negocio en Ecuador |
| PDF del ebook | Producto digital |
| ZIP recursos | Edición Completa |
| Foto/logo | Perfil y portada producto |

---

## ¿Necesitas ayuda después de crear la cuenta?

Cuando tengas los links de pago, compártelos y se pueden conectar automáticamente a:

- `web/js/main.js` (botones de la landing)
- `ebook/marketing/pagina-ventas.md` (CTAs)
- Secuencia de emails

---

*InmoSmart AI · Guía de plataformas · No sustituye términos legales de Hotmart/Gumroad*
