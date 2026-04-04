import { SORT_MODE_KEY } from './constants.js';
import { loadPersistedTasks, persistTasks } from './storage.js';
import {
    createTaskRecord,
    filterTasksForView,
    isSortMode,
    normalizeTaskTitle,
    sortTasksForView,
    validateTaskTitle,
    withoutCompletedTasks
} from './tasks.js';
import { renderTaskListView, syncFilterButtonsAria } from './render.js';
import { applyStoredTheme, toggleAndPersistTheme } from './theme.js';

/** @type {import('./tasks.js').Task[]} */
let tasks = loadPersistedTasks();
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
 * Persiste (si se puede) y repinta la vista con el estado actual.
 */
function saveAndRefreshView() {
    persistTasks(tasks);
    refreshTaskView();
}

/**
 * Repinta sin escribir en `localStorage` (útil tras búsqueda o filtro).
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
            task.completed = completed;
            saveAndRefreshView();
        },
        onDeleteById: (taskId) => {
            tasks = tasks.filter((t) => t.id !== taskId);
            saveAndRefreshView();
        },
        onEditRequested: (task) => {
            const nextTitle = prompt('Editar tarea:', task.title);
            if (nextTitle == null) return;
            const normalized = normalizeTaskTitle(nextTitle);
            const err = validateTaskTitle(normalized);
            if (err) {
                alert(err);
                return;
            }
            task.title = normalized;
            saveAndRefreshView();
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

    tasks.push(createTaskRecord(normalized));
    elements.newTaskInput.value = '';
    saveAndRefreshView();
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
    try {
        const raw = localStorage.getItem(SORT_MODE_KEY);
        if (raw && isSortMode(raw)) sortMode = raw;
    } catch {
        /* ignore */
    }
    if (elements.sortSelect) elements.sortSelect.value = sortMode;
}

function persistSortMode() {
    try {
        localStorage.setItem(SORT_MODE_KEY, sortMode);
    } catch {
        /* ignore */
    }
}

elements.sortSelect?.addEventListener('change', () => {
    const v = elements.sortSelect.value;
    if (isSortMode(v)) sortMode = v;
    persistSortMode();
    refreshTaskView();
});

elements.markAllButton.addEventListener('click', () => {
    tasks.forEach((t) => {
        t.completed = true;
    });
    saveAndRefreshView();
});

elements.clearCompletedButton.addEventListener('click', () => {
    tasks = withoutCompletedTasks(tasks);
    saveAndRefreshView();
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
refreshTaskView();
