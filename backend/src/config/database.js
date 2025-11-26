/**
 * Configuración de conexión a la base de datos MySQL
 * Utiliza mysql2/promise para operaciones asíncronas
 */

const mysql = require('mysql2/promise');

// Variable para almacenar el pool de conexiones
let pool = null;

/**
 * Configuración del pool de conexiones
 */
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chatbot_screening',
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0, // Sin límite en la cola de espera
  connectTimeout: 10000, // Timeout de 10 segundos
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

/**
 * Obtiene el pool de conexiones a la base de datos
 * Crea el pool si no existe, o retorna el existente
 * @returns {Promise<Pool>} Pool de conexiones MySQL
 */
const getPool = async () => {
  try {
    if (!pool) {
      console.log('📊 Creando pool de conexiones a MySQL...');
      pool = mysql.createPool(poolConfig);

      // Verificar que el pool se creó correctamente
      const connection = await pool.getConnection();
      console.log('✅ Pool de conexiones MySQL creado exitosamente');
      console.log(`📍 Base de datos: ${poolConfig.database}`);
      console.log(`🔗 Host: ${poolConfig.host}`);
      connection.release();
    }

    return pool;
  } catch (error) {
    console.error('❌ Error al crear el pool de conexiones:', error.message);
    throw error;
  }
};

/**
 * Cierra el pool de conexiones
 * Útil para cerrar conexiones al finalizar la aplicación
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('✅ Pool de conexiones cerrado correctamente');
    }
  } catch (error) {
    console.error('❌ Error al cerrar el pool de conexiones:', error.message);
    throw error;
  }
};

/**
 * Verifica el estado de la conexión a la base de datos
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
const checkConnection = async () => {
  try {
    const poolInstance = await getPool();
    const connection = await poolInstance.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al verificar la conexión:', error.message);
    return false;
  }
};

module.exports = {
  getPool,
  closePool,
  checkConnection
};
