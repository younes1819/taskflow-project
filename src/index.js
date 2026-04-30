const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

const loggerAcademico = (req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const ms = performance.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${ms.toFixed(2)}ms)`);
  });
  next();
};

app.use(cors());
app.use(express.json());
app.use(loggerAcademico);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'taskflow-server' });
});

app.use('/api/v1/tasks', taskRoutes);

app.use((err, _req, res, _next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

const server = app.listen(PORT, () => {
  console.log(`TaskFlow API listening on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `El puerto ${PORT} ya esta en uso. Cierra la otra instancia de Node o usa otro puerto.`
    );
    process.exit(1);
  }

  throw error;
});
