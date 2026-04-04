import { STORAGE_KEY } from './constants.js';
import { coalesceValidTasks } from './tasks.js';

/**
 * @typedef {import('./tasks.js').Task} Task
 */

/**
 * Lee y parsea las tareas guardadas. Ante JSON inválido o datos no-array devuelve [].
 *
 * @returns {Task[]}
 */
export function loadPersistedTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        const tasks = coalesceValidTasks(parsed);
        if (tasks.length !== parsed.length) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            } catch (e) {
                console.warn('No se pudieron reescribir tareas tras saneado.', e);
            }
        }
        return tasks;
    } catch {
        return [];
    }
}

/**
 * Serializa las tareas en `localStorage`.
 *
 * @param {Task[]} tasks
 * @returns {boolean} `true` si se guardó correctamente
 */
export function persistTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (e) {
        console.warn('No se pudieron guardar las tareas.', e);
        return false;
    }
}
