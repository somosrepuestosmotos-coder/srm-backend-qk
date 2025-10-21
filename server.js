import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 10000;

// --- 🧩 MIDDLEWARES ---
app.use(express.json());

// ✅ Habilitar CORS para permitir conexión desde GitHub Pages
app.use(
  cors({
    origin: "*", // Permite cualquier dominio (incluye GitHub Pages)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Servir archivos estáticos (videos, favicon, etc.)
app.use(express.static("."));

// --- 🧠 CONEXIÓN A POSTGRESQL ---
const connectionString = process.env.DATABASE_URL;

const db = new pg.Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

// --- 🔧 Inicializar base de datos ---
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
      pregunta TEXT,
      respuesta TEXT,
      fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("📦 Tabla 'respuestas' lista.");
};

// --- 📩 Endpoint para guardar respuestas ---
app.post("/api/responder", async (req, res) => {
  try {
    const { sessionId, key, value } = req.body;

    if (!sessionId || !key || !value) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // ✅ Insertar usando columnas correctas
    await db.query(
      "INSERT INTO respuestas (session_id, pregunta, respuesta) VALUES ($1, $2, $3)",
      [sessionId, key, value]
    );

    console.log(`✅ Guardado: ${key} → ${value}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error al guardar respuesta:", error);
    res.status(500).json({ error: "Error al guardar en la base de datos" });
  }
});

// --- 📊 Endpoint para obtener respuestas ---
app.get("/api/respuestas", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM respuestas ORDER BY fecha DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener respuestas:", error);
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
});

// --- 🚀 Iniciar servidor ---
initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Servidor en ejecución en el puerto ${PORT}`)
  );
});
