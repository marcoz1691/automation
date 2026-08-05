# Adaptaciones por país — InmoSmart AI

**Mercado principal:** 🇪🇨 **Ecuador**  
**Mercados complementarios:** México, Colombia, Perú, Chile

---

## Cómo usar estas adaptaciones

El ebook general está redactado en español latinoamericano neutro. Las secciones marcadas `[ADAPTAR AL PAÍS]` deben completarse con el anexo del país donde vendes.

| Prioridad | Archivo | Uso |
|-----------|---------|-----|
| **Principal** | [`ecuador.md`](ecuador.md) | Lectores en Ecuador — Quito, Guayaquil, Cuenca, etc. |
| Complemento | [`mexico.md`](mexico.md) | Lectores en México |
| Complemento | [`colombia.md`](colombia.md) | Lectores en Colombia |
| Complemento | [`peru.md`](peru.md) | Lectores en Perú |
| Complemento | [`chile.md`](chile.md) | Lectores en Chile |

---

## Ecuador como mercado principal

InmoSmart AI prioriza **Ecuador** porque:

1. **Moneda:** El dólar estadounidense (USD) facilita precios claros en anuncios y negociación sin conversión cambiaria diaria.
2. **Portales activos:** Plusvalía, Mercado Libre y Facebook concentran buena parte de la búsqueda inmobiliaria.
3. **Demanda digital creciente:** Propietarios y agentes buscan diferenciarse con mejor presentación online.
4. **Ciudades clave:** Quito (Pichincha), Guayaquil (Guayas), Cuenca (Azuay), Manta (Manabí), Ambato (Tungurahua).

Al vender el ebook en Ecuador, incluye **`ecuador.md`** como anexo principal en la versión Completa y menciona en tu página de ventas: *«Incluye guía adaptada para Ecuador»*.

---

## Generar PDF con adaptaciones

```bash
cd ebook/export
npm run build
```

El PDF completo incluye anexos por país en este orden:
1. Anexo F — Ecuador *(principal)*
2. Anexo G — México
3. Anexo H — Colombia
4. Anexo I — Perú
5. Anexo J — Chile

Para un PDF **solo Ecuador** (más liviano para mercado ecuatoriano):

```bash
node build-ebook.js --pais ecuador
```

---

## Checklist rápido por país

| Tema | Ecuador | México | Colombia | Perú | Chile |
|------|---------|--------|----------|------|-------|
| Moneda anuncio | USD | MXN | COP | PEN | CLP |
| Escritura | Escritura pública + Registro | Escritura + RPP | Escritura pública | Escritura pública / SUNARP | Escritura + Conservador |
| Notario | Notaría | Notaría | Notaría | Notaría / SUNARP | Notario |
| Impuesto municipal | Predial urbano/rural | Predial | Impuesto predial | Autovalúo / arbitrios | Contribuciones |
| Portal líder | Plusvalía | Inmuebles24 | Finca Raíz / MetroCuadrado | Adondevivir / Urbania | PortalInmobiliario |

---

*InmoSmart AI · Adaptaciones v1.1 · Ecuador prioritario*
