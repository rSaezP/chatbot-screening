// Cargar variables de entorno
require('dotenv').config();

// Importar dependencias
const express = require('express');
const cors = require('cors');

// Importar rutas
const configRoutes = require('./modules/chatbot/routes/configRoutes');
const sesionRoutes = require('./modules/chatbot/routes/sesionRoutes');
const mensajeRoutes = require('./modules/chatbot/routes/mensajeRoutes');
const evaluacionRoutes = require('./modules/chatbot/routes/evaluacionRoutes');

// Importar middlewares
const { notFound, errorHandler } = require('./shared/middleware/errorHandler');

// Crear instancia de Express
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Parser para JSON
app.use(express.urlencoded({ extended: true })); // Parser para datos URL-encoded

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido al Backend del Sistema de Chatbot de Screening',
    version: '1.0.0',
    estado: 'Activo',
    endpoints: {
      config: '/api/config',
      sesiones: '/api/sesiones',
      mensajes: '/api/mensajes',
      evaluaciones: '/api/evaluaciones',
      health: '/health'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    estado: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// RUTAS DE LA API
// ============================================================================
app.use('/api/config', configRoutes);
app.use('/api/sesiones', sesionRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);

// ============================================================================
// MIDDLEWARES DE MANEJO DE ERRORES (deben ir al final)
// ============================================================================
app.use(notFound); // Captura rutas no encontradas (404)
app.use(errorHandler); // Manejo global de errores

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Servidor iniciado correctamente                        ║
║   Puerto: ${PORT}                                           ║
║   Entorno: ${process.env.NODE_ENV || 'development'}                              ║
║   URL: http://localhost:${PORT}                             ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Exportar app para testing
module.exports = app;
