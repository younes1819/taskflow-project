import { MAX_TASK_TITLE_LENGTH, MIN_TASK_TITLE_LENGTH } from './constants.js';

/**
 * @typedef {Object} Task
 * @property {string} id Identificador único (p. ej. UUID).
 * @property {string} title Texto mostrado en la lista.
 * @property {boolean} completed Si la tarea está completada.
 * @property {string} createdAt Fecha ISO 8601 de creación (para ordenar).
 */

/**
 * Modos de ordenación de la lista visible.
 * @typedef {'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc' | 'pending-first'} SortMode
 */

/**
 * Valores permitidos para el filtro de estado en la UI.
 * @typedef {'all' | 'pending' | 'completed'} StatusFilter
 */

/**
 * Crea un objeto tarea nuevo, sin persistir.
 *
 * @param {string} title Título ya validado y normalizado.
 * @returns {Task}
 */
export function createTaskRecord(title) {
    return {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date().toISOString()
    };
}

/**
 * Comprueba si un valor tiene la forma de {@link Task} persistible (tipos y reglas de título).
 *
 * @param {unknown} value
 * @returns {value is Task}
 */
export function isValidPersistedTask(value) {
    if (value == null || typeof value !== 'object') return false;
    const o = /** @type {Record<string, unknown>} */ (value);
    if (typeof o.id !== 'string' || o.id.length === 0) return false;
    if (typeof o.completed !== 'boolean') return false;
    if (typeof o.title !== 'string') return false;
    const normalized = normalizeTaskTitle(o.title);
    return validateTaskTitle(normalized) === null;
}

/**
 * Filtra un array parseado desde JSON dejando solo tareas válidas.
 *
 * @param {unknown} maybeArray
 * @returns {Task[]}
 */
export function coalesceValidTasks(maybeArray) {
    if (!Array.isArray(maybeArray)) return [];
    /** @type {Task[]} */
    const out = [];
    for (const item of maybeArray) {
        if (!isValidPersistedTask(item)) continue;
        const t = /** @type {Task} */ (item);
        const createdAt =
            typeof t.createdAt === 'string' && t.createdAt.length > 0
                ? t.createdAt
                : new Date(0).toISOString();
        out.push({ ...t, title: normalizeTaskTitle(t.title), createdAt });
    }
    return out;
}

/**
 * Normaliza el título: recorta y colapsa espacios internos.
 *
 * @param {string} raw
 * @returns {string}
 */
export function normalizeTaskTitle(raw) {
    return raw.trim().replace(/\s+/g, ' ');
}

/**
 * Valida el título para alta/edición. Devuelve mensaje en español o `null` si es válido.
 *
 * @param {string} normalizedTitle Resultado de {@link normalizeTaskTitle}.
 * @returns {string | null}
 */
export function validateTaskTitle(normalizedTitle) {
    if (normalizedTitle.length < MIN_TASK_TITLE_LENGTH) {
        return 'Escribe un título (no solo espacios).';
    }
    if (normalizedTitle.length > MAX_TASK_TITLE_LENGTH) {
        return `El título no puede superar ${MAX_TASK_TITLE_LENGTH} caracteres (tiene ${normalizedTitle.length}).`;
    }
    return null;
}

/**
 * @param {Task} task
 * @param {string} statusFilter Valor de `data-filter` del botón activo.
 * @returns {boolean}
 */
export function taskMatchesStatusFilter(task, statusFilter) {
    switch (statusFilter) {
        case 'all':
            return true;
        case 'completed':
            return task.completed;
        case 'pending':
            return !task.completed;
        default:
            return true;
    }
}

/**
 * Filtra por estado y texto de búsqueda (insensible a mayúsculas).
 *
 * @param {Task[]} tasks
 * @param {string} statusFilter
 * @param {string} searchQuery Texto del campo buscar (no tiene por qué estar recortado).
 * @returns {Task[]}
 */
export function filterTasksForView(tasks, statusFilter, searchQuery) {
    const needle = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
        const byStatus = taskMatchesStatusFilter(task, statusFilter);
        const bySearch = needle === '' || task.title.toLowerCase().includes(needle);
        return byStatus && bySearch;
    });
}

/** @type {SortMode[]} */
export const SORT_MODES = ['newest', 'oldest', 'alpha-asc', 'alpha-desc', 'pending-first'];

/**
 * @param {string} value
 * @returns {value is SortMode}
 */
export function isSortMode(value) {
    return SORT_MODES.includes(/** @type {SortMode} */ (value));
}

/**
 * Ordena una copia del array según el modo (no muta el original).
 *
 * @param {Task[]} tasks
 * @param {SortMode} mode
 * @returns {Task[]}
 */
export function sortTasksForView(tasks, mode) {
    const copy = [...tasks];
    const byCreatedDesc = (a, b) => b.createdAt.localeCompare(a.createdAt);
    const byCreatedAsc = (a, b) => a.createdAt.localeCompare(b.createdAt);
    switch (mode) {
        case 'newest':
            copy.sort(byCreatedDesc);
            break;
        case 'oldest':
            copy.sort(byCreatedAsc);
            break;
        case 'alpha-asc':
            copy.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
            break;
        case 'alpha-desc':
            copy.sort((a, b) => b.title.localeCompare(a.title, 'es', { sensitivity: 'base' }));
            break;
        case 'pending-first':
            copy.sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                return byCreatedDesc(a, b);
            });
            break;
        default:
            copy.sort(byCreatedDesc);
    }
    return copy;
}

/**
 * @param {Task[]} tasks
 * @returns {Task[]} Copia superficial de referencias; solo excluye completadas del array devuelto.
 */
export function withoutCompletedTasks(tasks) {
    return tasks.filter((t) => !t.completed);
}

/**
 * @param {Task[]} tasks
 * @returns {number}
 */
export function countCompletedTasks(tasks) {
    return tasks.reduce((n, t) => (t.completed ? n + 1 : n), 0);
}
