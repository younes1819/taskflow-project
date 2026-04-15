# Flujo de Trabajo con Cursor
Aquí documentaremos los comandos de Composer (`Ctrl+I`), el uso de `@Symbols` y cómo estamos estructurando las reglas del proyecto en `.cursorrules`.

function render() {
    const filtered = tasks.filter(t => {
        const matchesFilter = currentFilter === 'all' ? true :
                              currentFilter === 'completed' ? t.completed : 
                              !t.completed;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });
explicacion 

Qué hace tasks.filter(t => { ... })
Recorre todas las tareas (tasks) y se queda solo con las que cumplan las dos condiciones al final: matchesFilter && matchesSearch.

matchesFilter
Depende de currentFilter (el botón de filtro que esté activo, p. ej. «Todas», «Pendientes», «Completadas»):

'all' → true para cada tarea: no se filtra por estado.
'completed' → solo pasan las que tienen t.completed === true.
Cualquier otro (en tu app es 'pending') → solo pasan las que no están completadas (!t.completed).
Es un ternario encadenado: primero pregunta si es «all», si no, si es «completed», y si no, asume pendientes.

matchesSearch
Comprueba si el título de la tarea contiene el texto de búsqueda:

t.title.toLowerCase().includes(searchQuery.toLowerCase())
Así la búsqueda no distingue mayúsculas/minúsculas.
Resumen
Cada tarea t se muestra solo si encaja con el filtro de estado y encaja con lo escrito en el buscador. El resultado filtered es lo que luego el resto de render() pinta en el DOM.

Ctrl + KGenerar / EditarPara escribir código nuevo o modificar el seleccionado en el editor.
Ctrl + LAbrir ChatPara hacer preguntas sobre el código o pedir explicaciones.
Ctrl + IComposerPara cambios complejos que afectan a varios archivos a la vez.
Ctrl + EnterAceptar CambiosPara confirmar las sugerencias que la IA ha escrito en tu archivo.

Crítico o muy recomendable
1. Modo oscuro ilegible (style.css)
En .dark tienes --text: #ff0000;: todo el texto en rojo puro sobre fondo oscuro es duro de leer y parece un error. Lo habitual es un gris muy claro (#e2e8f0, #f8fafc, etc.).

2. localStorage sin protección (app.js línea 1)
Si JSON.parse falla (datos corruptos o editados a mano), la app puede romperse al cargar. Conviene try/catch y, si falla, usar [] y opcionalmente limpiar o avisar.

## Instalación y ejecución MCP

