# Reflexión final: IA y programación

Llevo un tiempo usando IA dentro del editor para montar y ampliar Taskflow, y al final del curso/proyecto me ha quedado una mezcla de alivio y desconfianza sana. Abajo intento ordenar qué me ha servido de verdad y qué no me cuadra del todo.

---

## Dónde me ha ayudado más

Lo que más noto es cuando hay que **ensamblar cosas en cadena**: tocar el HTML, el CSS y dos o tres JS sin perder el hilo. La IA suele acordarse de los ids y de seguir el estilo que ya había en el archivo, y eso me ahorra ir y venir mil veces. También cuando la tarea es **aburrida pero larga**: el README con ejemplos paso a paso, la tabla de módulos en `docs/modulos.md`, plantillas de prompts… cosas que yo podría hacer a mano pero que me quitan media hora y ganas.

Otro momento en el que brilla es cuando **el patrón ya está inventado** en el proyecto (por ejemplo validar títulos o filtrar tareas). Ahí no hace falta reinventar la rueda: pides que extienda lo mismo y casi siempre encaja. Y para una **primera versión** de un texto o de una función, aunque luego la reescriba, tener algo sobre lo que empujar ayuda a no partir de la página en blanco.

---

## Cuándo se ha equivocado o me ha tocado corregir

También ha habido líos. El más tonto y a la vez el más claro fue el del **MCP con una ruta de otra persona** en el PC: en papel estaba “bien configurado”, pero en mi máquina esa carpeta no existía y el servidor fallaba hasta cambiar la ruta a mano. Ahí aprendí que la IA **no sabe qué usuario eres** si no se lo dices o no lo comprueba.

En el navegador pasa otro tipo de fallo: cosas que suenan bien en teoría pero **chocan con el DOM real** — por ejemplo clics dentro de un `<label>` que activan el checkbox cuando solo querías editar el título. Eso no lo ves hasta probar. Y si en el repo **faltaban archivos en git** (storage, theme) pero el asistente asumía que todo estaba versionado, el código “correcto” no arrancaba hasta que alguien miró el error en consola.

En general, cuando me he fiado al cien por cien del **primer pegado** sin ejecutar, he acabado perdiendo más tiempo del que habría tardado en escribir yo tres líneas bien pensadas.

---

## Riesgos de acostumbrarse demasiado

Me preocupa sobre todo **dejar de practicar el dolor de depurar**: si siempre te dan el parche, te cuesta leer un stack trace o parar el código en el depurador. También el efecto “**va rápido pero no sé qué hay dentro**”: el proyecto crece y un día hay que cambiar algo central y te das cuenta de que no dominas tu propio código.

Otro tema es que todo empieza a **oler igual** (mismo estilo genérico) y que en temas serios — permisos, datos personales, seguridad — **nadie debería firmar solo con lo que sugiere un modelo**. La IA no asume responsabilidad; tú sí.

---

## Cuándo prefiero ir sin asistencia (o casi)

Cuando estoy **aprendiendo algo que quiero retener** (por ejemplo cómo funcionan los eventos o los módulos), prefiero ensuciarme las manos yo solo aunque el resultado sea más feo. Si el cambio es **minúsculo** — renombrar una variable, un typo — a veces abrir el chat me ralentiza.

También cuando la decisión es de **cómo debe sentirse la app** o de prioridades (qué feature va primero): ahí quiero pensar yo, y si acaso usar la IA solo para listar pros y contras, no para decidir por mí.

---

## Cierre

Para mí la IA en programación es sobre todo **un acelerador y un redactor**, no un sustituto de probar en local ni de entender lo que subes al repo. Taskflow ha sido un buen laboratorio: no es gigante, así que cuando algo falla suele verse pronto… siempre que uno abra el navegador y mire la consola en lugar de dar el trabajo por cerrado.
