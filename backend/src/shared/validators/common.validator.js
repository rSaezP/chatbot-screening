/**
 * Common Validation Schemas
 * Esquemas de validación comunes reutilizables con Joi
 */

const Joi = require('joi');

// ==================== VALIDADORES COMUNES ====================

/**
 * Validador de ID numérico
 */
const idSchema = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    'number.base': 'El ID debe ser un número',
    'number.integer': 'El ID debe ser un número entero',
    'number.positive': 'El ID debe ser un número positivo',
    'any.required': 'El ID es requerido'
  });

/**
 * Validador de email
 */
const emailSchema = Joi.string()
  .email()
  .trim()
  .lowercase()
  .max(255)
  .messages({
    'string.email': 'El email no tiene un formato válido',
    'string.max': 'El email no puede exceder los 255 caracteres',
    'string.empty': 'El email no puede estar vacío'
  });

/**
 * Validador de teléfono
 */
const phoneSchema = Joi.string()
  .trim()
  .pattern(/^[+]?[\d\s\-()]+$/)
  .min(7)
  .max(20)
  .messages({
    'string.pattern.base': 'El teléfono tiene un formato inválido',
    'string.min': 'El teléfono debe tener al menos 7 caracteres',
    'string.max': 'El teléfono no puede exceder los 20 caracteres'
  });

/**
 * Validador de nombre
 */
const nameSchema = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
  .messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder los 100 caracteres',
    'string.pattern.base': 'El nombre solo puede contener letras y espacios',
    'string.empty': 'El nombre no puede estar vacío'
  });

/**
 * Validador de fecha ISO
 */
const dateSchema = Joi.date()
  .iso()
  .messages({
    'date.base': 'La fecha debe ser válida',
    'date.format': 'La fecha debe estar en formato ISO (YYYY-MM-DD)'
  });

/**
 * Validador de porcentaje (0-100)
 */
const percentageSchema = Joi.number()
  .min(0)
  .max(100)
  .messages({
    'number.min': 'El porcentaje no puede ser menor a 0',
    'number.max': 'El porcentaje no puede ser mayor a 100',
    'number.base': 'El porcentaje debe ser un número'
  });

/**
 * Validador de puntaje (0-100)
 */
const scoreSchema = Joi.number()
  .min(0)
  .max(100)
  .messages({
    'number.min': 'El puntaje no puede ser menor a 0',
    'number.max': 'El puntaje no puede ser mayor a 100',
    'number.base': 'El puntaje debe ser un número'
  });

/**
 * Validador de UUID/Token
 */
const tokenSchema = Joi.string()
  .trim()
  .alphanum()
  .min(16)
  .max(64)
  .messages({
    'string.alphanum': 'El token solo puede contener caracteres alfanuméricos',
    'string.min': 'El token debe tener al menos 16 caracteres',
    'string.max': 'El token no puede exceder los 64 caracteres'
  });

/**
 * Validador de paginación
 */
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'El número de página debe ser al menos 1'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.min': 'El límite debe ser al menos 1',
      'number.max': 'El límite no puede exceder 100'
    })
});

/**
 * Validador de URL
 */
const urlSchema = Joi.string()
  .uri()
  .max(500)
  .messages({
    'string.uri': 'Debe ser una URL válida',
    'string.max': 'La URL no puede exceder los 500 caracteres'
  });

// ==================== ENUMS COMUNES ====================

/**
 * Estados de sesión válidos
 */
const estadosSesion = ['pendiente', 'en_progreso', 'completada', 'expirada', 'cancelada'];

/**
 * Resultados de evaluación válidos
 */
const resultadosEvaluacion = ['sin_evaluar', 'aprobado', 'considerar', 'rechazado', 'expirada'];

/**
 * Tipos de mensaje válidos
 */
const tiposMensaje = ['sistema', 'pregunta', 'respuesta'];

/**
 * Tipos de pregunta válidos
 */
const tiposPregunta = ['texto', 'opcion_multiple', 'si_no', 'fecha', 'numero', 'email', 'telefono'];

/**
 * Tipos de evaluación válidos
 */
const tiposEvaluacion = ['regla_fija', 'ia', 'manual'];

// ==================== EXPORTAR ====================

module.exports = {
  // Esquemas básicos
  idSchema,
  emailSchema,
  phoneSchema,
  nameSchema,
  dateSchema,
  percentageSchema,
  scoreSchema,
  tokenSchema,
  urlSchema,
  paginationSchema,

  // Enums
  estadosSesion,
  resultadosEvaluacion,
  tiposMensaje,
  tiposPregunta,
  tiposEvaluacion
};
