/**
 * Evaluacion Validation Schemas
 * Validaciones para operaciones con evaluaciones
 */

const Joi = require('joi');
const {
  idSchema,
  scoreSchema,
  tiposEvaluacion
} = require('./common.validator');

// ==================== CREAR EVALUACIÓN ====================

/**
 * Validación para crear una nueva evaluación
 */
const crearEvaluacionSchema = Joi.object({
  sesion_id: idSchema.required()
    .messages({
      'any.required': 'El ID de sesión es requerido'
    }),

  pregunta_id: idSchema.required()
    .messages({
      'any.required': 'El ID de pregunta es requerido'
    }),

  mensaje_id: idSchema.optional().allow(null),

  respuesta_texto: Joi.string()
    .trim()
    .max(5000)
    .required()
    .messages({
      'string.max': 'La respuesta no puede exceder los 5000 caracteres',
      'any.required': 'La respuesta del candidato es requerida'
    }),

  tipo_evaluacion: Joi.string()
    .valid(...tiposEvaluacion)
    .required()
    .messages({
      'any.only': `El tipo de evaluación debe ser uno de: ${tiposEvaluacion.join(', ')}`,
      'any.required': 'El tipo de evaluación es requerido'
    }),

  es_correcta: Joi.boolean()
    .required()
    .messages({
      'any.required': 'El resultado de corrección es requerido'
    }),

  puntaje: scoreSchema.required()
    .messages({
      'any.required': 'El puntaje es requerido'
    }),

  peso: Joi.number()
    .min(0)
    .default(1)
    .messages({
      'number.min': 'El peso no puede ser negativo'
    }),

  justificacion: Joi.string()
    .trim()
    .max(2000)
    .allow(null, '')
    .messages({
      'string.max': 'La justificación no puede exceder los 2000 caracteres'
    }),

  metadata: Joi.object().optional().allow(null)
});

// ==================== ACTUALIZAR EVALUACIÓN ====================

/**
 * Validación para actualizar una evaluación existente
 */
const actualizarEvaluacionSchema = Joi.object({
  es_correcta: Joi.boolean(),

  puntaje: scoreSchema,

  peso: Joi.number().min(0),

  justificacion: Joi.string()
    .trim()
    .max(2000)
    .allow(null, '')
    .messages({
      'string.max': 'La justificación no puede exceder los 2000 caracteres'
    }),

  metadata: Joi.object().allow(null)
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// ==================== EVALUAR SESIÓN ====================

/**
 * Validación para evaluar una sesión completa
 */
const evaluarSesionSchema = Joi.object({
  sesion_id: idSchema.required()
    .messages({
      'any.required': 'El ID de sesión es requerido'
    }),

  forzar_re_evaluacion: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'forzar_re_evaluacion debe ser un booleano'
    })
});

// ==================== OBTENER EVALUACIONES ====================

/**
 * Validación para obtener evaluaciones de una sesión
 */
const obtenerEvaluacionesPorSesionSchema = Joi.object({
  sesion_id: idSchema.required(),

  tipo_evaluacion: Joi.string()
    .valid(...tiposEvaluacion)
    .optional()
    .messages({
      'any.only': `El tipo debe ser uno de: ${tiposEvaluacion.join(', ')}`
    }),

  es_correcta: Joi.boolean().optional()
});

/**
 * Validación para obtener evaluación por ID
 */
const obtenerEvaluacionPorIdSchema = Joi.object({
  id: idSchema.required()
});

// ==================== RE-EVALUAR RESPUESTA ====================

/**
 * Validación para re-evaluar una respuesta específica
 */
const reEvaluarRespuestaSchema = Joi.object({
  evaluacion_id: idSchema.required()
    .messages({
      'any.required': 'El ID de evaluación es requerido'
    }),

  nuevo_puntaje: scoreSchema.optional(),

  nueva_justificacion: Joi.string()
    .trim()
    .max(2000)
    .allow(null, '')
    .messages({
      'string.max': 'La justificación no puede exceder los 2000 caracteres'
    })
});

// ==================== EXPORTAR ====================

module.exports = {
  crearEvaluacionSchema,
  actualizarEvaluacionSchema,
  evaluarSesionSchema,
  obtenerEvaluacionesPorSesionSchema,
  obtenerEvaluacionPorIdSchema,
  reEvaluarRespuestaSchema
};
