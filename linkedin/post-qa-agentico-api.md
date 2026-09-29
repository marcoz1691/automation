# Post LinkedIn — Testing de APIs con agentes de IA

Tu testing de APIs, orquestado por 7 agentes de IA, y ninguno inventa un endpoint.
Así funciona el pipeline que diseñé 👇

01 · Contrato primero · OpenAPI + Postman MCP
La especificación OpenAPI es la única fuente de verdad. El agente lee el spec, no el código ni su imaginación: si un endpoint no está en el contrato, no existe y no se prueba. Cada campo con su tipo, formato y restricciones se vuelve un requisito verificable.

02 · Diseño de casos · TestRail MCP
Técnicas ISTQB aplicadas al schema: particiones de equivalencia y valores límite por campo, pairwise para combinar parámetros y tablas de decisión para las reglas de negocio. Siempre happy path, negativos, auth (401 / 403) e idempotencia.

03 · Juez de cobertura · gate 1
Un segundo agente cruza la matriz endpoint × método × código de estado documentado. Si un 404, un 409 o un 422 del spec no tiene caso, vuelve a 02. No avanza sin el 100% del contrato cubierto.

04 · Automatización · Playwright / REST Assured
Los tests no validan solo un 200: validan el JSON Schema completo de la respuesta, headers y tiempos. Datos generados por factories, nunca IDs quemados. Cada test crea lo que necesita y lo limpia al terminar.

05 · Contract testing · Pact · gate 2
Contratos dirigidos por el consumidor: el frontend declara qué espera y el backend lo verifica en su pipeline. Si alguien renombra un campo "inocente", el PR no se mergea. Adiós al "en mi servicio funcionaba".

06 · Seguridad y performance · ZAP + k6
OWASP API Top 10 en cada release: BOLA, autenticación rota, exposición excesiva de datos. k6 con umbrales en el pipeline (p95 < 300 ms, errores < 1%). Si se rompe el umbral, falla el build, no el cliente.

07 · Triage y RCA · Jira MCP
Cada fallo se clasifica con evidencia (request, response, logs, trace ID): bug real, test roto, contrato desactualizado, ambiente o flaky. Solo los bugs reales llegan a Jira, con su causa raíz y el curl para reproducirlo.

Regla de oro: el agente nunca cambia el valor esperado para que el test pase. Si la respuesta cambió, es un cambio de contrato y lo decide un humano, por PR. Un agente que "actualiza el expected" está escondiendo un bug.
Cada bug en producción se convierte en un test de regresión: el pipeline aprende en cada ciclo.

La IA escribe los tests. El criterio sigue siendo tuyo.

#QA #TestAutomation #APITesting #IA #AgentesIA #ISTQB #Playwright #ContractTesting #QualityEngineering
