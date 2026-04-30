# Backend API: herramientas clave

## Axios
Axios es un cliente HTTP para navegador y Node.js. Se usa para simplificar peticiones, interceptores, timeouts y transformacion de respuestas frente a `fetch` nativo.

## Postman
Postman es una plataforma para probar APIs manualmente y automatizar colecciones de pruebas. Permite validar contratos HTTP, headers, payloads y respuestas de error.

## Sentry
Sentry es una plataforma de observabilidad y monitoreo de errores. Se integra en backend/frontend para capturar excepciones en tiempo real, stack traces y contexto de usuario.

## Swagger (OpenAPI)
Swagger/OpenAPI es un estandar para documentar APIs REST de forma machine-readable. Se usa para generar documentacion interactiva, SDKs de cliente y validaciones de contrato.

## Por que se usan juntas
- Postman valida comportamiento durante desarrollo y QA.
- Swagger define y publica el contrato tecnico.
- Axios (o `fetch`) consume la API desde aplicaciones cliente.
- Sentry detecta fallos en produccion y acelera la correccion.
