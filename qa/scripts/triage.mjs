#!/usr/bin/env node
// 07 · Triage y RCA.
// Clasifica cada fallo del reporte de Playwright con su evidencia (trace, screenshot, logs):
//   bug real · test roto · ambiente · flaky · sin clasificar
// Solo los bugs reales se proponen para Jira (y se crean con --jira si hay credenciales).
// Con --learn, los bugs reales se registran en config/defect-log.json y suben la
// probabilidad en la siguiente matriz de riesgo: el loop aprende en cada ciclo.
//
// Uso: node scripts/triage.mjs [--report reports/playwright.json] [--jira] [--learn]
import { existsSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { QA_DIR, REPO_ROOT, args, mdTable, readJson, writeReport } from './lib.mjs';

const opts = args();
const reportPath = resolve(QA_DIR, opts.report || 'reports/playwright.json');
if (!existsSync(reportPath)) {
  console.error(`No existe ${reportPath}. Ejecuta primero la suite (npm run test:e2e).`);
  process.exit(2);
}
const report = readJson(reportPath);
const cfg = readJson(join(QA_DIR, 'config/criticality.json'));

// ---------- Clasificación ----------
const RULES = [
  {
    kind: 'ambiente',
    re: /net::ERR_|ECONNREFUSED|ENOTFOUND|ECONNRESET|socket hang up|\b50[234]\b|browserType\.launch|Executable doesn't exist|webServer|Target page, context or browser has been closed/i,
    action: 'Revisar el ambiente efímero (docker compose / webServer) y relanzar. No es un bug del producto.',
  },
  {
    kind: 'test roto',
    re: /strict mode violation|resolved to \d+ elements|element\(s\) not found|waiting for (locator|getBy)|locator\.\w+: Timeout|Unexpected token|is not a function|Cannot read propert/i,
    action: 'Candidato a self-healing: el healer puede proponer un PR que SOLO toque tests/pages/ (locators). Requiere aprobación humana.',
  },
  {
    kind: 'bug real',
    re: /expect\(|Expected|Received|toHave|toBe|toEqual|toContain|violaciones|serious|critical/i,
    action: 'Bug del producto: la aserción es correcta y la app no cumple el criterio de aceptación. Va a Jira con su causa raíz.',
  },
];

function classify(test, lastError) {
  if (test.status === 'flaky') {
    return { kind: 'flaky', action: 'Pasó al reintentar. Estabilizar (esperas por estado, datos aislados) — nunca subir timeouts a ciegas.' };
  }
  for (const r of RULES) if (r.re.test(lastError)) return { kind: r.kind, action: r.action };
  return { kind: 'sin clasificar', action: 'Requiere revisión humana.' };
}

const strip = (s = '') => s.replace(/\u001b\[[0-9;]*m/g, '');

function* walk(suite, parents = []) {
  const path = suite.title ? [...parents, suite.title] : parents;
  for (const spec of suite.specs || []) {
    for (const test of spec.tests) yield { spec, test, path, file: spec.file };
  }
  for (const child of suite.suites || []) yield* walk(child, path);
}

const failures = [];
let total = 0;
for (const root of report.suites) {
  for (const { spec, test, path, file } of walk(root)) {
    total++;
    if (test.status === 'expected' || test.status === 'skipped') continue;
    const results = test.results;
    const failed = results.filter((r) => r.status !== 'passed');
    const last = failed.at(-1) || results.at(-1);
    const error = strip(last?.error?.message || last?.errors?.map((e) => e.message).join('\n') || '');
    const { kind, action } = classify(test, error);
    const evidence = (last?.attachments || [])
      .filter((a) => a.path)
      .map((a) => ({ name: a.name, path: relative(REPO_ROOT, a.path) }));
    const logs = [...(last?.stdout || []), ...(last?.stderr || [])].map((l) => strip(l.text || '')).join('').trim();
    const acs = (spec.tags || []).filter((t) => /^AC-\d+$/.test(t));
    const suspects = [...new Set(cfg.areas.filter((a) => a.acs.some((ac) => acs.includes(ac))).map((a) => a.pattern))];
    failures.push({
      title: spec.title,
      fullTitle: [...path.slice(1), spec.title].join(' › '),
      location: `qa/tests/${file}:${spec.line}`,
      acs,
      kind,
      action,
      retries: results.length - 1,
      error: error.split('\n').slice(0, 12).join('\n'),
      signature: `${acs.join(',')}|${error.split('\n')[0].replace(/\d+/g, 'N').slice(0, 160)}`,
      evidence,
      logs: logs.slice(0, 2000),
      rcaSuspects: suspects,
    });
  }
}

// Mismo AC + mismo error = un solo bug (p. ej. un escenario outline con varios ejemplos).
const groups = new Map();
for (const f of failures) {
  const g = groups.get(f.signature) || { ...f, occurrences: [] };
  g.occurrences.push(f.fullTitle);
  groups.set(f.signature, g);
}
const triaged = [...groups.values()];
const count = (k) => triaged.filter((t) => t.kind === k).length;
const bugs = triaged.filter((t) => t.kind === 'bug real');

// ---------- Jira (solo bugs reales) ----------
async function createJiraIssues() {
  const { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT } = process.env;
  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT) {
    console.warn('⚠️  --jira: faltan JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN / JIRA_PROJECT. No se crean issues.');
    return [];
  }
  const auth = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  const headers = { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' };
  const created = [];
  for (const bug of bugs) {
    const summary = `[QA][${bug.acs.join(',')}] ${bug.title}`.slice(0, 250);
    const jql = `project = "${JIRA_PROJECT}" AND summary ~ "\\"${summary.replace(/["\\]/g, ' ')}\\"" AND statusCategory != Done`;
    const search = await fetch(`${JIRA_BASE_URL}/rest/api/3/search/jql`, { method: 'POST', headers, body: JSON.stringify({ jql, maxResults: 1, fields: ['key'] }) });
    const existing = search.ok ? (await search.json()).issues?.[0]?.key : null;
    if (existing) {
      created.push({ key: existing, summary, duplicate: true });
      continue;
    }
    const text = [
      `Criterio(s) de aceptación: ${bug.acs.join(', ')}`,
      `Test: ${bug.location}`,
      `Ocurrencias: ${bug.occurrences.join(' | ')}`,
      '',
      'Error:',
      bug.error,
      '',
      `Causa raíz — archivos sospechosos: ${bug.rcaSuspects.join(', ') || 'n/d'}`,
      `Evidencia (artefacto del pipeline): ${bug.evidence.map((e) => e.path).join(', ')}`,
    ].join('\n');
    const body = {
      fields: {
        project: { key: JIRA_PROJECT },
        issuetype: { name: process.env.JIRA_ISSUE_TYPE || 'Bug' },
        summary,
        labels: ['qa-loop', ...bug.acs],
        description: { type: 'doc', version: 1, content: [{ type: 'codeBlock', content: [{ type: 'text', text }] }] },
      },
    };
    const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, { method: 'POST', headers, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) console.error(`❌ Jira: no se pudo crear "${summary}": ${res.status} ${JSON.stringify(json).slice(0, 300)}`);
    else created.push({ key: json.key, summary });
  }
  return created;
}

const jira = opts.jira ? await createJiraIssues() : [];

// ---------- Aprendizaje: bugs reales → matriz de riesgo ----------
if (opts.learn && bugs.length) {
  const logPath = join(QA_DIR, 'config/defect-log.json');
  const log = readJson(logPath, { defects: [] });
  const today = new Date().toISOString().slice(0, 10);
  for (const bug of bugs) {
    for (const ac of bug.acs) {
      if (!log.defects.some((d) => d.ac === ac && d.signature === bug.signature)) {
        log.defects.push({ ac, date: today, test: bug.title, signature: bug.signature, jira: jira.find((j) => j.summary.includes(bug.title))?.key ?? null });
      }
    }
  }
  writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');
}

// ---------- Reporte ----------
const summary = { total, failures: failures.length, groups: triaged.length, bugReal: count('bug real'), testRoto: count('test roto'), ambiente: count('ambiente'), flaky: count('flaky'), sinClasificar: count('sin clasificar') };
const md = [
  '# 07 · Triage y RCA',
  '',
  `Tests: ${total} · fallos: ${failures.length} · agrupados: ${triaged.length}`,
  '',
  mdTable(['Clase', 'Cantidad'], [['🐞 bug real', summary.bugReal], ['🔧 test roto', summary.testRoto], ['🌩️ ambiente', summary.ambiente], ['🎲 flaky', summary.flaky], ['❓ sin clasificar', summary.sinClasificar]]),
  '',
  ...triaged.flatMap((t) => [
    `## ${t.kind === 'bug real' ? '🐞' : t.kind === 'test roto' ? '🔧' : t.kind === 'ambiente' ? '🌩️' : t.kind === 'flaky' ? '🎲' : '❓'} ${t.kind} — ${t.title} (${t.acs.join(', ') || 'sin AC'})`,
    '',
    `- Test: \`${t.location}\` · ocurrencias: ${t.occurrences.length} · reintentos: ${t.retries}`,
    `- Acción: ${t.action}`,
    ...(t.kind === 'bug real' ? [`- RCA — archivos sospechosos: ${t.rcaSuspects.map((s) => `\`${s}\``).join(', ') || 'n/d'}`] : []),
    `- Evidencia: ${t.evidence.map((e) => `${e.name} → \`${e.path}\``).join(' · ') || 'n/d'}`,
    '',
    '```',
    t.error,
    '```',
    '',
  ]),
  ...(jira.length ? ['## Jira', '', ...jira.map((j) => `- ${j.key}${j.duplicate ? ' (ya existía)' : ''}: ${j.summary}`), ''] : []),
].join('\n');

writeReport('triage.json', { summary, triaged, jira });
writeReport('triage.md', md);
console.log(md);
// Falla el pipeline solo si hay bugs reales o fallos sin clasificar.
process.exit(summary.bugReal + summary.sinClasificar > 0 ? 1 : 0);
