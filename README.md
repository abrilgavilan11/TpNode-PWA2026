# ⚔️ Panel de Personajes Épicos - API Node.js Nativa

## 📜 Sobre el Proyecto
Este proyecto es una aplicación backend y frontend desarrollada íntegramente con Node.js sin utilizar paquetes de terceros ni frameworks como Express.
El propósito principal de este trabajo es comprender a fondo el funcionamiento de los servidores HTTP, el manejo de rutas, las respuestas JSON, los métodos HTTP y la distribución de archivos estáticos desde cero.

El dominio de trabajo de la aplicación gira en torno a la entidad `Character`, representando personajes épicos de diferentes universos.

## 🚀 Requerimientos Implementados
* **Servidor HTTP Nativo:** Levantado utilizando el módulo nativo `http` en el puerto 3000.
* **Archivos Estáticos:** Motor personalizado para servir archivos HTML, CSS y JS desde la carpeta `public/` manejando los headers `Content-Type` de forma manual.
* **API REST Básica:** Endpoints para obtener todos los personajes, obtener por ID, crear (`POST`) y actualizar (`PUT`) leyendo el cuerpo de la request en formato JSON.
* **Validaciones:** Control de datos obligatorios al crear personajes, asegurando que el nivel sea de tipo numérico.
* **Almacenamiento en Memoria:** Gestión de los datos mediante un arreglo temporal.
* **Copia por Streams:** Script independiente (`scripts/copy-file.js`) para realizar copias de archivos pesados utilizando `fs.createReadStream` y `fs.createWriteStream`, optimizando el uso de RAM y midiendo el tiempo de ejecución.

## ✨ Mejoras y Funcionalidades Extra (Bonus)
Para llevar el proyecto al siguiente nivel, implementé de forma proactiva las siguientes características:
* **CRUD Interactivo (Frontend):** Panel de administración completo que permite no solo crear, sino también **editar** personajes reutilizando el formulario de manera dinámica.
* **Método DELETE:** Incorporación de la ruta para eliminar personajes desde la interfaz, enviando peticiones nativas al backend.
* **Búsqueda en Tiempo Real:** Intercepción de *query params* en el backend (`GET /api/characters?name=...`) conectada a una barra de búsqueda en el frontend que filtra los resultados al instante.
* **Dark Mode 🌙:** Diseño adaptativo con soporte para tema claro y oscuro, implementado con variables CSS (`:root`) y persistencia de las preferencias del usuario en `localStorage`.

## 🛠️ Tecnologías
* Node.js (módulos nativos: `http`, `fs`, `path`, `url`, `perf_hooks`).
* Vanilla JavaScript (ES6+ / Async Await / Fetch API).
* HTML5 & CSS3 (Flexbox y CSS Grid).

## 👩‍💻 Autora
Abril Gavilan
