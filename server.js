import express from "express";
import cors from "cors";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// --- Configuración básica ---
app.use(cors());
app.use(express.json());

// ✅ Necesario para servir archivos locales (HTML, imágenes, videos, etc.)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta raíz y la de videos
app.use(express.static(__dirname));
app.use("/videos", express.static(path.join(__dirname, "videos")));

// --- Conexión a PostgreSQL ---
const connectionString = process.env.DATABASE_URL;

const db = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("📦 Conexión a PostgreSQL exitosa.");
  } catch (err) {
    console.error("❌ Error de conexión a PostgreSQL:", err);
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS respuestas (
      id SERIAL PRIMARY KEY,
      session_id TEXT,
      key TEXT,
      value TEXT,
      fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("📦 Tabla 'respuestas' lista.");
};

// --- Endpoint para guardar respuestas ---
app.post("/api/responder", async (req, res) => {
  try {
    const { sessionId, key, value } = req.body;

    if (!sessionId || !key || !value) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    await db.query(
      "INSERT INTO respuestas (session_id, key, value) VALUES ($1, $2, $3)",
      [sessionId, key, value]
    );

    console.log(`✅ Guardado: ${key} → ${value}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error al guardar respuesta:", error);
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
});

// --- Endpoint para listar respuestas ---
app.get("/api/respuestas", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM respuestas ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener respuestas:", error);
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
});

// --- Iniciar servidor ---
initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Servidor en ejecución en el puerto ${PORT}`)
  );
});
