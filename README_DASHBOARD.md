# 📊 SRM-QK Dashboard — Panel Analítico Interno

**Versión:** 1.0.1  
**Autor:** Juan David — [@somosrepuestosmotos-coder](https://github.com/somosrepuestosmotos-coder)

---

## 🧠 Descripción

El **Dashboard SRM-QK** es el módulo analítico interno que centraliza las respuestas recolectadas por el sistema **Suite Ejecutiva Digital**.  
Permite visualizar, filtrar, analizar y exportar los datos capturados por el backend SRM-QK en tiempo real desde la base de datos PostgreSQL (Render Cloud).

Diseñado para gerencia, marketing y dirección, el panel es **seguro, interactivo y escalable**, ofreciendo una vista clara de las tendencias estratégicas de la empresa.

---

## 🧩 Características Principales

| Función | Descripción |
|----------|-------------|
| 📋 **Tabla dinámica** | Lista todas las respuestas con orden descendente por fecha |
| 🔍 **Filtro por pregunta** | Permite filtrar las respuestas por tipo (`main_objective_6m`, `biggest_challenge`, etc.) |
| 📈 **Gráfico interactivo** | Genera una vista visual de frecuencias usando Chart.js |
| 📁 **Exportación a Excel** | Permite descargar los datos directamente en formato `.xlsx` |
| 🔒 **Acceso seguro** | Protegido por clave API (`?key=srmqk2025secure`) |
| ⚡ **Conexión directa** | Se comunica con `/api/respuestas` del backend Express |

---

## ⚙️ Requisitos Previos

- Backend SRM-QK corriendo en local o Render  
- Base de datos PostgreSQL funcional con tabla `respuestas`  
- Variable de entorno `API_KEY` configurada en Render  

---

## 🗂️ Estructura de Archivos

                               