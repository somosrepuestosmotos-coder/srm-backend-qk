// ===============================
// 🚀 Backend SRM-QK v1.3.0
// ===============================

import express from "express";
import cors from "cors";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

// =====================================================
// 📍 Configuración inicial
// =====================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// =====================================================
// 🗂️ Archivos estáticos (videos o recursos)
// =====================================================
app.use("/videos", express.static(path.join(__dirname, "videos")));

// =====================================================
// 💾 Configuración de conexión a PostgreSQL
// =====================================================
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://srm_admin:SRM2025@dpg-cu7k2o6gbbvc73d03ivg-a.oregon-postgres.render.com/srm_db",
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Verificar conexión inicial
pool
  .connect()
  .then(() => console.log("📦 Conexión a PostgreSQL establecida correctamente."))
  .catch((err) => console.error("❌ Error inicial al conectar con PostgreSQL:", err));

// =====================================================
// 🧠 Rutas API
// =====================================================

// Estado básico (para keep-alive o prueba rápida)
app.get("/ping", (req, res) => res.status(200).send("OK"));

// Estado extendido (salud general)
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "running",
      db_status: "connected",
      server_time: new Date().toISOString(),
      db_time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "DB connection failed",
      error: error.message,
    });
  }
});

// Guardar respuesta del cuestionario
app.post("/api/responder", async (req, res) => {
  try {
    const { sessionId, key, value } = req.body;

    if (!sessionId || !key || !value) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const query = `
      INSERT INTO respuestas (session_id, pregunta, respuesta, fecha)
      VALUES ($1, $2, $3, NOW())
    `;
    await pool.query(query, [sessionId, key, value]);

    console.log(`✅ Guardado: ${key} → ${value}`);
    res.status(201).json({ success: true, message: "Respuesta registrada" });
  } catch (error) {
    console.error("❌ Error al guardar respuesta:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// Consultar todas las respuestas
app.get("/api/respuestas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM respuestas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener respuestas:", error);
    res.status(500).json({ error: "Error al obtener respuestas" });
  }
});

// Limpiar todas las respuestas (solo admin)
app.delete("/api/limpiar", async (req, res) => {
  try {
    const { key } = req.body;
    const ADMIN_KEY = process.env.ADMIN_KEY || "SRM2025ADMIN";

    if (key !== ADMIN_KEY) {
      return res.status(403).json({ success: false, error: "Clave incorrecta o acceso denegado" });
    }

    await pool.query("DELETE FROM respuestas;");
    console.log("🧹 Base de datos limpiada por administrador.");
    res.json({ success: true, message: "Base de datos vaciada correctamente" });
  } catch (error) {
    console.error("❌ Error al limpiar base:", error);
    res.status(500).json({ success: false, error: "Error interno al limpiar base" });
  }
});

// =====================================================
// 🚀 Inicialización del servidor
// =====================================================
app.listen(PORT, () => {
  console.log("🚀 Iniciando backend SRM-QK v1.3.0...");
  console.log("🌐 Servidor corriendo en puerto", PORT);
  console.log(`🗂️ Archivos estáticos desde: ${path.join(__dirname, "videos")}`);
  console.log("✅ Backend SRM-QK listo para producción 🚀");
});

// =====================================================
// 🔁 Keep-Alive automático (solo en Render)
// =====================================================
if (process.env.RENDER) {
  setInterval(async () => {
    try {
      const res = await fetch(`${process.env.RENDER_URL || "https://srm-backend-qk-lwid.onrender.com"}/ping`);
      const text = await res.text();
      console.log("🔄 Keep-alive OK:", text);
    } catch {
      console.warn("⚠️ Keep-alive falló (Render puede haber dormido el contenedor).");
    }
  }, 1000 * 60 * 5); // cada 5 minutos
}
