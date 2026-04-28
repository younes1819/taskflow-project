# TaskFlow

TaskFlow ahora usa arquitectura cliente-servidor: frontend en `index.html` + módulos ES y backend REST con Node.js + Express.

## Arquitectura de carpetas

| Ruta | Responsabilidad |
|------|------------------|
| `src/index.js` | Bootstrap del servidor, middlewares globales y manejo de errores |
| `src/config/env.js` | Carga y validación de variables de entorno (`PORT`) |
| `src/routes/task.routes.js` | Enrutamiento HTTP de `/api/v1/tasks` |
| `src/controllers/task.controller.js` | Frontera de red: validación y respuestas HTTP |
| `src/services/task.service.js` | Lógica de negocio en memoria (sin Express acoplado) |
| `js/api/client.js` | Cliente HTTP del frontend (`fetch`) |
| `js/main.js` | Estado UI, eventos y sincronización con la API |
| `js/render.js` | Render de lista y estadísticas |
| `js/tasks.js` | Utilidades puras (validación, orden, filtros) |

## Middlewares y pipeline

- `express.json()` parsea payload JSON y lo inyecta en `req.body`.
- `cors()` habilita consumo de la API desde el frontend.
- `loggerAcademico` registra método, URL, estado y duración de cada request.
- Middleware global de errores mapea `NOT_FOUND` a `404` y errores no controlados a `500`.

## Variables de entorno

Archivo `.env`:

```env
PORT=3000
```

`src/config/env.js` aborta el arranque si falta `PORT`.

## API REST

Base URL: `http://localhost:3000/api/v1/tasks`

- `GET /` -> lista tareas (`200`)
- `POST /` -> crea tarea (`201`)
- `PATCH /:id` -> actualiza parcialmente (`200`)
- `PUT /` -> reemplaza toda la colección (`200`)
- `DELETE /:id` -> elimina tarea (`204`)

Ejemplo `POST`:

```json
{
  "title": "Preparar demo final",
  "completed": false
}
```

## Estados de red en frontend

La UI maneja tres estados:

- **Carga:** mensajes como "Cargando tareas..." o "Guardando cambios...".
- **Exito:** "Sincronizado con el servidor."
- **Error:** muestra mensaje de backend (`400`, `404`, `500`) en el estado de red.

## Arranque del proyecto

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar backend:
   ```bash
   npm run dev
   ```
3. Servir frontend en otro terminal:
   ```bash
   npx --yes serve .
   ```
4. Abrir la URL que te indique `serve`.

## Pruebas de integración recomendadas (Postman/Thunder Client)

- `POST` sin `title` -> debe responder `400`.
- `POST` con `title` corto (`"ab"`) -> `400`.
- `DELETE` con id inexistente -> `404`.
- `PATCH` con `completed: "si"` -> `400`.
- Error interno forzado -> `500` con mensaje genérico.

## Recursos adicionales

- [docs/backend-api.md](docs/backend-api.md)
