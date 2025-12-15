/**
 * Validation Middleware
 * Middleware para validar requests usando esquemas Joi
 *
 * Uso:
 * const { validate } = require('../middleware/validate.middleware');
 * const { crearSesionSchema } = require('../validators/sesion.validator');
 *
 * router.post('/sesiones', validate(crearSesionSchema), controller.crear);
 */

/**
 * Middleware de validación que aplica un esquema Joi
 * @param {Object} schema - Esquema Joi a aplicar
 * @param {string} source - De dónde tomar los datos ('body', 'params', 'query')
 * @returns {Function} Middleware Express
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    // Determinar qué parte del request validar
    const dataToValidate = req[source];

    // Opciones de validación Joi
    const options = {
      abortEarly: false, // Retornar todos los errores, no solo el primero
      stripUnknown: true, // Eliminar campos no definidos en el schema
      convert: true // Convertir tipos automáticamente (ej: string a number)
    };

    // Validar datos
    const { error, value } = schema.validate(dataToValidate, options);

    if (error) {
      // Formatear errores de validación
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }

    // Reemplazar los datos con los valores validados y sanitizados
    req[source] = value;

    next();
  };
}

/**
 * Middleware de validación para parámetros de ruta (params)
 * @param {Object} schema - Esquema Joi
 * @returns {Function} Middleware Express
 */
function validateParams(schema) {
  return validate(schema, 'params');
}

/**
 * Middleware de validación para query strings
 * @param {Object} schema - Esquema Joi
 * @returns {Function} Middleware Express
 */
function validateQuery(schema) {
  return validate(schema, 'query');
}

/**
 * Middleware de validación para request body
 * @param {Object} schema - Esquema Joi
 * @returns {Function} Middleware Express
 */
function validateBody(schema) {
  return validate(schema, 'body');
}

/**
 * Sanitizar objeto para logging (ocultar datos sensibles)
 * @param {Object} obj - Objeto a sanitizar
 * @returns {Object} Objeto sanitizado
 */
function sanitizeForLog(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized = { ...obj };
  const sensitiveFields = [
    'password',
    'pass',
    'token',
    'secret',
    'api_key',
    'apiKey',
    'authorization',
    'auth',
    'cookie',
    'session'
  ];

  for (const key in sanitized) {
    const lowerKey = key.toLowerCase();

    // Ocultar campos sensibles
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '***HIDDEN***';
    }

    // Sanitizar objetos anidados recursivamente
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }

  return sanitized;
}

module.exports = {
  validate,
  validateParams,
  validateQuery,
  validateBody,
  sanitizeForLog
};
