let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

const dom = {
    list: document.getElementById('tasks'),
    stats: document.getElementById('stats'),
    form: document.getElementById('add-form'),
    input: document.getElementById('new-task'),
    search: document.getElementById('search'),
    filters: document.querySelectorAll('.filter'),
    themeBtn: document.getElementById('theme-btn')
};

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    render();
}

function renderStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const progress = total ? Math.round((done / total) * 100) : 0;

    dom.stats.innerHTML = `
        <div class="stat"><span>Total</span><strong>${total}</strong></div>
        <div class="stat"><span>Listas</span><strong>${done}</strong></div>
        <div class="stat"><span>Progreso</span><strong>${progress}%</strong></div>
    `;
}

function render() {
    const filtered = tasks.filter(t => {
        const matchesFilter = currentFilter === 'all' ? true :
                              currentFilter === 'completed' ? t.completed : 
                              !t.completed;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    dom.list.innerHTML = '';
    
    filtered.forEach(task => {
        const tpl = document.getElementById('task-tpl').content.cloneNode(true);
        const li = tpl.querySelector('.task');
        const text = tpl.querySelector('.text');
        const check = tpl.querySelector('.check');

        text.textContent = task.title;
        check.checked = task.completed;
        
        if (task.completed) li.classList.add('done');

        check.addEventListener('change', () => {
            task.completed = check.checked;
            save();
        });

        tpl.querySelector('.delete').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            save();
        });

        const editTask = () => {
            const newTitle = prompt("Editar tarea:", task.title);
            if (newTitle?.trim()) {
                task.title = newTitle.trim();
                save();
            }
        };

        tpl.querySelector('.edit').addEventListener('click', editTask);
        text.addEventListener('click', editTask);

        dom.list.appendChild(tpl);
    });

    renderStats();
}

// Events
dom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (dom.input.value.trim()) {
        tasks.push({ id: crypto.randomUUID(), title: dom.input.value.trim(), completed: false });
        dom.input.value = '';
        save();
    }
});

dom.search.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    render();
});

dom.filters.forEach(btn => {
    btn.addEventListener('click', () => {
        dom.filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

document.getElementById('mark-all').addEventListener('click', () => {
    tasks.forEach(t => t.completed = true); save();
});

document.getElementById('clear-done').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed); save();
});

dom.themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    dom.themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

render();
