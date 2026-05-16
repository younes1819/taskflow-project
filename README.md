![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

# 📄 TaskFlow

---

**Organiza tus tareas de forma simple y visual.**

Descripción breve del proyecto: aplicación para gestionar tareas personales o de equipo, con interfaz clara, filtros por estado y despliegue listo para producción.

| Despliegue | URL |
|------------|-----|
| Frontend   | [Vercel](https://tu-app.vercel.app) |
| Backend    | [Vercel](https://tu-api.vercel.app) |

---

## Características

---

1. Crear, editar y eliminar tareas con título, descripción y prioridad.
2. Filtrar por estado (pendiente, en progreso, completada) y buscar por texto.
3. Persistencia de datos y despliegue separado de frontend y API.

---

## Tecnologías

---

| Frontend | Uso |
|----------|-----|
| React / Next.js | Interfaz y enrutado de la aplicación |
| TypeScript | Tipado estático y mantenibilidad del código |
| Tailwind CSS | Estilos y diseño responsive |

| Backend | Uso |
|---------|-----|
| Express | API REST para tareas y usuarios |
| Node.js | Entorno de ejecución del servidor |

| Auxiliares | Uso |
|------------|-----|
| Vercel | Despliegue de frontend y backend |
| Git / GitHub | Control de versiones y colaboración |

---

## Estructura del proyecto

---

```text
taskflow-project/
├── index.html              # Estructura HTML semántica (si aplica)
├── public/                 # Assets estáticos
├── src/                    # Código fuente del frontend
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Vistas y rutas
│   └── styles/             # Estilos globales
├── api/                    # Rutas serverless (Vercel)
├── server/                 # Servidor Express (backend)
│   ├── routes/             # Endpoints de la API
│   └── index.js            # Punto de entrada del servidor
└── docs/                   # Documentación adicional
```

---

## Descargar y ejecutar

---

```bash
git clone https://github.com/usuario/taskflow-project.git
cd taskflow-project
```

Instalar dependencias y arrancar en local (ajusta según tu stack):

```bash
# Frontend
npm install
npm run dev

# Backend (en otra terminal)
cd server
npm install
npm run dev
```

---

## Desplegar en Vercel

---

### Frontend

1. Importa el repositorio en [Vercel](https://vercel.com).
2. Configura el directorio raíz del frontend y las variables de entorno (`NEXT_PUBLIC_API_URL`, etc.).
3. Despliega; Vercel asignará una URL de producción automáticamente.

### Backend

1. Crea un segundo proyecto en Vercel apuntando a la carpeta `server/` o `api/`.
2. Define las variables de entorno (base de datos, `JWT_SECRET`, CORS, etc.).
3. Tras el despliegue, actualiza la URL de la API en el frontend.

---

Desarrollado durante las prácticas en [Comer Estudiar](https://comerestudiar.com) — Tu Nombre — 2026
