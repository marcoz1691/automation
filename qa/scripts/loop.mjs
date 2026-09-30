#!/usr/bin/env node
// Ejecuta de una vez los pasos DETERMINISTAS del loop (sin agentes), en orden y con los gates bloqueantes:
//   01 riesgo → 03 gate 1 (diseño + trazabilidad) → 05 unit + mutation (gate 2) → 04/06 Playwright en alcance
//   → AC-09 k6 (si está instalado) → 07 triage.
// Los pasos con criterio (diseñar casos, generar tests, RCA, healing) los hacen los agentes: /qa-loop en Claude Code.
//
// Uso: npm --prefix qa run loop [-- --base origin/main] [--all] [--learn]
import { spawnSync } from 'node:child_process';
import { QA_DIR, REPO_ROOT, args, mdTable, writeReport } from './lib.mjs';

const opts = args();
const results = [];

function step(id, name, cmd, cmdArgs, { cwd = QA_DIR, gate = false, env = {} } = {}) {
  console.log(`\n━━━ ${id} · ${name} ━━━\n$ ${[cmd, ...cmdArgs].join(' ')}`);
  const res = spawnSync(cmd, cmdArgs, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
  const ok = res.status === 0;
  results.push([id, name, res.error ? '⏭️ no disponible' : ok ? '✅' : gate ? '❌ GATE' : '❌']);
  if (!ok && gate && !res.error) finish(1);
  return ok;
}

function finish(code) {
  const md = ['# Loop de QA — resumen', '', mdTable(['Paso', 'Qué', 'Resultado'], results), '', 'Detalle en `qa/reports/`.', ''].join('\n');
  writeReport('loop-summary.md', md);
  console.log('\n' + md);
  process.exit(code);
}

const base = opts.base ? ['--base', opts.base] : [];
step('01', 'Riesgo y alcance', 'node', ['scripts/risk-matrix.mjs', ...base]);
step('03', 'Gate 1 · diseño de casos', 'node', ['scripts/ac-coverage-gate.mjs'], { gate: true });
step('03b', 'Gate 1 · trazabilidad escenario → test', 'node', ['scripts/ac-coverage-gate.mjs', '--automation'], { gate: true });
step('05', 'Unit tests + cobertura', 'npm', ['run', 'test:coverage'], { cwd: `${REPO_ROOT}/web`, gate: true });
step('05b', 'Gate 2 · mutation testing (≥ 70 %)', 'npm', ['run', 'test:mutation'], { cwd: `${REPO_ROOT}/web`, gate: true });
const e2eOk = step('04', 'Playwright UI + a11y (alcance por riesgo)', 'node', ['scripts/run-scope.mjs', ...(opts.all ? ['--all'] : [])]);
// k6 necesita un ambiente vivo (paso 06): solo corre si BASE_URL apunta a uno (docker compose / preview).
if (process.env.BASE_URL) step('AC-09', 'Performance k6', 'k6', ['run', '-q', 'qa/perf/smoke.js'], { cwd: REPO_ROOT, env: { K6_NO_USAGE_REPORT: 'true' } });
else results.push(['AC-09', 'Performance k6', '⏭️ sin BASE_URL (levanta el ambiente del paso 06)']);
if (!e2eOk) step('07', 'Triage y RCA', 'node', ['scripts/triage.mjs', ...(opts.learn ? ['--learn'] : [])]);
else results.push(['07', 'Triage y RCA', '✅ sin fallos que clasificar']);
finish(results.some((r) => r[2].startsWith('❌')) ? 1 : 0);
