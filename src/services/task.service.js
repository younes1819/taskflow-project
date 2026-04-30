const crypto = require('node:crypto');

let tasks = [];

function obtenerTodas() {
  return [...tasks];
}

function crearTarea(data) {
  const nueva = {
    id: crypto.randomUUID(),
    title: data.title,
    completed: Boolean(data.completed),
    createdAt: new Date().toISOString()
  };
  tasks.push(nueva);
  return nueva;
}

function actualizarTarea(id, data) {
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx < 0) throw new Error('NOT_FOUND');
  tasks[idx] = { ...tasks[idx], ...data };
  return tasks[idx];
}

function reemplazarTodas(data) {
  tasks = data.map((task) => ({
    id: task.id || crypto.randomUUID(),
    title: task.title,
    completed: Boolean(task.completed),
    createdAt: task.createdAt || new Date().toISOString()
  }));
  return [...tasks];
}

function eliminarTarea(id) {
  const before = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  if (tasks.length === before) throw new Error('NOT_FOUND');
}

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  reemplazarTodas,
  eliminarTarea
};
