/**
 * Mensaje Validation Schemas
 * Validaciones para operaciones con mensajes
 */

const Joi = require('joi');
const {
  idSchema,
  tiposMensaje
} = require('./common.validator');

// ==================== CREAR MENSAJE ====================

/**
 * Validación para crear un nuevo mensaje
 */
const crearMensajeSchema = Joi.object({
  sesion_id: idSchema.required()
    .messages({
      'any.required': 'El ID de sesión es requerido'
    }),

  pregunta_id: idSchema.optional().allow(null),

  tipo: Joi.string()
    .valid(...tiposMensaje)
    .required()
    .messages({
      'any.only': `El tipo debe ser uno de: ${tiposMensaje.join(', ')}`,
      'any.required': 'El tipo de mensaje es requerido'
    }),

  texto: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.min': 'El texto no puede estar vacío',
      'string.max': 'El texto no puede exceder los 5000 caracteres',
      'any.required': 'El texto del mensaje es requerido'
    }),

  respuesta_candidato: Joi.string()
    .trim()
    .max(5000)
    .allow(null, '')
    .messages({
      'string.max': 'La respuesta no puede exceder los 5000 caracteres'
    }),

  metadata: Joi.object().optional().allow(null)
});

// ==================== ACTUALIZAR MENSAJE ====================

/**
 * Validación para actualizar un mensaje existente
 */
const actualizarMensajeSchema = Joi.object({
  texto: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .messages({
      'string.min': 'El texto no puede estar vacío',
      'string.max': 'El texto no puede exceder los 5000 caracteres'
    }),

  respuesta_candidato: Joi.string()
    .trim()
    .max(5000)
    .allow(null, '')
    .messages({
      'string.max': 'La respuesta no puede exceder los 5000 caracteres'
    }),

  metadata: Joi.object().allow(null)
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// ==================== OBTENER MENSAJES ====================

/**
 * Validación para obtener mensajes de una sesión
 */
const obtenerMensajesPorSesionSchema = Joi.object({
  sesion_id: idSchema.required(),

  tipo: Joi.string()
    .valid(...tiposMensaje)
    .optional()
    .messages({
      'any.only': `El tipo debe ser uno de: ${tiposMensaje.join(', ')}`
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .default(100)
    .messages({
      'number.min': 'El límite debe ser al menos 1',
      'number.max': 'El límite no puede exceder 1000'
    })
});

/**
 * Validación para obtener mensaje por ID
 */
const obtenerMensajePorIdSchema = Joi.object({
  id: idSchema.required()
});

// ==================== GUARDAR RESPUESTA ====================

/**
 * Validación para guardar respuesta del candidato
 */
const guardarRespuestaSchema = Joi.object({
  sesion_id: idSchema.required()
    .messages({
      'any.required': 'El ID de sesión es requerido'
    }),

  pregunta_id: idSchema.required()
    .messages({
      'any.required': 'El ID de pregunta es requerido'
    }),

  respuesta_texto: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.min': 'La respuesta no puede estar vacía',
      'string.max': 'La respuesta no puede exceder los 5000 caracteres',
      'any.required': 'La respuesta es requerida'
    }),

  metadata: Joi.object().optional().allow(null)
});

// ==================== EXPORTAR ====================

module.exports = {
  crearMensajeSchema,
  actualizarMensajeSchema,
  obtenerMensajesPorSesionSchema,
  obtenerMensajePorIdSchema,
  guardarRespuestaSchema
};
