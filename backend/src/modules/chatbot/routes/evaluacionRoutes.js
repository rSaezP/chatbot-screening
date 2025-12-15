/**
 * EvaluacionRoutes - Rutas de evaluaciones
 * Endpoints para consultar y gestionar evaluaciones
 */

const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');

/**
 * ==========================================
 * RUTAS ANIDADAS EN SESIONES
 * Base: /api/sesiones/:sesionId/evaluaciones
 * ==========================================
 */

/**
 * GET /api/sesiones/:sesionId/evaluaciones
 * Obtener todas las evaluaciones de una sesión
 */
router.get('/:sesionId/evaluaciones', evaluacionController.obtenerEvaluaciones);

/**
 * GET /api/sesiones/:sesionId/evaluaciones/puntaje
 * Calcular puntaje total de la sesión
 */
router.get('/:sesionId/evaluaciones/puntaje', evaluacionController.calcularPuntaje);

/**
 * GET /api/sesiones/:sesionId/evaluaciones/resultado
 * Determinar resultado final (aprobado/rechazado)
 * Query params opcionales: ?umbral=70
 */
router.get('/:sesionId/evaluaciones/resultado', evaluacionController.determinarResultado);

/**
 * GET /api/sesiones/:sesionId/evaluaciones/estadisticas
 * Obtener estadísticas completas de evaluación
 */
router.get('/:sesionId/evaluaciones/estadisticas', evaluacionController.obtenerEstadisticas);

/**
 * GET /api/sesiones/:sesionId/evaluaciones/validar-finalizacion
 * Validar si la sesión puede ser finalizada
 */
router.get('/:sesionId/evaluaciones/validar-finalizacion', evaluacionController.validarFinalizacion);

/**
 * GET /api/sesiones/:sesionId/evaluaciones/pregunta/:preguntaId
 * Obtener evaluación de una pregunta específica
 */
router.get('/:sesionId/evaluaciones/pregunta/:preguntaId', evaluacionController.obtenerEvaluacionPregunta);

/**
 * GET /api/sesiones/:sesionId/evaluaciones/mensaje/:mensajeId
 * Obtener evaluación de un mensaje específico
 */
router.get('/:sesionId/evaluaciones/mensaje/:mensajeId', evaluacionController.obtenerEvaluacionPorMensaje);

/**
 * ==========================================
 * RUTAS GLOBALES DE EVALUACIONES
 * Base: /api/evaluaciones
 * ==========================================
 */

/**
 * PUT /api/evaluaciones/:evaluacionId/manual
 * Actualizar evaluación manual (para preguntas de tipo manual)
 * Body: { cumple: boolean, puntaje: number, razon: string, evaluador: string }
 */
router.put('/:evaluacionId/manual', evaluacionController.actualizarEvaluacionManual);

/**
 * GET /api/evaluaciones/pendientes
 * Obtener todas las evaluaciones pendientes de revisión manual
 * Query params opcionales: ?configId=1
 */
router.get('/pendientes', evaluacionController.obtenerPendientes);

module.exports = router;
