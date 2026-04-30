const taskService = require('../services/task.service');

function getTasks(_req, res) {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
}

function createTask(req, res) {
  const { title, completed = false } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res
      .status(400)
      .json({ error: 'El titulo es obligatorio y debe tener al menos 3 caracteres.' });
  }

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'El estado completed debe ser booleano.' });
  }

  const nueva = taskService.crearTarea({
    title: title.trim(),
    completed
  });

  return res.status(201).json(nueva);
}

function patchTask(req, res, next) {
  try {
    const { id } = req.params;
    const nextData = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
      if (typeof req.body.title !== 'string' || req.body.title.trim().length < 3) {
        return res
          .status(400)
          .json({ error: 'Si envias title, debe tener al menos 3 caracteres.' });
      }
      nextData.title = req.body.title.trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'completed')) {
      if (typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ error: 'Si envias completed, debe ser booleano.' });
      }
      nextData.completed = req.body.completed;
    }

    const updated = taskService.actualizarTarea(id, nextData);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

function replaceTasks(req, res) {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'El body debe ser un array de tareas.' });
  }

  for (const item of req.body) {
    if (!item || typeof item !== 'object') {
      return res.status(400).json({ error: 'Cada tarea debe ser un objeto.' });
    }
    if (typeof item.title !== 'string' || item.title.trim().length < 3) {
      return res
        .status(400)
        .json({ error: 'Cada tarea debe incluir title con minimo 3 caracteres.' });
    }
  }

  const replaced = taskService.reemplazarTodas(req.body);
  return res.status(200).json(replaced);
}

function deleteTask(req, res, next) {
  try {
    taskService.eliminarTarea(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTasks,
  createTask,
  patchTask,
  replaceTasks,
  deleteTask
};
