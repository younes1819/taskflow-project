# Registro de Experimentos
Espacio para anotar pruebas temporales, como el uso de agentes autónomos o scripts de automatización generados por IA.


// prblm 1
function sumOfDigits(num) {
    let sum = 0;  
    while (num > 0) {
      sum += num % 10;  
      num = Math.floor(num / 10);  
    }
    return sum;
  }

// prblm 2
function minOfDigits(num) {
    let min = num % 10;
    num = Math.floor(num / 10);
    while (num > 0) {
      const digit = num % 10;
      if (digit < min) {
        min = digit;
      }
      num = Math.floor(num / 10);
    }
    return min;
  }

// prblm 3
function countDigits(num) {
    let count = 0;
    while (num > 0) {
      count++;
      num = Math.floor(num / 10);
    }
    return count;
  }

  comparar :

  AI : 
  tiempo : Muy bajo para tareas simples; moderado para sistemas complejos
  calidad : Tiende a escribir código genérico y funcional. Es excelente para algoritmos estándar o funciones . Sin embargo, puede introducir vulnerabilidades de seguridad si se entrenó con código antiguo o prácticas obsoletas
compresion :La IA no "entiende" el problema; predice qué palabras (o tokens) suelen seguir a otras basándose en su entrenamiento.

Humano :
tiempo : Alto, pero con una curva de mantenimiento más predecible.
Humano: Un programador senior aporta arquitectura. Piensa en el "yo del futuro" que tendrá que leer ese código en seis meses. El humano optimiza para la legibilidad del equipo y la cohesión del sistema, algo que a la IA le cuesta proyectar a largo plazo.
compresion : Los humanos no solo programamos código; resolvemos problemas de negocio. Entendemos el porqué.

---

## Tareas del proyecto Taskflow (implementadas en el repo)

Tres mejoras concretas añadidas al código; sirven como experimento aplicado (IA asistió en parte en la implementación y revisión).

### 1. Saneo de tareas al leer `localStorage`

- **Qué hace:** Tras `JSON.parse`, solo se conservan objetos con forma de tarea válida (`id` string no vacío, `title` y `completed` con tipos correctos, título que pasa `normalizeTaskTitle` + `validateTaskTitle`). Los títulos se normalizan al incorporar al array.
- **Dónde:** `js/tasks.js` — `isValidPersistedTask`, `coalesceValidTasks`. `js/storage.js` — `loadPersistedTasks` usa `coalesceValidTasks` y, si se descartan entradas corruptas, reescribe la clave en `localStorage` (con `console.warn` si falla el guardado).
- **Utilidad:** Evita que un array guardado a mano o corrupto rompa la lista o la UI.

### 2. Atajo de teclado para el campo de búsqueda

- **Qué hace:** `Ctrl+/` (Windows/Linux) o `Cmd+/` (macOS) enfoca `#search` y usa `preventDefault` para no interferir con atajos del navegador.
- **Dónde:** `js/main.js` (listener global `keydown`). `index.html` — atributo `title` en el input de búsqueda como pista de atajo.
- **Utilidad:** Navegación rápida sin ratón.

### 3. Limpiar búsqueda (botón y Escape)

- **Qué hace:** Botón ✕ (`#clear-search`) visible solo cuando hay texto en el buscador; al pulsar, vacía el filtro y devuelve el foco al input. Con el foco en el buscador, `Escape` limpia y hace blur del campo.
- **Dónde:** `index.html` (contenedor `.search-wrap`), `style.css` (`.search-wrap`, `.clear-search-btn`), `js/main.js` (`clearSearch`, `syncClearSearchButton`, listeners).
- **Utilidad:** Salir del filtro de búsqueda de forma explícita y accesible (`aria-label` en el botón).

### Referencia rápida de archivos

| Área            | Archivos                          |
|-----------------|-----------------------------------|
| Modelo / validación | `js/tasks.js`, `js/storage.js` |
| UI búsqueda     | `js/main.js`, `index.html`, `style.css` |



