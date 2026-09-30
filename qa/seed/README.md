# Datos seed (06 · Ambientes y datos)

Set conocido y versionado que se carga al inicio de cada test. La landing lee
`web/js/config.js`; los tests interceptan esa petición y sirven un seed de aquí
(`tests/support/fixtures.js → seedConfig`). Así el resultado no depende de los links
reales que haya en `config.js` y cada ejecución es reproducible.

| Seed | Estado |
|------|--------|
| `hotmart.json` | Base: Hotmart con links para ambas ediciones (por defecto en todos los tests) |

Las variantes (sin links, solo una edición, modo WhatsApp, números con símbolos) se
derivan del base con `seedConfig(page, { ...overrides })`, para que cada test declare
exactamente qué parte del estado cambia.
