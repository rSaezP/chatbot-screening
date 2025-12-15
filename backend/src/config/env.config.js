/**
 * Centralized Environment Configuration
 * Valida y exporta todas las variables de entorno del proyecto
 *
 * Beneficios:
 * - Validación centralizada de variables requeridas
 * - Conversión de tipos (string -> number, boolean)
 * - Valores por defecto claros
 * - Errores descriptivos si faltan variables críticas
 * - Un solo lugar para gestionar configuración
 */

require('dotenv').config();

/**
 * Validar que una variable de entorno requerida exista
 * @param {string} name - Nombre de la variable
 * @param {any} value - Valor de la variable
 * @returns {any} Valor validado
 * @throws {Error} Si la variable no existe en producción
 */
function required(name, value) {
  if (value === undefined || value === null || value === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`❌ Variable de entorno requerida faltante: ${name}`);
    }
    console.warn(`⚠️  Variable de entorno faltante: ${name}`);
  }
  return value;
}

/**
 * Convertir string a número
 * @param {string} value - Valor string
 * @param {number} defaultValue - Valor por defecto si no es válido
 * @returns {number}
 */
function toNumber(value, defaultValue) {
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Convertir string a boolean
 * @param {string} value - Valor string
 * @returns {boolean}
 */
function toBoolean(value) {
  return value === 'true' || value === '1' || value === 'yes';
}

// ==================== CONFIGURACIÓN GENERAL ====================

const config = {
  // Entorno
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',

  // Servidor
  server: {
    port: toNumber(process.env.PORT, 4000),
    host: process.env.HOST || 'localhost'
  },

  // Base de datos
  database: {
    host: required('DB_HOST', process.env.DB_HOST) || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    user: required('DB_USER', process.env.DB_USER) || 'root',
    password: process.env.DB_PASSWORD || '',
    name: required('DB_NAME', process.env.DB_NAME) || 'chatbot_screening',

    // Configuración de pool
    pool: {
      min: toNumber(process.env.DB_POOL_MIN, 2),
      max: toNumber(process.env.DB_POOL_MAX, 10)
    }
  },

  // Email
  email: {
    host: required('EMAIL_HOST', process.env.EMAIL_HOST) || 'smtp.gmail.com',
    port: toNumber(process.env.EMAIL_PORT, 587),
    secure: toBoolean(process.env.EMAIL_SECURE || 'false'),
    user: required('EMAIL_USER', process.env.EMAIL_USER),
    password: required('EMAIL_PASS', process.env.EMAIL_PASS),
    fromName: process.env.EMAIL_FROM_NAME || 'ChatBot 3IT',

    // Configuración adicional
    debug: toBoolean(process.env.EMAIL_DEBUG || 'false'),
    rejectUnauthorized: toBoolean(process.env.EMAIL_REJECT_UNAUTHORIZED || 'true')
  },

  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
      : ['http://localhost:3000']
  },

  // OpenAI (si se usa para evaluaciones IA)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || null,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: toNumber(process.env.OPENAI_MAX_TOKENS, 500)
  },

  // Seguridad
  security: {
    // JWT (para futuro)
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',

    // Rate limiting
    rateLimitWindow: toNumber(process.env.RATE_LIMIT_WINDOW, 15 * 60 * 1000), // 15 min
    rateLimitMax: toNumber(process.env.RATE_LIMIT_MAX, 100), // 100 requests

    // CORS
    corsEnabled: toBoolean(process.env.CORS_ENABLED || 'true'),
    corsCredentials: toBoolean(process.env.CORS_CREDENTIALS || 'true')
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    logToFile: toBoolean(process.env.LOG_TO_FILE || 'false'),
    logDirectory: process.env.LOG_DIRECTORY || './logs'
  },

  // Sesiones
  sessions: {
    defaultExpiration: toNumber(process.env.SESSION_EXPIRATION_DAYS, 7), // 7 días
    tokenLength: toNumber(process.env.SESSION_TOKEN_LENGTH, 32)
  },

  // Evaluaciones
  evaluations: {
    defaultThreshold: toNumber(process.env.EVAL_DEFAULT_THRESHOLD, 70), // 70%
    iaProvider: process.env.IA_PROVIDER || 'openai', // 'openai' | 'claude' | etc
    iaEnabled: toBoolean(process.env.IA_ENABLED || 'true')
  }
};

// ==================== VALIDACIÓN EN PRODUCCIÓN ====================

if (config.isProduction) {
  console.log('🔐 Validando configuración para producción...');

  // Validar variables críticas
  const criticalVars = [
    config.database.host,
    config.database.user,
    config.database.name,
    config.email.user,
    config.email.password
  ];

  const missing = criticalVars.filter(v => !v);

  if (missing.length > 0) {
    throw new Error(`❌ Configuración incompleta para producción. Revisa las variables de entorno.`);
  }

  // Advertencias de seguridad
  if (config.security.jwtSecret === 'change-this-secret-in-production') {
    throw new Error('❌ SEGURIDAD: Debes cambiar JWT_SECRET en producción');
  }

  console.log('✅ Configuración validada correctamente');
}

// ==================== EXPORTAR CONFIGURACIÓN ====================

module.exports = config;

// También exportar función de ayuda para debugging
module.exports.printConfig = function() {
  console.log('\n📋 CONFIGURACIÓN ACTUAL:\n');
  console.log(`Entorno: ${config.env}`);
  console.log(`Puerto: ${config.server.port}`);
  console.log(`Base de datos: ${config.database.user}@${config.database.host}:${config.database.port}/${config.database.name}`);
  console.log(`Email: ${config.email.user} (${config.email.host}:${config.email.port})`);
  console.log(`Frontend: ${config.frontend.url}`);
  console.log(`CORS: ${config.security.corsEnabled ? 'Habilitado' : 'Deshabilitado'}`);
  console.log(`Logging: ${config.logging.level} (${config.logging.format})`);
  console.log('');
};
