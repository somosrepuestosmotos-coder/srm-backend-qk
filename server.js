// ===============================
// SRM-QK Backend Server v1.1.1
// ===============================

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// 🔧 Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// 📁 Servir archivos estáticos
// ===============================

// ✅ Carpeta "videos" (para videos y miniaturas OpenGraph)
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// ✅ Carpeta pública raíz (por si usas offline.html, icons, etc.)
app.use(express.static(__dirname));

// ===============================
// 💾 Base de datos SQLite
// ===============================
const dbPath = path.join(__dirname, 'bd.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos SQLite en', dbPath);
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS respuestas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId TEXT,
    pregunta TEXT,
    respuesta TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// ===============================
// 🧠 API principal
// ===============================

// 📩 Guardar respuesta del cuestionario
app.post('/api/responder', (req, res) => {
  const { sessionId, key, value } = req.body;
  if (!sessionId || !key || !value) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const sql = `INSERT INTO respuestas (sessionId, pregunta, respuesta) VALUES (?, ?, ?)`;
  db.run(sql, [sessionId, key, value], (err) => {
    if (err) {
      console.error('❌ Error al guardar respuesta:', err.message);
      return res.status(500).json({ error: 'Error al guardar respuesta' });
    }

    console.log(`✅ Guardado: ${key} → ${value}`);
    res.json({ success: true });
  });
});

// 📤 Obtener todas las respuestas (modo admin opcional)
app.get('/api/respuestas', (req, res) => {
  db.all('SELECT * FROM respuestas ORDER BY fecha DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer base de datos' });
    }
    res.json(rows);
  });
});

// ===============================
// 🌐 Rutas de soporte
// ===============================

// Página offline (para PWA)
app.get('/offline', (req, res) => {
  res.sendFile(path.join(__dirname, 'offline.html'));
});

// ===============================
// 🚀 Inicialización
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor SRM-QK backend corriendo en puerto ${PORT}`);
  console.log(`📁 Servidor de videos disponible en: http://localhost:${PORT}/videos/`);
});
