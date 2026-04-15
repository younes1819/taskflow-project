# Referencia de módulos (funciones públicas)

Resumen pensado para **lectura humana** y para pedir contexto a un asistente de IA. El contrato detallado sigue en los **comentarios JSDoc** dentro de cada archivo en `js/`.

---

## `js/constants.js`

Constantes compartidas: claves de `localStorage` (`STORAGE_KEY`, `THEME_KEY`, `SORT_MODE_KEY`), longitud mínima/máxima del título (`MIN_TASK_TITLE_LENGTH`, `MAX_TASK_TITLE_LENGTH`).

---

## `js/tasks.js`

Núcleo del **modelo** y reglas de negocio sobre arrays de tareas.

| Función / símbolo | Rol breve |
|-------------------|-----------|
| `Task` (typedef) | `{ id, title, completed, createdAt }` |
| `SortMode` | `'newest' \| 'oldest' \| 'alpha-asc' \| 'alpha-desc' \| 'pending-first'` |
| `createTaskRecord(title)` | Crea una tarea nueva (UUID, `createdAt` ISO, pendiente). |
| `isValidPersistedTask(value)` | Type guard: ¿objeto persistible con título válido? |
| `coalesceValidTasks(maybeArray)` | Filtra y normaliza un array parseado de JSON. |
| `normalizeTaskTitle(raw)` | Trim y espacios internos colapsados. |
| `validateTaskTitle(normalized)` | `null` si OK; si no, mensaje en español. |
| `taskMatchesStatusFilter(task, filter)` | Coincide con `all` / `pending` / `completed`. |
| `filterTasksForView(tasks, filter, searchQuery)` | Filtro por estado **y** subcadena en título. |
| `SORT_MODES` | Lista de modos de orden válidos. |
| `isSortMode(value)` | Comprueba si un string es un `SortMode`. |
| `sortTasksForView(tasks, mode)` | Devuelve **copia** ordenada (no muta el original). |
| `withoutCompletedTasks(tasks)` | Array sin completadas. |
| `countCompletedTasks(tasks)` | Número de completadas. |

**Flujo típico:** `normalizeTaskTitle` → `validateTaskTitle` antes de crear o editar; `filterTasksForView` + `sortTasksForView` para la lista que ve el usuario.

---

## `js/storage.js`

| Función | Rol breve |
|---------|-----------|
| `loadPersistedTasks()` | Lee JSON de `localStorage`, sanea con `coalesceValidTasks`; si se descartan ítems, reescribe la clave. |
| `persistTasks(tasks)` | Serializa el array; `false` si falla (p. ej. cuota). |

---

## `js/render.js`

| Función | Rol breve |
|---------|-----------|
| `syncFilterButtonsAria(buttons, activeFilter)` | Sincroniza `aria-pressed` en los botones de filtro. |
| `renderStatsPanel(panel, tasks)` | Pinta total, completadas y % de progreso. |
| `cloneTaskRowFragment(template, task)` | Clona la plantilla HTML de una fila. |
| `bindTaskRowHandlers(fragment, task, handlers)` | Enlaza checkbox, duplicar, borrar, editar y clic en título. |
| `startInlineTitleEdit(listItem, task, opts)` | Sustituye el título por `<input>`; `opts` incluye `normalizeTaskTitle`, `validateTaskTitle`, `onSaved`. |
| `renderTaskListView(options)` | Vacía la lista, pinta filas visibles y el panel de estadísticas. |

Los callbacks en `renderTaskListView` / `bindTaskRowHandlers` conectan con el estado que vive en `main.js`.

---

## `js/theme.js`

| Función | Rol breve |
|---------|-----------|
| `applyStoredTheme(themeButton)` | Aplica clase `dark` y el icono del botón según `localStorage`. |
| `updateThemeToggleUi(button, isDark)` | Actualiza emoji y `aria-label`. |
| `toggleAndPersistTheme(themeButton)` | Alterna tema y lo guarda. |

---

## `js/main.js`

No exporta API: **punto de entrada** de la app. Carga tareas, mantiene `tasks`, `activeStatusFilter`, `searchText`, `sortMode`, registra listeners y llama a `persistTasks` + `renderTaskListView` cuando cambia el estado.

---

## Cómo ampliar esta referencia

1. Al añadir una función exportada, documenta con JSDoc en el `.js`.  
2. Añade aquí una fila en la tabla del módulo correspondiente con una frase de responsabilidad.  
3. Si la firma es compleja, enlaza al typedef (`Task`, `SortMode`, etc.) en `tasks.js`.
