# Ingeniería de prompts aplicada al desarrollo

Guía práctica para este repo (**Taskflow**: JavaScript modular, UI en español, sin framework). Cada prompt combina, cuando tiene sentido, **rol**, **few-shot**, **razonamiento explícito** y **restricciones** — las técnicas no son excluyentes.

---

## Cómo usar este documento

1. Copia un prompt y sustituye las partes entre corchetes o el contexto pegando rutas o fragmentos de código.
2. Ajusta el nivel de detalle: más restricciones = menos sorpresas; más rol = tono y prioridades alineados al equipo.
3. Tras la respuesta, pide una **segunda pasada** solo de revisión (seguridad, accesibilidad, estilo del archivo) si el primer resultado es largo.

---

## 1. Rol: «actúa como desarrollador senior»

### Prompt A — Refactor con criterio de mantenibilidad

```text
Actúa como desarrollador senior en JavaScript (ES modules, sin TypeScript).
Revisa el archivo [PEGAR RUTA, ej. js/storage.js] y sugiere un refactor mínimo
que mejore legibilidad y pruebas futuras, sin cambiar el comportamiento observable.
Prioriza: nombres claros, funciones puras donde encaje, y comentarios solo donde
el dominio no sea obvio. Lista primero qué cambiarías y por qué; luego el código.
```

**Por qué funciona bien:** El rol ancla **criterios de calidad** (mantenibilidad, no romper comportamiento) que un modelo genérico a veces ignora. Pedir lista antes del código fuerza **planificación** y reduce diffs erróneos.

---

### Prompt B — Generar código con estándar de revisión

```text
Eres un desarrollador senior revisando un PR en un proyecto vanilla JS.
Necesito una función que [DESCRIBIR, ej. exporte las tareas a JSON descargable].
Debe seguir el estilo del proyecto: JSDoc en funciones exportadas, mensajes de UI
en español, sin dependencias npm. Devuelve solo el código y una línea de uso desde main.js.
```

**Por qué funciona bien:** Simula un **contexto social** (revisión de PR), lo que aumenta consistencia con convenciones existentes y reduce respuestas «de tutorial» desconectadas del repo.

---

## 2. Few-shot: prompts con ejemplos

### Prompt C — Misma forma para nuevas utilidades

```text
En este proyecto las funciones puras en tasks.js siguen este patrón:

Ejemplo 1:
export function normalizeTaskTitle(raw) {
  return raw.trim().replace(/\s+/g, ' ');
}

Ejemplo 2:
export function validateTaskTitle(normalizedTitle) {
  if (normalizedTitle.length < MIN_TASK_TITLE_LENGTH) {
    return 'Escribe un título (no solo espacios).';
  }
  return null;
}

Añade una función exportada `truncateTitle(title, maxLen)` que recorte con "…"
si supera maxLen, sin romper caracteres Unicode si es posible. Mismo estilo,
JSDoc breve, sin librerías.
```

**Por qué funciona bien:** Los **ejemplos reales** del repo actúan como ancla de estilo (export, validación, mensajes). Few-shot reduce discrepancias de formato y de convenciones de nombres.

---

### Prompt D — Mensajes y copy en español

```text
Los errores de formulario en la app usan tono corto y claro:
- "Escribe un título (no solo espacios)."
- "El título no puede superar 200 caracteres (tiene 45)."

Genera tres mensajes nuevos para: (1) localStorage lleno, (2) fallo al guardar,
(3) búsqueda sin resultados. Misma voz y longitud similar a los ejemplos.
```

**Por qué funciona bien:** **Few-shot lingüístico** alinea tono y longitud; es más fiable que pedir «mensajes en español» sin referencias.

---

## 3. Razonamiento paso a paso (chain-of-thought)

### Prompt E — Antes de tocar `localStorage`

```text
Antes de escribir código, razona paso a paso (enumerado) sobre:
1) Qué puede fallar al leer/escribir localStorage en este proyecto.
2) Qué garantías debe dar loadPersistedTasks al resto de la app.
3) Si conviene reescribir el almacenamiento al detectar datos inválidos y por qué.

Luego propone cambios concretos al archivo storage.js si aplica, en diff mental
o bloques de código pequeños.
```

**Por qué funciona bien:** Obliga al modelo a **explicitar supuestos** (cuota, JSON corrupto, concurrencia entre pestañas) antes de codificar; suele mejorar el diseño y evita parches ingenuos.

---

### Prompt F — Depurar un bug sin asumir la causa

```text
Síntoma: [DESCRIBIR]. Archivos implicados: [LISTA].

Primero lista hipótesis ordenadas de más probable a menos probable.
Para cada hipótesis indica qué línea o función revisarías y qué comprobarías
en el navegador (consola, Application > Local Storage).

Solo después sugiere el parche mínimo. No saltes al parche en el primer párrafo.
```

**Por qué funciona bien:** Evita la **conclusión apresurada** típica de los modelos; la estructura «hipótesis → evidencia → parche» imita un debug humano y mejora la tasa de aciertos.

---

## 4. Restricciones claras en la respuesta

### Prompt G — Refactor acotado

```text
Restricciones:
- Solo modifica js/render.js.
- No añadas dependencias.
- Máximo 40 líneas nuevas o cambiadas en total (aprox.).
- Conserva los mismos IDs y clases CSS que usa la plantilla HTML.

Objetivo: [DESCRIBIR, ej. extraer la creación del checkbox a una función nombrada].

Si no cabe en el límite, propone la versión mínima posible y marca qué quedaría para un segundo PR.
```

**Por qué funciona bien:** Límites **mensurables** (archivo, líneas, sin deps) reducen diffs masivos y hacen la salida fácil de revisar en un solo vistazo.

---

### Prompt H — Salida estructurada para documentación

```text
Documenta la función [NOMBRE] del archivo [RUTA].

Formato de respuesta obligatorio (usa exactamente estos encabezados en markdown):
## Qué hace
## Parámetros
## Valor de retorno
## Efectos secundarios (localStorage, DOM, etc.)
## Ejemplo de uso

Máximo 15 líneas en total. Sin introducción ni conclusiones fuera de esas secciones.
```

**Por qué funciona bien:** El formato fijo evita prosa vacía y asegura que **efectos secundarios** no se olviden — crítico en front-end.

---

## 5. Combinaciones (rol + restricciones + razonamiento breve)

### Prompt I — Nueva feature con criterios de aceptación

```text
Rol: desarrollador senior front-end (accesibilidad básica WCAG, vanilla JS).

Feature: [DESCRIBIR en una frase].

Criterios de aceptación:
- [ ] Comportamiento con teclado
- [ ] aria-label o roles donde corresponda
- [ ] Sin romper módulos existentes

Primero: 3 viñetas de riesgos. Segundo: plan de archivos a tocar.
Tercero: implementación. Cuarta: cómo probarlo manualmente en 4 pasos.
```

**Por qué funciona bien:** Mezcla **rol**, **checklist** (restricción explícita) y **orden de secciones**; el modelo entrega un paquete listo para QA manual.

---

### Prompt J — Sincronizar documentación con el código

```text
Compara README.md e instalacion.md con la estructura real del repo
(lista de carpetas y entrypoints). Actúa como technical writer + dev senior.

Restricciones:
- No inventes scripts npm si package.json no existe.
- Si algo está desactualizado, indica la frase exacta a reemplazar y el texto nuevo.
- Salida: tabla | Ubicación doc | Problema | Sugerencia |

Razona en una frase por fila antes de la tabla si hay ambigüedad.
```

**Por qué funciona bien:** **Restricción anti-alucinación** (no inventar npm) y formato tabla hacen la salida **accionable** para un commit de docs.

---

### Prompt K — Mini few-shot + restricción de respuesta

```text
Los event listeners en main.js usan addEventListener con funciones nombradas o
arrow inline cortas, sin librerías.

Ejemplo de estilo:
elements.addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  ...
});

Añade el listener para [EVENTO] que [COMPORTAMIENTO]. Solo el bloque del listener
y la línea de registro; no reescribas main.js entero.
```

**Por qué funciona bien:** Few-shot **local** + «solo el bloque» evita que se pegue un `main.js` completo de 200 líneas y facilita copiar y pegar.

---

## Resumen: qué técnica usar cuándo

| Objetivo              | Técnica principal        | Prompts de referencia |
|-----------------------|--------------------------|-------------------------|
| Alinear estilo y APIs | Few-shot en el repo      | C, D, K                 |
| Diseño y edge cases   | Paso a paso antes de código | E, F                  |
| PRs pequeños y revisables | Restricciones duras | G, H, J                 |
| Prioridades de equipo | Rol senior / reviewer    | A, B, I                 |

---

## Mantenimiento de esta guía

Cuando un prompt te dé un resultado especialmente bueno o malo, añade una línea bajo el prompt con la **fecha** y una **nota de una frase** (sin datos sensibles). Así la colección evoluciona con el proyecto.
