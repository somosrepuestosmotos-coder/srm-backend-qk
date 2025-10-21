// ==============================
// ✅ SERVIDOR PRINCIPAL SRM-BACKEND-QK
// ==============================

import express from "express";
import cors from "cors";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const app = express();

// ------------------------------
// 🔧 CONFIGURACIÓN BÁSICA
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 10000;

// ------------------------------
// 🔒 CORS — PERMITIR FRONTEND DE GITHUB PAGES
// ------------------------------
app.use(
  cors({
    origin: [
      "https://somosrepuestosmotos-coder.github.io",
      "https://somosrepuestosmotos-coder.github.io/QK"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ------------------------------
// ⚙️ MIDDLEWARES
// ------------------------------
app.use(express.json());
app.use("/videos", express.static(path.join(__dirname, "videos"))); // servir videos locales

// ------------------------------
// 🗄️ CONEXIÓN A POSTGRESQL
// ------------------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("📦 Conexión a PostgreSQL exitosa.");

    // Crear tabla si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS respuestas (
        id SERIAL PRIMARY KEY,
        session_id TEXT,
        pregunta TEXT,
        respuesta TEXT,
        fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("📦 Lista de tablas 'respuestas'.");
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar con PostgreSQL:", err);
  }
}
testConnection();

// ------------------------------
// 🧠 ENDPOINT: GUARDAR RESPUESTAS
// ------------------------------
app.post("/api/responder", async (req, res) => {
  try {
    const { sessionId, key, value } = req.body;

    if (!sessionId || !key || !value) {
      return res.status(400).json({ success: false, error: "Datos incompletos" });
    }

    await pool.query(
      "INSERT INTO respuestas (session_id, pregunta, respuesta) VALUES ($1, $2, $3)",
      [sessionId, key, value]
    );

    console.log(`✅ Guardado: ${key} → ${value}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al guardar respuesta:", err);
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// ------------------------------
// 🌐 RUTA RAÍZ DE PRUEBA
// ------------------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 SRM Backend QK activo</h1>
    <p>Servidor en ejecución en el puerto ${PORT}</p>
    <p><a href="/videos/animacion-logo-qk-original.mp4" target="_blank">Ver prueba de video</a></p>
  `);
});

// ------------------------------
// 🚀 INICIAR SERVIDOR
// ------------------------------
app.listen(PORT, () => {
  console.log("🚀 Servidor en ejecución en el puerto", PORT);
  console.log("✅ Tu servicio está activo 🎉");
  console.log("🌐 Disponible en: https://srm-backend-qk-lwid.onrender.com");
  console.log("///////////////////////////////////////////////////////////");
});
