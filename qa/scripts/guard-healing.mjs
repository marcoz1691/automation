#!/usr/bin/env node
// Regla de oro: el self-healing solo toca locators, nunca aserciones, y siempre por PR con aprobación humana.
//
// Modo healing (--healing, o rama heal/*): el diff SOLO puede tocar qa/tests/pages/** (Page Objects,
// donde viven los locators) y ninguna línea cambiada puede contener una aserción.
// Modo normal: avisa (sin fallar) si el PR elimina más aserciones de las que añade en los specs,
// para que el revisor humano lo mire: un test que "deja de afirmar" puede esconder un bug.
//
// Uso: node scripts/guard-healing.mjs [--base origin/main] [--healing]
import { args, git, writeReport } from './lib.mjs';

const opts = args();
const branch = process.env.GITHUB_HEAD_REF || git(['rev-parse', '--abbrev-ref', 'HEAD']) || '';
const healing = Boolean(opts.healing) || /^heal(ing)?\//.test(branch) || process.env.QA_HEALING === 'true';

const baseRef = [opts.base, process.env.QA_BASE_REF, 'origin/main', 'main'].filter(Boolean).find((r) => git(['merge-base', r, 'HEAD']));
if (!baseRef) {
  console.error('No se encontró la rama base (usa --base).');
  process.exit(2);
}
const range = `${git(['merge-base', baseRef, 'HEAD'])}...HEAD`;

const ALLOWED = /^qa\/tests\/pages\//;
const ASSERTION = /\bexpect(\.soft|\.poll)?\s*\(|\.(not\.)?to[A-Z]\w*\(|\bassert\w*\s*\(|toBeVisible|toHave/;

const files = (git(['diff', '--name-only', range]) || '').split('\n').filter(Boolean);
const violations = [];
const warnings = [];

for (const file of files) {
  if (healing && !ALLOWED.test(file)) violations.push(`${file}: un PR de self-healing solo puede modificar qa/tests/pages/ (locators)`);
  if (!/^qa\/tests\/.*\.(m?js|ts)$/.test(file)) continue;
  const diff = git(['diff', '-U0', range, '--', file]) || '';
  let added = 0;
  let removed = 0;
  for (const line of diff.split('\n')) {
    if (!/^[+-]/.test(line) || /^(\+\+\+|---)/.test(line)) continue;
    const code = line.slice(1).replace(/\/\/.*$/, '');
    if (!ASSERTION.test(code)) continue;
    if (line[0] === '+') added++;
    else removed++;
    if (healing) violations.push(`${file}: línea con aserción modificada → ${line.trim().slice(0, 140)}`);
  }
  if (!healing && removed > added) warnings.push(`${file}: elimina ${removed - added} aserción(es) neta(s). Revisión humana obligatoria.`);
}

const passed = violations.length === 0;
const md = [
  `# Guard de self-healing (${healing ? 'modo healing' : 'modo normal'}): ${passed ? '✅ OK' : '❌ BLOQUEADO'}`,
  '',
  `Rama: \`${branch}\` · base: \`${baseRef}\` · archivos: ${files.length}`,
  '',
  ...violations.map((v) => `- ❌ ${v}`),
  ...warnings.map((w) => `- ⚠️ ${w}`),
  ...(passed && !warnings.length ? ['Sin cambios en aserciones.'] : []),
  '',
].join('\n');
writeReport('guard-healing.md', md);
console.log(md);
process.exit(passed ? 0 : 1);
