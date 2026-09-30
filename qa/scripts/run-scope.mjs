#!/usr/bin/env node
// Ejecuta en Playwright solo el alcance que decidió la matriz de riesgo (paso 01):
//   AC "a fondo" → todos sus escenarios · AC "smoke" → solo sus escenarios @smoke · "fuera" → nada.
// Uso: node scripts/run-scope.mjs [--all] [...args de playwright]
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { QA_DIR, readJson } from './lib.mjs';

const passthrough = process.argv.slice(2).filter((a) => a !== '--all');
const risk = readJson(join(QA_DIR, 'reports/risk-matrix.json'));
const runAll = process.argv.includes('--all') || !risk;

let grep = null;
if (!runAll) {
  const parts = [
    ...risk.deep.map((ac) => `(?=.*@${ac}\\b)`),
    ...risk.smoke.map((ac) => `(?=.*@${ac}\\b)(?=.*@smoke\\b)`),
  ];
  if (!parts.length) {
    console.log('La matriz de riesgo deja todos los AC fuera de alcance: no hay tests de producto que ejecutar.');
    process.exit(0);
  }
  grep = `^(?:${parts.join('|')})`;
  console.log(`Alcance → a fondo: ${risk.deep.join(', ') || '—'} · smoke: ${risk.smoke.join(', ') || '—'}`);
}

const cmd = ['playwright', 'test', ...(grep ? ['--grep', grep] : []), ...passthrough];
console.log(`npx ${cmd.map((c) => (/\s|\(/.test(c) ? JSON.stringify(c) : c)).join(' ')}`);
const res = spawnSync('npx', cmd, { cwd: QA_DIR, stdio: 'inherit' });
process.exit(res.status ?? 1);
