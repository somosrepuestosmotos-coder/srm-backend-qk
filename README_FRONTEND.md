# 🌐 SRM-QK Frontend — Suite Ejecutiva Digital (PWA)

**Versión:** 1.0.1  
**Autor:** Juan David — [@somosrepuestosmotos-coder](https://github.com/somosrepuestosmotos-coder)

---

## 🧠 Descripción General

El **Frontend SRM-QK** es una **Aplicación Web Progresiva (PWA)** moderna y ligera, diseñada para ofrecer una experiencia fluida, responsiva y lista para instalación en dispositivos móviles o escritorio.

Este módulo se integra directamente con el backend SRM-QK (Render) para capturar las respuestas de los usuarios y transmitirlas a la base de datos PostgreSQL.

---

## 🧩 Arquitectura del Frontend

| Componente | Archivo | Descripción |
|-------------|----------|-------------|
| 🏠 Página principal | `index.html` | Interfaz principal del flujo interactivo |
| ⚙️ Service Worker | `service-worker-lite.js` | Manejo básico de cache e instalación PWA |
| 📱 Manifesto | `site.webmanifest` | Define los íconos, colores y modo standalone |
| 🎨 Recursos | `/assets`, `/css`, `/js` | Archivos estáticos, imágenes y scripts auxiliares |
| 🔗 Backend conectado | `https://srm-backend-qk-lwid.onrender.com` | API para guardar y recuperar respuestas |

---

## ⚙️ Requisitos

- Navegador moderno (Chrome, Edge, Safari, Firefox)
- Conexión HTTPS (GitHub Pages lo provee automáticamente)
- Acceso a Internet para la primera carga (modo offline luego del primer uso)

---

## 📂 Estructura de Archivos

