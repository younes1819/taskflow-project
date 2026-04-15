import { countCompletedTasks } from './tasks.js';

/**
 * @typedef {import('./tasks.js').Task} Task
 */

/**
 * Actualiza `aria-pressed` en los botones de filtro según el filtro activo.
 *
 * @param {NodeListOf<HTMLButtonElement> | HTMLButtonElement[]} filterButtons
 * @param {string} activeFilter Valor de `data-filter` seleccionado.
 */
export function syncFilterButtonsAria(filterButtons, activeFilter) {
    filterButtons.forEach((btn) => {
        btn.setAttribute('aria-pressed', btn.dataset.filter === activeFilter ? 'true' : 'false');
    });
}

/**
 * Pinta el panel de estadísticas (total, completadas, progreso).
 *
 * @param {HTMLElement} statsPanel
 * @param {Task[]} tasks Lista completa (no filtrada).
 */
export function renderStatsPanel(statsPanel, tasks) {
    const total = tasks.length;
    const completed = countCompletedTasks(tasks);
    const progressPercent = total ? Math.round((completed / total) * 100) : 0;

    statsPanel.innerHTML = `
        <div class="stat total"><span>Total</span><strong>${total}</strong></div>
        <div class="stat stat-completed"><span>Completadas</span><strong>${completed}</strong></div>
        <div class="stat progress"><span>Progreso</span><strong>${progressPercent}%</strong></div>
    `;
}

/**
 * Construye un fragmento de fila desde la plantilla y rellena datos de la tarea.
 *
 * @param {HTMLTemplateElement} taskTemplate
 * @param {Task} task
 * @returns {DocumentFragment}
 */
export function cloneTaskRowFragment(taskTemplate, task) {
    const fragment = taskTemplate.content.cloneNode(true);
    const listItem = fragment.querySelector('.task');
    const titleEl = fragment.querySelector('.text');
    const checkbox = fragment.querySelector('.check');
    const duplicateBtn = fragment.querySelector('.duplicate');
    const editBtn = fragment.querySelector('.edit');
    const deleteBtn = fragment.querySelector('.delete');

    titleEl.textContent = task.title;
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Tarea: ${task.title}`);
    duplicateBtn.setAttribute('aria-label', `Duplicar ${task.title}`);
    editBtn.setAttribute('aria-label', `Editar ${task.title}`);
    deleteBtn.setAttribute('aria-label', `Eliminar ${task.title}`);

    if (task.completed) listItem.classList.add('done');

    return fragment;
}

/**
 * @callback TaskCompletionHandler
 * @param {Task} task
 * @param {boolean} completed
 */

/**
 * @callback TaskIdHandler
 * @param {string} taskId
 */

/**
 * @callback TaskEditHandler
 * @param {Task} task
 * @param {HTMLElement} listItem Elemento `<li class="task">` de la fila.
 */

/**
 * @callback TaskDuplicateHandler
 * @param {Task} task
 */

/**
 * Enlaza eventos de una fila clonada.
 *
 * @param {DocumentFragment} rowFragment
 * @param {Task} task Referencia mutable al objeto en el array de tareas.
 * @param {object} handlers
 * @param {TaskCompletionHandler} handlers.onCompletionChange
 * @param {TaskIdHandler} handlers.onDeleteById
 * @param {TaskEditHandler} handlers.onEditRequested
 * @param {TaskDuplicateHandler} handlers.onDuplicateTask
 */
export function bindTaskRowHandlers(rowFragment, task, handlers) {
    const { onCompletionChange, onDeleteById, onEditRequested, onDuplicateTask } = handlers;
    const listItem = rowFragment.querySelector('.task');
    const checkbox = rowFragment.querySelector('.check');
    const duplicateBtn = rowFragment.querySelector('.duplicate');
    const deleteBtn = rowFragment.querySelector('.delete');
    const editBtn = rowFragment.querySelector('.edit');
    const titleEl = rowFragment.querySelector('.text');

    if (!listItem || !checkbox || !duplicateBtn || !deleteBtn || !editBtn || !titleEl) return;

    checkbox.addEventListener('change', () => {
        onCompletionChange(task, checkbox.checked);
    });

    duplicateBtn.addEventListener('click', () => {
        onDuplicateTask(task);
    });

    deleteBtn.addEventListener('click', () => {
        onDeleteById(task.id);
    });

    const openEditor = () => onEditRequested(task, listItem);
    editBtn.addEventListener('click', openEditor);
    titleEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openEditor();
    });
}

/**
 * Sustituye el título por un `<input>` hasta guardar (Enter o blur) o cancelar (Escape).
 *
 * @param {HTMLElement} listItem `<li class="task">`
 * @param {Task} task
 * @param {object} opts
 * @param {(raw: string) => string} opts.normalizeTaskTitle
 * @param {(normalized: string) => string | null} opts.validateTaskTitle
 * @param {(normalized: string) => void} opts.onSaved
 */
export function startInlineTitleEdit(listItem, task, opts) {
    const { normalizeTaskTitle, validateTaskTitle, onSaved } = opts;
    const titleEl = listItem.querySelector('.text');
    if (!titleEl || listItem.querySelector('.task-inline-title')) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input task-inline-title';
    input.value = task.title;
    input.maxLength = 200;
    input.setAttribute('aria-label', 'Editar título de la tarea');

    titleEl.replaceWith(input);
    input.focus();
    input.select();

    const restoreTitleSpan = () => {
        const inp = listItem.querySelector('.task-inline-title');
        if (!inp) return;
        const span = document.createElement('span');
        span.className = 'text';
        span.textContent = task.title;
        inp.replaceWith(span);
    };

    const save = () => {
        const normalized = normalizeTaskTitle(input.value);
        const err = validateTaskTitle(normalized);
        if (err) {
            alert(err);
            input.focus();
            return;
        }
        if (normalized === task.title) {
            restoreTitleSpan();
            return;
        }
        onSaved(normalized);
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            restoreTitleSpan();
        }
    });

    input.addEventListener('blur', () => {
        if (!listItem.querySelector('.task-inline-title')) return;
        const normalized = normalizeTaskTitle(input.value);
        if (normalized === task.title) {
            restoreTitleSpan();
            return;
        }
        const err = validateTaskTitle(normalized);
        if (err) {
            alert(err);
            queueMicrotask(() => input.focus());
            return;
        }
        onSaved(normalized);
    });
}

/**
 * Vuelca la lista visible de tareas en el DOM.
 *
 * @param {object} options
 * @param {HTMLElement} options.taskListElement `<ul id="tasks">`
 * @param {HTMLTemplateElement} options.taskTemplate
 * @param {Task[]} options.visibleTasks Resultado de {@link import('./tasks.js').filterTasksForView}
 * @param {TaskCompletionHandler} options.onCompletionChange
 * @param {TaskIdHandler} options.onDeleteById
 * @param {TaskEditHandler} options.onEditRequested
 * @param {TaskDuplicateHandler} options.onDuplicateTask
 * @param {HTMLElement} options.statsPanel
 * @param {Task[]} options.allTasks Para estadísticas globales.
 */
export function renderTaskListView(options) {
    const {
        taskListElement,
        taskTemplate,
        visibleTasks,
        onCompletionChange,
        onDeleteById,
        onEditRequested,
        onDuplicateTask,
        statsPanel,
        allTasks
    } = options;

    taskListElement.innerHTML = '';

    for (const task of visibleTasks) {
        const row = cloneTaskRowFragment(taskTemplate, task);
        bindTaskRowHandlers(row, task, {
            onCompletionChange,
            onDeleteById,
            onEditRequested,
            onDuplicateTask
        });
        taskListElement.appendChild(row);
    }

    renderStatsPanel(statsPanel, allTasks);
}
