// server.js — Backend SRM-QK v1.0.2
import express from "express";
import cors from "cors";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

// =====================================================
// 📍 Configuración básica
// =====================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// =====================================================
// 🗂️ Servir archivos estáticos desde /videos
// =====================================================
app.use("/videos", express.static(path.join(__dirname, "videos")));

// =====================================================
// 💾 Conexión a PostgreSQL
// =====================================================
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://srm_admin:SRM2025@dpg-cu7k2o6gbbvc73d03ivg-a.oregon-postgres.render.com/srm_db",
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("📦 Conexión a PostgreSQL exitosa."))
  .catch((err) => console.error("❌ Error en conexión a PostgreSQL:", err));

// =====================================================
// 🧠 Rutas del API
// =====================================================

// Estado del servidor
app.get("/", (req, res) => {
  res.send("✅ Backend SRM-QK v1.0.2 en ejecución.");
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

// =====================================================
// 🚀 Inicializar servidor
// =====================================================
app.listen(PORT, () => {
  console.log("🚀 Iniciando backend SRM-QK v1.0.2...");
  console.log("📦 Conexión a PostgreSQL activa.");
  console.log(`🌐 Servidor corriendo en puerto ${PORT}`);
  console.log(`🗂️ Archivos estáticos desde: ${path.join(__dirname, "videos")}`);
  console.log("✅ Backend SRM-QK listo para producción 🚀");
});
