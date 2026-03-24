// --- ESTADO Y PERSISTENCIA ---
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

// --- SELECTORES ---
const taskList = document.getElementById('task-list');
const statsPanel = document.getElementById('stats-panel');
const themeToggle = document.getElementById('theme-toggle');

// --- FUNCIONES CORE ---

const save = () => {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    render();
};

const addTask = (title) => {
    tasks.push({ id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() });
    save();
};

const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const newTitle = prompt("Editar tarea:", task.title);
    if (newTitle && newTitle.trim()) {
        task.title = newTitle.trim();
        save();
    }
};

// --- RENDERIZADO CON FILTROS ---

const render = () => {
    // Filtrar tareas
    let filteredTasks = tasks.filter(t => {
        const matchesFilter = currentFilter === 'all' || 
                             (currentFilter === 'completed' ? t.completed : !t.completed);
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const clone = document.getElementById('task-template').content.cloneNode(true);
        const li = clone.querySelector('li');
        const span = clone.querySelector('.task-text');
        const check = clone.querySelector('.task-checkbox');

        span.textContent = task.title;
        check.checked = task.completed;
        if(task.completed) span.classList.add('line-through', 'text-slate-400');

        // Eventos
        check.onchange = () => { task.completed = check.checked; save(); };
        clone.querySelector('.delete-btn').onclick = () => { tasks = tasks.filter(t => t.id !== task.id); save(); };
        clone.querySelector('.edit-btn').onclick = () => editTask(task.id);
        span.onclick = () => editTask(task.id);

        taskList.appendChild(clone);
    });

    renderStats();
};

const renderStats = () => {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const progress = total ? Math.round((done / total) * 100) : 0;

    statsPanel.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-1 gap-3">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p class="text-xs uppercase font-bold text-blue-600">Total</p>
                <p class="text-2xl font-bold">${total}</p>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p class="text-xs uppercase font-bold text-green-600">Listas</p>
                <p class="text-2xl font-bold">${done}</p>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl col-span-2 md:col-span-1">
                <p class="text-xs uppercase font-bold text-purple-600">Progreso</p>
                <p class="text-2xl font-bold">${progress}%</p>
            </div>
        </div>
    `;
};

// --- EVENTOS ---

document.getElementById('todo-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    if(input.value.trim()) { addTask(input.value.trim()); input.value = ''; }
};

document.getElementById('search-input').oninput = (e) => {
    searchQuery = e.target.value;
    render();
};

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-white', 'dark:bg-slate-600', 'shadow-sm'));
        btn.classList.add('bg-white', 'dark:bg-slate-600', 'shadow-sm');
        currentFilter = btn.dataset.filter;
        render();
    };
});

// Acciones masivas
document.getElementById('mark-all').onclick = () => { tasks.forEach(t => t.completed = true); save(); };
document.getElementById('clear-completed').onclick = () => { tasks = tasks.filter(t => !t.completed); save(); };

// Modo Oscuro
themeToggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
};

// Inicializar tema
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

render();