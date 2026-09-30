---
name: qa-loop
description: Orquesta el loop de QA agéntico de 7 pasos (riesgo → diseño → gate 1 → automatización → mutation gate 2 → ambientes → triage) sobre el cambio actual. Úsalo cuando el usuario pida "correr el loop de QA", "probar este cambio/PR" o "/qa-loop".
---

# Loop de QA agéntico

Ejecuta los pasos en orden. Los **gates** son bloqueantes: no avances si fallan.
Cada paso tiene un subagente en `.claude/agents/` y un script determinista en `qa/scripts/` o `npm` scripts;
el agente aporta criterio, el script aporta la verificación que no se negocia.

| Paso | Subagente | Verificación |
|------|-----------|--------------|
| 01 Riesgo y alcance | `qa-risk-analyst` | `npm --prefix qa run risk` |
| 02 Diseño de casos | `qa-test-designer` | — |
| 03 Juez de casos (gate 1) | `qa-case-judge` | `npm --prefix qa run gate:cases` |
| 04 Automatización | `playwright-test-planner` → `playwright-test-generator` → `playwright-test-healer` | `npm --prefix qa run gate:automation` y `npm --prefix qa run test:scope` |
| 05 Review + mutation (gate 2) | `qa-mutation-reviewer` | `npm --prefix web run test:mutation` (score ≥ 70 %) |
| 06 Ambientes y datos | `qa-env-manager` | `docker compose -f qa/docker-compose.qa.yml` / `webServer` de Playwright |
| 07 Triage y RCA | `qa-triage` | `npm --prefix qa run triage` |

## Procedimiento

1. **01** — Lanza `qa-risk-analyst` con la rama base (argumento del usuario o `origin/main`). Muestra la tabla de alcance.
   Si todos los AC quedan "fuera", dilo y termina (el cambio no toca producto).
2. **02 ⇄ 03** — Si hay AC "a fondo" sin escenarios, o el PRD cambió, lanza `qa-test-designer` con esos AC.
   Después `qa-case-judge`. Si el veredicto es RECHAZADO, vuelve a `qa-test-designer` con los hallazgos.
   Máximo 3 vueltas; luego escala al usuario.
3. **04** — Para escenarios sin test (`gate:automation` los lista): `playwright-test-planner` (explora la app y escribe
   el plan en `qa/specs/`) → `playwright-test-generator` (valida cada locator en el navegador real y escribe el test).
   API/UI viven en Playwright; performance en `qa/perf/` (k6); seguridad en `qa/security/` (ZAP).
4. **06** — Asegura el ambiente (`qa-env-manager`): Docker Compose si está disponible; si no, el `webServer` de Playwright.
5. Ejecuta `npm --prefix qa run test:scope` (solo el alcance del riesgo). Si el usuario pide todo: `-- --all`.
6. **05** — Lanza `qa-mutation-reviewer`. Gate 2: mutation score ≥ 70 %.
7. **07** — Si hubo fallos, lanza `qa-triage`. Tests rotos → `playwright-test-healer` en rama `heal/*` (PR con aprobación
   humana). Bugs reales → Jira (si hay credenciales) + `--learn`.
8. Resume: alcance, gates (✅/❌), resultados, bugs reales con RCA, PRs de healing propuestos, y el enlace a `qa/reports/`.

Atajo sin agentes (solo los pasos deterministas): `npm --prefix qa run loop`.

## Regla de oro
El self-healing solo toca locators (`qa/tests/pages/**`), nunca aserciones, y siempre por PR con aprobación humana.
Un agente que "arregla" una aserción está escondiendo un bug. `qa/scripts/guard-healing.mjs` lo hace cumplir en CI.
