#!/usr/bin/env node
// 03 · Juez de casos — gate 1.
// Verificación determinista que acompaña al agente juez (evaluator-optimizer):
//   1. Cada criterio de aceptación del PRD tiene al menos un escenario.
//   2. Cada CA marcado [negativo] tiene al menos un escenario @negative.
//   3. Ningún escenario queda huérfano (sin AC o con un AC que no existe).
// Con --automation, además (antes de cerrar el paso 04):
//   4. Cada escenario tiene un test automatizado con el mismo nombre
//      (o, si es @perf / @security, un script que cite su AC).
// Sale con código 1 si algo falla: el diseño vuelve al paso 02.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { QA_DIR, args, listFiles, mdTable, parseFeatures, parsePrd, writeReport } from './lib.mjs';

const opts = args();
const cfg = JSON.parse(readFileSync(join(QA_DIR, 'config/criticality.json'), 'utf8'));
const acs = parsePrd(join(QA_DIR, cfg.prd));
const scenarios = parseFeatures(join(QA_DIR, 'features'));
const acIds = new Set(acs.map((a) => a.id));
const acTags = (s) => s.tags.filter((t) => /^@AC-\d+$/.test(t)).map((t) => t.slice(1));

const problems = [];
const rows = acs.map((ac) => {
  const mine = scenarios.filter((s) => acTags(s).includes(ac.id));
  const negatives = mine.filter((s) => s.tags.includes('@negative'));
  const status = [];
  if (!mine.length) status.push('SIN CASOS');
  if (ac.needsNegative && !negatives.length) status.push('FALTA NEGATIVO');
  for (const st of status) problems.push(`${ac.id}: ${st} — ${ac.text}`);
  return [ac.id, ac.criticality, mine.length, `${negatives.length}${ac.needsNegative ? ' (requerido)' : ''}`, status.join(', ') || 'OK'];
});

for (const s of scenarios) {
  const tags = acTags(s);
  if (!tags.length) problems.push(`Escenario huérfano (sin @AC-XX): "${s.name}" ${s.file}:${s.line}`);
  for (const t of tags) if (!acIds.has(t)) problems.push(`Escenario con AC inexistente ${t}: "${s.name}" ${s.file}:${s.line}`);
}

let automationRows = [];
if (opts.automation) {
  const read = (dir, ext) => listFiles(join(QA_DIR, dir), (f) => ext.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
  const testSrc = read('tests', /\.spec\.(m?js|ts)$/);
  const nonFunctionalSrc = read('perf', /\.m?js$/) + read('security', /\.(conf|tsv|m?js|ya?ml)$/);
  automationRows = scenarios.map((s) => {
    const nonFunctional = s.tags.includes('@perf') || s.tags.includes('@security');
    const ok = nonFunctional
      ? acTags(s).every((t) => nonFunctionalSrc.includes(t))
      : testSrc.includes(`'${s.name}'`) || testSrc.includes(`\`${s.name}\``) || testSrc.includes(`"${s.name}"`);
    if (!ok) problems.push(`Escenario sin automatizar: "${s.name}" ${s.file}:${s.line}`);
    return [s.name, acTags(s).join(' '), ok ? 'OK' : 'FALTA'];
  });
}

const covered = rows.filter((r) => r[4] === 'OK').length;
const pct = acs.length ? Math.round((covered / acs.length) * 100) : 0;
const passed = problems.length === 0;

const md = [
  `# 03 · Gate 1 — cobertura de criterios de aceptación: ${passed ? '✅ PASA' : '❌ NO PASA'}`,
  '',
  `CA cubiertos: **${covered}/${acs.length} (${pct} %)** · escenarios: ${scenarios.length}`,
  '',
  mdTable(['AC', 'Criticidad', 'Escenarios', 'Negativos', 'Estado'], rows),
  '',
  ...(opts.automation ? ['## Trazabilidad escenario → test', '', mdTable(['Escenario', 'AC', 'Automatizado'], automationRows), ''] : []),
  ...(problems.length ? ['## Qué falta (vuelve al paso 02)', '', ...problems.map((p) => `- ${p}`), ''] : []),
].join('\n');

writeReport(opts.automation ? 'gate1-automation.md' : 'gate1-cases.md', md);
writeReport(opts.automation ? 'gate1-automation.json' : 'gate1-cases.json', { passed, coveragePct: pct, problems });
console.log(md);
process.exit(passed ? 0 : 1);
