/**
 * Utilidad para ejecutar queries de MySQL de forma simplificada
 * Incluye manejo de errores y logs informativos
 */

const { getPool } = require('../../config/database');

/**
 * Ejecuta una query SQL con parámetros
 * @param {string} sql - Query SQL a ejecutar
 * @param {Array} params - Parámetros para la query (opcional)
 * @param {boolean} showLog - Mostrar logs en consola (default: false)
 * @returns {Promise<Array>} Resultados de la query
 */
const executeQuery = async (sql, params = [], showLog = false) => {
  let connection = null;

  try {
    // Obtener pool de conexiones
    const pool = await getPool();

    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Log opcional para debugging
    if (showLog) {
      console.log('🔍 Ejecutando query:', sql);
      if (params.length > 0) {
        console.log('📝 Parámetros:', params);
      }
    }

    // Ejecutar la query
    const [rows] = await connection.execute(sql, params);

    // Log de resultado
    if (showLog) {
      console.log(`✅ Query ejecutada. Filas afectadas/retornadas: ${rows.length || rows.affectedRows || 0}`);
    }

    return rows;

  } catch (error) {
    console.error('❌ Error al ejecutar query:', error.message);
    console.error('📄 SQL:', sql);
    if (params.length > 0) {
      console.error('📝 Parámetros:', params);
    }
    throw error;

  } finally {
    // Liberar la conexión de vuelta al pool
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Ejecuta una query SELECT y retorna un solo registro
 * @param {string} sql - Query SQL SELECT
 * @param {Array} params - Parámetros para la query
 * @param {boolean} showLog - Mostrar logs en consola
 * @returns {Promise<Object|null>} Primer registro encontrado o null
 */
const findOne = async (sql, params = [], showLog = false) => {
  try {
    const rows = await executeQuery(sql, params, showLog);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('❌ Error en findOne:', error.message);
    throw error;
  }
};

/**
 * Ejecuta una query SELECT y retorna todos los registros
 * @param {string} sql - Query SQL SELECT
 * @param {Array} params - Parámetros para la query
 * @param {boolean} showLog - Mostrar logs en consola
 * @returns {Promise<Array>} Array de registros encontrados
 */
const findAll = async (sql, params = [], showLog = false) => {
  try {
    return await executeQuery(sql, params, showLog);
  } catch (error) {
    console.error('❌ Error en findAll:', error.message);
    throw error;
  }
};

/**
 * Ejecuta una query INSERT y retorna el ID insertado
 * @param {string} sql - Query SQL INSERT
 * @param {Array} params - Parámetros para la query
 * @param {boolean} showLog - Mostrar logs en consola
 * @returns {Promise<number>} ID del registro insertado
 */
const insert = async (sql, params = [], showLog = false) => {
  try {
    const result = await executeQuery(sql, params, showLog);
    return result.insertId;
  } catch (error) {
    console.error('❌ Error en insert:', error.message);
    throw error;
  }
};

/**
 * Ejecuta una query UPDATE y retorna el número de filas afectadas
 * @param {string} sql - Query SQL UPDATE
 * @param {Array} params - Parámetros para la query
 * @param {boolean} showLog - Mostrar logs en consola
 * @returns {Promise<number>} Número de filas afectadas
 */
const update = async (sql, params = [], showLog = false) => {
  try {
    const result = await executeQuery(sql, params, showLog);
    return result.affectedRows;
  } catch (error) {
    console.error('❌ Error en update:', error.message);
    throw error;
  }
};

/**
 * Ejecuta una query DELETE y retorna el número de filas eliminadas
 * @param {string} sql - Query SQL DELETE
 * @param {Array} params - Parámetros para la query
 * @param {boolean} showLog - Mostrar logs en consola
 * @returns {Promise<number>} Número de filas eliminadas
 */
const remove = async (sql, params = [], showLog = false) => {
  try {
    const result = await executeQuery(sql, params, showLog);
    return result.affectedRows;
  } catch (error) {
    console.error('❌ Error en remove:', error.message);
    throw error;
  }
};

/**
 * Ejecuta múltiples queries dentro de una transacción
 * @param {Function} callback - Función que recibe la conexión y ejecuta las queries
 * @returns {Promise<any>} Resultado de la transacción
 */
const transaction = async (callback) => {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    // Iniciar transacción
    await connection.beginTransaction();
    console.log('🔄 Transacción iniciada');

    // Ejecutar el callback con la conexión
    const result = await callback(connection);

    // Confirmar transacción
    await connection.commit();
    console.log('✅ Transacción confirmada');

    return result;

  } catch (error) {
    // Revertir transacción en caso de error
    await connection.rollback();
    console.error('❌ Transacción revertida:', error.message);
    throw error;

  } finally {
    // Liberar conexión
    connection.release();
  }
};

module.exports = {
  executeQuery,
  findOne,
  findAll,
  insert,
  update,
  remove,
  transaction
};
