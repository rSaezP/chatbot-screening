/**
 * Sesion Validation Schemas
 * Validaciones para operaciones con sesiones
 */

const Joi = require('joi');
const {
  idSchema,
  emailSchema,
  phoneSchema,
  nameSchema,
  dateSchema,
  percentageSchema,
  tokenSchema,
  paginationSchema,
  estadosSesion,
  resultadosEvaluacion
} = require('./common.validator');

// ==================== CREAR SESIÓN ====================

/**
 * Validación para crear una nueva sesión
 */
const crearSesionSchema = Joi.object({
  config_id: idSchema.required()
    .messages({
      'any.required': 'El ID de configuración del chatbot es requerido'
    }),

  candidato_id: idSchema.optional().allow(null),

  token: tokenSchema.required()
    .messages({
      'any.required': 'El token de sesión es requerido'
    }),

  candidato_nombre: nameSchema.optional().allow(null, ''),

  candidato_email: emailSchema.optional().allow(null, ''),

  candidato_telefono: phoneSchema.optional().allow(null, ''),

  fecha_expiracion: dateSchema.optional().allow(null),

  estado: Joi.string()
    .valid(...estadosSesion)
    .default('pendiente')
    .messages({
      'any.only': `El estado debe ser uno de: ${estadosSesion.join(', ')}`
    }),

  resultado: Joi.string()
    .valid(...resultadosEvaluacion)
    .default('sin_evaluar')
    .messages({
      'any.only': `El resultado debe ser uno de: ${resultadosEvaluacion.join(', ')}`
    }),

  metadata: Joi.object().optional().allow(null)
});

// ==================== ACTUALIZAR SESIÓN ====================

/**
 * Validación para actualizar una sesión existente
 */
const actualizarSesionSchema = Joi.object({
  estado: Joi.string()
    .valid(...estadosSesion)
    .messages({
      'any.only': `El estado debe ser uno de: ${estadosSesion.join(', ')}`
    }),

  resultado: Joi.string()
    .valid(...resultadosEvaluacion)
    .messages({
      'any.only': `El resultado debe ser uno de: ${resultadosEvaluacion.join(', ')}`
    }),

  puntaje_total: Joi.number().min(0),
  puntaje_maximo: Joi.number().min(0),
  porcentaje_aprobacion: percentageSchema,
  umbral_aprobacion: percentageSchema,

  fecha_inicio: dateSchema,
  fecha_fin: dateSchema,
  fecha_completado: dateSchema,

  candidato_nombre: nameSchema.allow(null, ''),
  candidato_email: emailSchema.allow(null, ''),
  candidato_telefono: phoneSchema.allow(null, ''),

  respuestas_enviadas: Joi.number().integer().min(0),
  respuestas_correctas: Joi.number().integer().min(0),
  respuestas_incorrectas: Joi.number().integer().min(0),

  nota_adicional: Joi.string().max(1000).allow(null, ''),

  metadata: Joi.object().allow(null)
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

// ==================== LISTAR SESIONES ====================

/**
 * Validación para listar sesiones con filtros
 */
const listarSesionesSchema = paginationSchema.keys({
  config_id: idSchema.optional(),

  estado: Joi.string()
    .valid(...estadosSesion)
    .optional()
    .messages({
      'any.only': `El estado debe ser uno de: ${estadosSesion.join(', ')}`
    }),

  resultado: Joi.string()
    .valid(...resultadosEvaluacion)
    .optional()
    .messages({
      'any.only': `El resultado debe ser uno de: ${resultadosEvaluacion.join(', ')}`
    }),

  candidato_email: Joi.string().max(255).optional(),

  fecha_desde: dateSchema.optional(),
  fecha_hasta: dateSchema.optional()
}).custom((value, helpers) => {
  // Validar que fecha_hasta sea posterior a fecha_desde
  if (value.fecha_desde && value.fecha_hasta) {
    const desde = new Date(value.fecha_desde);
    const hasta = new Date(value.fecha_hasta);

    if (desde > hasta) {
      return helpers.error('any.custom', {
        message: 'La fecha_hasta debe ser posterior a fecha_desde'
      });
    }
  }
  return value;
});

// ==================== OBTENER SESIÓN ====================

/**
 * Validación para obtener sesión por ID
 */
const obtenerSesionPorIdSchema = Joi.object({
  id: idSchema.required()
});

/**
 * Validación para obtener sesión por token
 */
const obtenerSesionPorTokenSchema = Joi.object({
  token: tokenSchema.required()
});

// ==================== ESTADÍSTICAS ====================

/**
 * Validación para obtener estadísticas
 */
const obtenerEstadisticasSchema = Joi.object({
  config_id: idSchema.required()
});

// ==================== EXPORTAR ====================

module.exports = {
  crearSesionSchema,
  actualizarSesionSchema,
  listarSesionesSchema,
  obtenerSesionPorIdSchema,
  obtenerSesionPorTokenSchema,
  obtenerEstadisticasSchema
};
