#!/usr/bin/env node
// @AC-10 · Seguridad: falla si el baseline de OWASP ZAP reporta alertas de riesgo alto.
// Uso: node qa/security/zap-gate.mjs qa/reports/zap.json
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'qa/reports/zap.json';
const report = JSON.parse(readFileSync(file, 'utf8'));
const alerts = (report.site || []).flatMap((s) => s.alerts || []);
const RISK = { 3: 'Alto', 2: 'Medio', 1: 'Bajo', 0: 'Info' };

for (const a of alerts) console.log(`[${RISK[a.riskcode] ?? a.riskcode}] ${a.name} (${a.count ?? a.instances?.length ?? 0})`);
const high = alerts.filter((a) => String(a.riskcode) === '3');
if (high.length) {
  console.error(`❌ AC-10: ${high.length} alerta(s) de riesgo alto.`);
  process.exit(1);
}
console.log(`✅ AC-10: sin alertas de riesgo alto (${alerts.length} alertas en total).`);
