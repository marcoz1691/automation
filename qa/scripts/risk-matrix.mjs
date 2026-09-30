#!/usr/bin/env node
// 01 · Riesgo y alcance — risk-based testing (ISTQB): riesgo = probabilidad × impacto.
//
// Probabilidad (1–5) sale del diff y del historial:
//   tamaño del cambio, complejidad ciclomática aprox., churn (commits en 90 días)
//   y defectos previos (commits de fix + bugs reales registrados por el triage).
// Impacto (1–5) sale de la criticidad de negocio de los AC del PRD que toca el archivo.
// De la matriz sale el alcance por AC: a fondo, smoke o fuera (con justificación).
//
// Uso: node scripts/risk-matrix.mjs [--base origin/main] [--files a,b,c]
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { QA_DIR, REPO_ROOT, args, git, globToRegex, mdTable, parsePrd, readJson, writeReport } from './lib.mjs';

const opts = args();
const cfg = readJson(join(QA_DIR, 'config/criticality.json'));
const acs = parsePrd(join(QA_DIR, cfg.prd));
const acById = Object.fromEntries(acs.map((a) => [a.id, a]));
const defectLog = readJson(join(QA_DIR, 'config/defect-log.json'), { defects: [] }).defects;

// ---------- 1. Archivos cambiados ----------
function resolveBase() {
  const candidates = [opts.base, process.env.QA_BASE_REF, 'origin/main', 'main', 'HEAD~1'].filter(Boolean);
  for (const ref of candidates) {
    const mb = git(['merge-base', ref, 'HEAD']);
    if (mb) return { ref, sha: mb };
  }
  return null;
}

const base = opts.files ? null : resolveBase();
const changes = new Map(); // file -> líneas cambiadas
function addNumstat(out) {
  for (const line of (out || '').split('\n').filter(Boolean)) {
    const [add, del, file] = line.split('\t');
    const n = (Number(add) || 0) + (Number(del) || 0);
    changes.set(file, (changes.get(file) || 0) + n);
  }
}
if (opts.files) {
  for (const f of String(opts.files).split(',')) changes.set(f.trim(), 0);
} else {
  if (base) addNumstat(git(['diff', '--numstat', `${base.sha}...HEAD`]));
  addNumstat(git(['diff', '--numstat', 'HEAD'])); // cambios sin commitear
  for (const f of (git(['ls-files', '--others', '--exclude-standard']) || '').split('\n').filter(Boolean)) {
    if (!changes.has(f)) changes.set(f, lineCount(f));
  }
}

// ---------- 2. Señales de probabilidad ----------
function lineCount(file) {
  const p = join(REPO_ROOT, file);
  return existsSync(p) ? readFileSync(p, 'utf8').split('\n').length : 0;
}

function complexity(file) {
  const p = join(REPO_ROOT, file);
  if (!/\.(m?js|ts|jsx|tsx|java)$/.test(file) || !existsSync(p)) return 0;
  const src = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  const decisions = src.match(/\b(if|for|while|case|catch)\b|&&|\|\||\?\?|\?(?![.:])/g) || [];
  return decisions.length + 1;
}

function churn(file) {
  const out = git(['log', '--since=90.days', '--format=%H', '--', file]);
  return out ? out.split('\n').filter(Boolean).length : 0;
}

function fixCommits(file) {
  const out = git(['log', '-i', '-E', '--grep=fix|bug|hotfix|arregl|corrig', '--format=%H', '--', file]);
  return out ? out.split('\n').filter(Boolean).length : 0;
}

const bucket = (v, [a, b]) => (v < a ? 0 : v < b ? 1 : 2);

// ---------- 3. Matriz por archivo ----------
function areaFor(file) {
  return cfg.areas.find((a) => globToRegex(a.pattern).test(file));
}

const rows = [];
for (const [file, lines] of changes) {
  const area = areaFor(file);
  const fileAcs = area ? area.acs : [];
  const cx = complexity(file);
  const ch = churn(file);
  const defects = fixCommits(file) + defectLog.filter((d) => fileAcs.includes(d.ac)).length;
  const signals = {
    size: bucket(lines, [10, 50]),
    complexity: bucket(cx, [10, 30]),
    churn: bucket(ch, [3, 8]),
    defects: bucket(defects, [1, 3]),
  };
  const sum = Object.values(signals).reduce((a, b) => a + b, 0); // 0..8
  const probability = Math.min(5, 1 + Math.round(sum / 2));
  const impact = fileAcs.length ? Math.max(...fileAcs.map((id) => acById[id]?.criticality ?? 1)) : 1;
  const risk = probability * impact;
  const level = !fileAcs.length ? 'fuera' : risk >= cfg.thresholds.deep ? 'a fondo' : risk >= cfg.thresholds.smoke ? 'smoke' : 'fuera';
  const why = [];
  if (!area) why.push('archivo sin área mapeada en criticality.json');
  else if (!fileAcs.length) why.push('no afecta a ningún criterio de aceptación del producto');
  why.push(`líneas=${lines}, complejidad=${cx}, churn90d=${ch}, defectos=${defects}`);
  rows.push({ file, lines, complexity: cx, churn: ch, defects, signals, probability, impact, risk, level, acs: fileAcs, why: why.join('; ') });
}
rows.sort((a, b) => b.risk - a.risk);

// ---------- 4. Alcance por AC ----------
const rank = { fuera: 0, smoke: 1, 'a fondo': 2 };
const scope = Object.fromEntries(acs.map((a) => [a.id, { level: 'fuera', reason: 'ningún archivo cambiado lo afecta', files: [] }]));
for (const r of rows) {
  for (const id of r.acs) {
    if (!scope[id]) continue;
    scope[id].files.push(r.file);
    if (rank[r.level] > rank[scope[id].level]) scope[id] = { ...scope[id], level: r.level, reason: `riesgo ${r.risk} por ${r.file}` };
  }
}
const touchesProduct = rows.some((r) => r.acs.length);
if (touchesProduct) {
  for (const id of cfg.smokeAcs) {
    if (scope[id].level === 'fuera') scope[id] = { ...scope[id], level: 'smoke', reason: 'smoke obligatorio ante cualquier cambio de producto' };
  }
}

const result = {
  generatedAt: new Date().toISOString(),
  base: base?.ref ?? (opts.files ? '--files' : null),
  formula: 'riesgo = probabilidad (1-5) × impacto (1-5); a fondo ≥ ' + cfg.thresholds.deep + ', smoke ≥ ' + cfg.thresholds.smoke,
  files: rows,
  scope,
  deep: Object.keys(scope).filter((k) => scope[k].level === 'a fondo'),
  smoke: Object.keys(scope).filter((k) => scope[k].level === 'smoke'),
  out: Object.keys(scope).filter((k) => scope[k].level === 'fuera'),
};

const md = [
  '# 01 · Matriz de riesgo y alcance',
  '',
  `Base: \`${result.base}\` · ${result.formula}`,
  '',
  '## Archivos cambiados',
  '',
  rows.length
    ? mdTable(['Archivo', 'P', 'I', 'Riesgo', 'Nivel', 'AC', 'Justificación'], rows.map((r) => [r.file, r.probability, r.impact, r.risk, r.level, r.acs.join(' ') || '—', r.why]))
    : '_Sin cambios respecto a la base._',
  '',
  '## Alcance por criterio de aceptación',
  '',
  mdTable(['AC', 'Criticidad', 'Alcance', 'Motivo'], acs.map((a) => [a.id, a.criticality, scope[a.id].level, scope[a.id].reason])),
  '',
].join('\n');

const jsonPath = writeReport('risk-matrix.json', result);
const mdPath = writeReport('risk-matrix.md', md);
console.log(md);
console.log(`\n→ ${jsonPath}\n→ ${mdPath}`);
