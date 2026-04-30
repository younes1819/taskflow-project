import {
    filterTasksForView,
    isSortMode,
    normalizeTaskTitle,
    sortTasksForView,
    validateTaskTitle,
    withoutCompletedTasks
} from './tasks.js';
import { renderTaskListView, startInlineTitleEdit, syncFilterButtonsAria } from './render.js';
import { createTask, deleteTask, fetchTasks, patchTask } from './api/client.js';
import { applyStoredTheme, toggleAndPersistTheme } from './theme.js';

/** @type {import('./tasks.js').Task[]} */
let tasks = [];
/** @type {string} */
let activeStatusFilter = 'all';
/** @type {string} */
let searchText = '';
/** @type {import('./tasks.js').SortMode} */
let sortMode = 'newest';

const elements = {
    taskList: document.getElementById('tasks'),
    statsPanel: document.getElementById('stats'),
    addForm: document.getElementById('add-form'),
    newTaskInput: document.getElementById('new-task'),
    newTaskError: document.getElementById('new-task-error'),
    searchInput: document.getElementById('search'),
    clearSearchButton: document.getElementById('clear-search'),
    filterButtons: document.querySelectorAll('.filter'),
    themeToggle: document.getElementById('theme-btn'),
    markAllButton: document.getElementById('mark-all'),
    clearCompletedButton: document.getElementById('clear-done'),
    taskTemplate: document.getElementById('task-tpl'),
    networkStatus: document.getElementById('network-status'),
    sortSelect: document.getElementById('sort-order')
};

/**
 * Muestra u oculta el botón de limpiar búsqueda según el texto actual.
 */
function syncClearSearchButton() {
    if (!elements.clearSearchButton) return;
    elements.clearSearchButton.hidden = searchText.trim() === '';
}

function clearSearch() {
    searchText = '';
    elements.searchInput.value = '';
    syncClearSearchButton();
    refreshTaskView();
}

document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === '/') {
        e.preventDefault();
        elements.searchInput?.focus();
    }
});

/**
 * Muestra estado de red: carga, exito o error.
 */
function setNetworkStatus(message, isError = false) {
    if (!elements.networkStatus) return;
    elements.networkStatus.textContent = message;
    elements.networkStatus.style.color = isError ? 'var(--danger)' : 'var(--text-muted)';
}

async function withNetworkState(operation, loadingMessage = 'Cargando...') {
    setNetworkStatus(loadingMessage);
    try {
        await operation();
        setNetworkStatus('Sincronizado con el servidor.');
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error de red inesperado.';
        setNetworkStatus(`Error: ${message}`, true);
    }
}

/**
 * Repinta la vista para búsqueda o filtro.
 */
function refreshTaskView() {
    const filtered = filterTasksForView(tasks, activeStatusFilter, searchText);
    const visible = sortTasksForView(filtered, sortMode);
    renderTaskListView({
        taskListElement: elements.taskList,
        taskTemplate: elements.taskTemplate,
        visibleTasks: visible,
        statsPanel: elements.statsPanel,
        allTasks: tasks,
        onCompletionChange: (task, completed) => {
            withNetworkState(async () => {
                const updated = await patchTask(task.id, { completed });
                task.completed = updated.completed;
                refreshTaskView();
            }, 'Actualizando tarea...');
        },
        onDeleteById: (taskId) => {
            withNetworkState(async () => {
                await deleteTask(taskId);
                tasks = tasks.filter((t) => t.id !== taskId);
                refreshTaskView();
            }, 'Eliminando tarea...');
        },
        onEditRequested: (task, listItem) => {
            startInlineTitleEdit(listItem, task, {
                normalizeTaskTitle,
                validateTaskTitle,
                onSaved: async (normalized) => {
                    await withNetworkState(async () => {
                        const updated = await patchTask(task.id, { title: normalized });
                        task.title = updated.title;
                        refreshTaskView();
                    }, 'Guardando cambios...');
                }
            });
        },
        onDuplicateTask: (task) => {
            withNetworkState(async () => {
                const copy = await createTask({ title: task.title, completed: false });
                const idx = tasks.findIndex((t) => t.id === task.id);
                if (idx >= 0) tasks.splice(idx + 1, 0, copy);
                else tasks.push(copy);
                refreshTaskView();
            }, 'Duplicando tarea...');
        }
    });
}

/**
 * Muestra error de validación junto al campo de nueva tarea.
 *
 * @param {string} message
 */
function showNewTaskError(message) {
    elements.newTaskInput.classList.add('input--invalid');
    elements.newTaskInput.setAttribute('aria-invalid', 'true');
    elements.newTaskError.textContent = message;
    elements.newTaskError.hidden = false;
}

/**
 * Oculta el error de nueva tarea y limpia estados ARIA.
 */
function clearNewTaskError() {
    elements.newTaskInput.classList.remove('input--invalid');
    elements.newTaskInput.removeAttribute('aria-invalid');
    elements.newTaskError.textContent = '';
    elements.newTaskError.hidden = true;
}

elements.addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearNewTaskError();

    const normalized = normalizeTaskTitle(elements.newTaskInput.value);
    const validationError = validateTaskTitle(normalized);
    if (validationError) {
        showNewTaskError(validationError);
        elements.newTaskInput.focus();
        return;
    }

    withNetworkState(async () => {
        const created = await createTask({ title: normalized, completed: false });
        tasks.push(created);
        elements.newTaskInput.value = '';
        refreshTaskView();
    }, 'Creando tarea...');
});

elements.searchInput.addEventListener('input', (event) => {
    searchText = event.target.value;
    syncClearSearchButton();
    refreshTaskView();
});

elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        clearSearch();
        elements.searchInput.blur();
    }
});

elements.clearSearchButton?.addEventListener('click', () => {
    clearSearch();
    elements.searchInput.focus();
});

elements.filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        elements.filterButtons.forEach((b) => b.classList.remove('active'));
        button.classList.add('active');
        activeStatusFilter = button.dataset.filter;
        syncFilterButtonsAria(elements.filterButtons, activeStatusFilter);
        refreshTaskView();
    });
});

function loadSortModeFromStorage() {
    if (elements.sortSelect) elements.sortSelect.value = sortMode;
}

function persistSortMode() {
    return sortMode;
}

elements.sortSelect?.addEventListener('change', () => {
    const v = elements.sortSelect.value;
    if (isSortMode(v)) sortMode = v;
    persistSortMode();
    refreshTaskView();
});

elements.markAllButton.addEventListener('click', () => {
    withNetworkState(async () => {
        for (const task of tasks) {
            if (!task.completed) {
                await patchTask(task.id, { completed: true });
                task.completed = true;
            }
        }
        refreshTaskView();
    }, 'Marcando todas...');
});

elements.clearCompletedButton.addEventListener('click', () => {
    withNetworkState(async () => {
        const completed = tasks.filter((t) => t.completed);
        for (const task of completed) {
            await deleteTask(task.id);
        }
        tasks = withoutCompletedTasks(tasks);
        refreshTaskView();
    }, 'Borrando completadas...');
});

elements.themeToggle.addEventListener('click', () => {
    toggleAndPersistTheme(elements.themeToggle);
});

elements.newTaskInput.addEventListener('input', () => {
    if (!elements.newTaskError.hidden) clearNewTaskError();
});

applyStoredTheme(elements.themeToggle);
loadSortModeFromStorage();
syncFilterButtonsAria(elements.filterButtons, activeStatusFilter);
syncClearSearchButton();
withNetworkState(async () => {
    tasks = await fetchTasks();
    refreshTaskView();
}, 'Cargando tareas...');
