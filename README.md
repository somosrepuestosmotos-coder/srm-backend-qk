# 🚀 SRM-QK Backend v1.0.1 — Suite Ejecutiva Digital

**SRM-QK** (Somos Repuestos Motos - Quick Knowledge) es una solución **full-stack empresarial** diseñada para capturar, almacenar y analizar respuestas estratégicas de usuarios a través de una experiencia **PWA interactiva** y un backend robusto con **PostgreSQL + Node.js**.

---

## 📦 Arquitectura General

| Capa | Tecnología | Hosting | Estado | Descripción |
|------|-------------|----------|----------|--------------|
| **Frontend (PWA)** | HTML5, JS, CSS | GitHub Pages | 🟢 Activo | Interfaz ligera, responsive y progresiva (`/QK/`) |
| **Backend API** | Node.js + Express | Render | 🟢 Activo | Manejo de respuestas, CORS y video-streaming |
| **Base de Datos** | PostgreSQL | Render Cloud | 🟢 Activo | Persistencia con tabla `respuestas` |
| **Dashboard** | HTML + Chart.js + XLSX | Render | 🟢 Activo | Análisis visual y exportación de datos |
| **Videos** | Archivos MP4 | Render Static | 🟢 Activo | Servidos desde `/videos/` con headers seguros |

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Cuenta en Render.com**
- **Cuenta en GitHub**

---

## 🧠 Instalación Local

1. **Clonar el proyecto**
   ```bash
   git clone https://github.com/somosrepuestosmotos-coder/srm-qk-backend.git
   cd srm-qk-backend
