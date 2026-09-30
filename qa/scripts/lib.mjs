// Utilidades compartidas por los scripts del loop de QA.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const QA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = resolve(QA_DIR, '..');
export const REPORTS_DIR = join(QA_DIR, 'reports');

export function git(args, opts = {}) {
  try {
    return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
  } catch {
    return null;
  }
}

export function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeReport(name, content) {
  mkdirSync(REPORTS_DIR, { recursive: true });
  const path = join(REPORTS_DIR, name);
  writeFileSync(path, typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n');
  return relative(REPO_ROOT, path);
}

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) out._.push(a);
    else if (a.includes('=')) out[a.slice(2, a.indexOf('='))] = a.slice(a.indexOf('=') + 1);
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
    else out[a.slice(2)] = true;
  }
  return out;
}

/** Glob mínimo: `**` = cualquier ruta, `*` = cualquier cosa sin `/`. */
export function globToRegex(glob) {
  const re = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '.*');
  return new RegExp(`^${re}$`);
}

/** Lee los criterios de aceptación del PRD. */
export function parsePrd(path) {
  const text = readFileSync(path, 'utf8');
  const acs = [];
  const re = /^- \*\*(AC-\d+)\*\* \(criticidad (\d)\)( \[negativo\])? (.+)$/gm;
  for (const m of text.matchAll(re)) {
    acs.push({ id: m[1], criticality: Number(m[2]), needsNegative: Boolean(m[3]), text: m[4].trim() });
  }
  return acs;
}

/** Lee los escenarios Gherkin con sus tags (incluye tags de Feature). */
export function parseFeatures(dir) {
  const scenarios = [];
  for (const file of listFiles(dir, (f) => f.endsWith('.feature'))) {
    const lines = readFileSync(file, 'utf8').split('\n');
    let pending = [];
    let featureTags = [];
    lines.forEach((raw, i) => {
      const line = raw.trim();
      if (line.startsWith('@')) {
        pending.push(...line.split(/\s+/).filter((t) => t.startsWith('@')));
      } else if (/^(Feature|Característica|Funcionalidad):/.test(line)) {
        featureTags = pending;
        pending = [];
      } else if (/^(Scenario|Scenario Outline|Escenario|Esquema del escenario):/.test(line)) {
        scenarios.push({
          file: relative(REPO_ROOT, file),
          line: i + 1,
          name: line.replace(/^[^:]+:\s*/, ''),
          tags: [...new Set([...featureTags, ...pending])],
        });
        pending = [];
      }
    });
  }
  return scenarios;
}

export function listFiles(dir, filter = () => true) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (entry === 'node_modules') continue;
    if (statSync(p).isDirectory()) out.push(...listFiles(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out;
}

export function mdTable(headers, rows) {
  const esc = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(esc).join(' | ')} |`),
  ].join('\n');
}
