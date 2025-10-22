// ==============================
// ✅ SRM-QK Backend v1.0.1 — Producción Adaptativa
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
const API_KEY = process.env.API_KEY || "srmqk2025secure";

console.log("🚀 Iniciando backend SRM-QK v1.0.1...");

// ------------------------------
// 🔒 CORS — PERMITIR FRONTEND DE GITHUB PAGES
// ------------------------------
app.use(
  cors({
    origin: [
      "https://somosrepuestosmotos-coder.github.io",
      "https://somosrepuestosmotos-coder.github.io/QK",
      "http://localhost:5500"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

// ------------------------------
// ⚙️ MIDDLEWARES
// ------------------------------
app.use(express.json());

// ------------------------------
// 🗄️ CONEXIÓN A POSTGRESQL (ADAPTATIVA)
// ------------------------------
const isRenderDB = process.env.DATABASE_URL?.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRenderDB ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("📦 Conexión a PostgreSQL exitosa.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS respuestas (
        id SERIAL PRIMARY KEY,
        session_id TEXT,
        pregunta TEXT,
        respuesta TEXT,
        fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("🗃️ Tabla 'respuestas' lista.");
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar con PostgreSQL:", err);
  }
}

// ------------------------------
// 🔒 PROTECCIÓN OPCIONAL POR API_KEY (solo dashboard)
// ------------------------------
app.use((req, res, next) => {
  const key = req.query.key || req.headers["x-api-key"];
  if (req.path.startsWith("/dashboard") && key !== API_KEY) {
    return res.status(403).send("<h1>403 – Acceso denegado</h1>");
  }
  next();
});

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
// 📊 ENDPOINT: LEER RESPUESTAS
// ------------------------------
app.get("/api/respuestas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM respuestas ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al leer respuestas:", err);
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
});

// ------------------------------
// 📊 SERVIR DASHBOARD Y ESTÁTICOS
// ------------------------------
app.use("/", express.static(path.join(__dirname)));

// ------------------------------
// 🌐 RUTA DE PRUEBA
// ------------------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 SRM-QK Backend Activo</h1>
    <p>Servidor ejecutándose en el puerto ${PORT}</p>
    <ul>
      <li><a href="/videos/animacion-logo-qk-original.mp4" target="_blank">🎥 Video de prueba</a></li>
      <li><a href="/api/respuestas" target="_blank">📊 Ver respuestas (JSON)</a></li>
      <li><a href="/dashboard.html?key=${API_KEY}" target="_blank">📈 Abrir dashboard</a></li>
    </ul>
  `);
});

// ------------------------------
// 🚀 INICIAR SERVIDOR
// ------------------------------
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log("✅ Backend SRM-QK v1.0.1 listo para producción");
  });
});
