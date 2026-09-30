# Loop de QA agéntico

7 pasos orquestados por agentes de IA en Claude Code, cada uno respaldado por un control
determinista que **no se negocia**: el agente aporta criterio y el script verifica.

```
01 Riesgo ─► 02 Diseño ⇄ 03 Juez (gate 1) ─► 04 Automatización ─► 05 Mutation (gate 2)
                                                    │                         │
                                         06 Ambiente efímero + seed ◄─────────┘
                                                    │
                                              07 Triage y RCA ──► Jira (solo bugs reales)
                                                    │
                          defect-log.json ◄─────────┘  (cada bug reevalúa la matriz de riesgo)
```

| Paso | Agente (`.claude/agents/`) | Control determinista | Salida |
|------|----------------------------|----------------------|--------|
| **01 · Riesgo y alcance** | `qa-risk-analyst` | `npm run risk` — riesgo = probabilidad (diff, complejidad, churn, defectos) × impacto (criticidad del PRD) | `reports/risk-matrix.md` |
| **02 · Diseño de casos** | `qa-test-designer` | — (particiones, valores límite, tablas de decisión, transición de estados) | `features/*.feature` (Gherkin, `@AC-XX`) |
| **03 · Juez de casos (gate 1)** | `qa-case-judge` | `npm run gate:cases` — 100 % de los AC con caso, y negativo donde se exige | `reports/gate1-cases.md` |
| **04 · Automatización** | `playwright-test-planner` → `-generator` → `-healer` | `npm run gate:automation` (cada escenario tiene test) · `npm run test:scope` | `tests/`, `perf/` (k6), `security/` (ZAP) |
| **05 · Review + mutation (gate 2)** | `qa-mutation-reviewer` | `npm --prefix ../web run test:mutation` — Stryker, score ≥ 70 % | `reports/mutation/` |
| **06 · Ambientes y datos** | `qa-env-manager` | `docker-compose.qa.yml` (un proyecto por PR) · datos seed en `seed/` | ambiente aislado y reproducible |
| **07 · Triage y RCA** | `qa-triage` | `npm run triage` — bug real / test roto / ambiente / flaky, con evidencia | `reports/triage.md`, issues en Jira |

## Regla de oro

**El self-healing solo toca locators, nunca aserciones, y siempre por PR con aprobación humana.**
Un agente que "arregla" una aserción está escondiendo un bug. Así se hace cumplir:

- Todos los locators viven en el Page Object `tests/pages/`; los specs solo tienen pasos y aserciones.
- El healer (`.claude/agents/playwright-test-healer.md`) tiene prohibido tocar specs, aserciones, `test.fixme()` o timeouts.
- `scripts/guard-healing.mjs` corre en CI: en ramas `heal/*` (o con la etiqueta `self-healing`) bloquea cualquier cambio fuera
  de `tests/pages/` o en una línea con aserción. En el resto de PR avisa si se eliminan aserciones.
- `.github/CODEOWNERS` exige revisión humana de `qa/tests/`, `qa/features/` y `qa/requirements/`.

## Uso

### Con agentes (Claude Code)

```
/qa-loop                 # loop completo sobre el cambio actual contra origin/main
/qa-loop develop         # contra otra rama base
```

O un paso concreto: *"usa qa-test-designer para los AC nuevos del PRD"*, *"pasa qa-triage al último reporte"*.

El MCP `playwright-test` (`.mcp.json`) da a los agentes de Playwright un navegador real para explorar la app y
validar cada locator antes de escribirlo.

### Sin agentes (local o CI)

```bash
cd qa && npm ci && npx playwright install chromium
cd ../web && npm ci

cd ../qa
npm run loop                  # 01 → 03 → 05 → 04 → 07, con gates bloqueantes
npm run loop -- --all         # toda la suite, ignorando el alcance por riesgo
npm run test:e2e              # toda la suite Playwright
npm run triage -- --learn     # registra los bugs reales en config/defect-log.json
```

Ambiente efímero con Docker (paso 06) y pruebas no funcionales:

```bash
docker compose -p qa-local -f qa/docker-compose.qa.yml up -d --wait
BASE_URL=http://localhost:4173 npm --prefix qa run test:scope
BASE_URL=http://localhost:4173 k6 run qa/perf/smoke.js
docker compose -p qa-local -f qa/docker-compose.qa.yml down -v
```

### CI (`.github/workflows/qa-loop.yml`)

En cada PR que toque `web/` o `qa/`: matriz de riesgo y gate 1 → unit + mutation (gate 2) → ambiente efímero por PR con
Playwright (solo el alcance del riesgo), k6 y ZAP baseline → triage con evidencia como artefacto → el ambiente se destruye.
Los resúmenes de cada paso aparecen en el *Job summary* del PR.

Para crear bugs en Jira desde CI, configura los secrets `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` y la variable
`JIRA_PROJECT` del repositorio.

## Integraciones MCP opcionales

El loop funciona solo con archivos del repo (PRD, features, reportes). Si conectas estos MCP en Claude Code,
los agentes los usan como destino adicional:

| Paso | MCP | Para qué |
|------|-----|----------|
| 01 | Notion | Publicar la matriz de riesgo en la página del sprint / leer el PRD |
| 02 | TestRail | Sincronizar los escenarios como casos (referencia `AC-XX`) |
| 07 | Jira (Atlassian) | Crear los bugs reales con su RCA |

Añádelos con `claude mcp add` según la documentación de cada proveedor.

## Cómo adaptarlo a otra funcionalidad

1. Añade los criterios de aceptación a `requirements/landing.prd.md` (o crea otro PRD y apúntalo en `config/criticality.json`).
2. Mapea los archivos de código a esos AC en `config/criticality.json` (el impacto sale de la criticidad del AC).
3. Corre `/qa-loop`: el diseñador escribe los escenarios, el juez los valida, los agentes de Playwright los automatizan.
4. Si hay lógica de negocio nueva, extráela a funciones puras y añádela a `mutate` en `web/stryker.config.json`.

## Primer ciclo: qué encontró

El primer ciclo sobre esta landing encontró 2 **bugs reales** (no tests rotos), que se corrigieron en el producto sin tocar
ninguna aserción:

- **AC-07**: los enlaces `#precios` y `#faq` dejaban la sección tapada por el header fijo. RCA: `main.js` calculaba el offset con
  `parseInt('4.5rem')` = **4 px** en vez de 72 px. Fix: usar `header.offsetHeight`.
- **AC-08**: 32 elementos con contraste insuficiente (WCAG AA): texto gris `#718096` (4.01:1), etiquetas doradas sobre fondo
  claro (2.1:1) y títulos verde y rojo. Fix: nuevos tonos con contraste ≥ 4.5:1.

Mutation testing: 89,66 % en la primera pasada (3 mutantes sobrevivientes en `isHotmartReady`), 100 % después de añadir los
tests que los matan. Los bugs quedaron registrados en `config/defect-log.json`, así que el próximo cambio en esas áreas tendrá
más probabilidad en la matriz de riesgo.
