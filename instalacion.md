# Instalación paso a paso — Taskflow

Guía para preparar el entorno, ejecutar la aplicación y, si lo necesitas, conectar el servidor MCP de archivos en Cursor.

---

## Parte 1: Requisitos

1. **Navegador actualizado** (Chrome, Edge, Firefox o Safari reciente).
2. **Git** (opcional): para clonar el repositorio.
3. **Node.js** (recomendado): versión LTS o actual. Sirve para:
   - servir la app por HTTP (necesario para que los módulos ES funcionen bien),
   - ejecutar el servidor MCP de archivos en Cursor con `npx`.

Comprueba Node y npm en una terminal:

```bash
node -v
npm -v
```

---

## Parte 2: Obtener el código

1. Abre una terminal en la carpeta donde guardas proyectos.
2. Clona el repositorio (ajusta la URL si usas un fork):

   ```bash
   git clone https://github.com/TU_USUARIO/taskflow-project.git
   cd taskflow-project
   ```

   Si ya tienes la carpeta del proyecto, solo entra en ella con la terminal o ábrela en Cursor.

---

## Parte 3: Ejecutar la aplicación

La app es **HTML, CSS y JavaScript** sin paso de compilación. Los scripts usan **`type="module"`**; conviene **no** abrir `index.html` directamente con `file://`, porque algunos navegadores restringen módulos así. Usa un servidor HTTP local.

### Opción A — `npx` (sin instalar nada global)

1. En la raíz del proyecto (donde está `index.html`), ejecuta:

   ```bash
   npx --yes serve .
   ```

2. La terminal mostrará una URL local (por ejemplo `http://localhost:3000`).
3. Ábrela en el navegador. Deberías ver **Task Manager** y poder añadir tareas.

Para detener el servidor: `Ctrl+C` en la terminal.

### Opción B — Extensión “Live Server” (VS Code / Cursor)

1. Instala la extensión **Live Server** (Ritwick Dey u otra equivalente).
2. Abre la carpeta del proyecto en el editor.
3. Clic derecho en `index.html` → **Open with Live Server** (o el comando equivalente).

### Opción C — Cualquier otro servidor estático

Sirve la carpeta raíz del repo como archivos estáticos (por ejemplo `python -m http.server` en esa carpeta). Abre la URL que indique el comando y entra a `index.html` si hace falta.

---

## Parte 4: Datos y almacenamiento

Las tareas se guardan en el **almacenamiento local del navegador** (`localStorage`). Si cambias de dominio o puerto, el navegador puede tratarlo como otro origen y no ver los mismos datos.

---

## Parte 5 (opcional): MCP de archivos en Cursor

Permite que el asistente liste y lea archivos del proyecto mediante el [Model Context Protocol](https://modelcontextprotocol.io/), dentro de una carpeta que tú fijas.

### 5.1. Requisitos

- **Node.js** instalado (para `npx`).
- Archivo de configuración MCP de Cursor: `%USERPROFILE%\.cursor\mcp.json` (Windows) o la ruta equivalente en tu sistema.

### 5.2. Configurar el servidor

1. Abre o crea `mcp.json` en la carpeta de configuración de Cursor.
2. Añade (o fusiona) un servidor llamado `filesystem` con la **ruta absoluta** de tu copia del proyecto. En Windows las barras invertidas van dobles en JSON.

Ejemplo (sustituye la ruta por la tuya):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\TU_USUARIO\\Documents\\GitHub\\taskflow-project"
      ]
    }
  }
}
```

3. Guarda el archivo.

### 5.3. Activar y comprobar

1. Reinicia Cursor o recarga los servidores MCP desde **Settings → MCP**.
2. El servidor debe aparecer como conectado. Si falla:
   - Comprueba que la ruta del último argumento **existe** y es la carpeta correcta del repo.
   - Ejecuta en terminal: `npx -y @modelcontextprotocol/server-filesystem "RUTA_ABSOLUTA_AL_REPO"` y revisa si hay errores (firewall, permisos, etc.).

Solo se permite acceso a archivos **dentro** de esa carpeta (y subcarpetas).

---

## Resumen rápido

| Paso | Acción |
|------|--------|
| 1 | Tener navegador y, recomendable, Node.js |
| 2 | Clonar o abrir la carpeta del proyecto |
| 3 | Desde la raíz: `npx --yes serve .` y abrir la URL en el navegador |
| 4 | (Opcional) Configurar `mcp.json` con la ruta absoluta del repo y reiniciar Cursor |

Si algo no arranca, anota el mensaje exacto de la terminal o de **MCP** en ajustes y revísalo con ese texto.
