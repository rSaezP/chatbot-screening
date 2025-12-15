/**
 * Routes: Mensajes de Conversación
 * Define todas las rutas relacionadas con mensajes del chatbot
 */

const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');

// ============================================================================
// RUTAS DE MENSAJES
// ============================================================================

/**
 * POST /api/mensajes
 * Crear un nuevo mensaje
 * Body: { sesion_id, tipo, contenido, pregunta_id?, metadata? }
 */
router.post('/', mensajeController.crear);

/**
 * GET /api/mensajes/:id
 * Obtener un mensaje específico
 */
router.get('/:id', mensajeController.obtenerPorId);

/**
 * PUT /api/mensajes/:id
 * Actualizar un mensaje
 */
router.put('/:id', mensajeController.actualizar);

/**
 * DELETE /api/mensajes/:id
 * Eliminar un mensaje
 */
router.delete('/:id', mensajeController.eliminar);

module.exports = router;
