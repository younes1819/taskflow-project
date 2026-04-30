const API_BASE_URL = 'http://localhost:3000/api/v1/tasks';

async function request(path = '', options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
  } catch {
    throw new Error(
      'No hay conexion con el servidor. Ejecuta en la carpeta del proyecto: npm run dev (puerto 3000).'
    );
  }

  if (!response.ok) {
    let message = 'Error de red';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      message = `Error HTTP ${response.status}`;
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function fetchTasks() {
  return request();
}

export function createTask(payload) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function patchTask(id, payload) {
  return request(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function deleteTask(id) {
  return request(`/${id}`, { method: 'DELETE' });
}
