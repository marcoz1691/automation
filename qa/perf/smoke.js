// @AC-09 · Performance: 20 VUs durante 30 s, p95 < 500 ms y errores < 1 %.
// Uso: BASE_URL=http://localhost:4173 k6 run qa/perf/smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4173';

export const options = {
  vus: Number(__ENV.VUS || 20),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status 200': (r) => r.status === 200,
    'renderiza precios': (r) => r.body.includes('USD 29') && r.body.includes('USD 17'),
  });
  sleep(1);
}
