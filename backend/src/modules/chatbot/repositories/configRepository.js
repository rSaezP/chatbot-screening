/**
 * Repository: Configuración de Chatbots
 * Maneja todas las operaciones de base de datos para cb_config
 */

const { findAll, findOne, insert, update, remove } = require('../../../shared/utils/queryHelper');

/**
 * Obtener todos los chatbots
 * @param {boolean} soloActivos - Si true, solo retorna chatbots activos
 * @returns {Promise<Array>} Lista de chatbots
 */
const obtenerTodos = async (soloActivos = false) => {
  try {
    let sql = 'SELECT * FROM cb_config';

    if (soloActivos) {
      sql += ' WHERE activo = 1';
    }

    sql += ' ORDER BY created_at DESC';

    return await findAll(sql);
  } catch (error) {
    throw new Error(`Error al obtener chatbots: ${error.message}`);
  }
};

/**
 * Obtener un chatbot por ID
 * @param {number} id - ID del chatbot
 * @returns {Promise<Object|null>} Chatbot encontrado o null
 */
const obtenerPorId = async (id) => {
  try {
    const sql = 'SELECT * FROM cb_config WHERE id = ?';
    return await findOne(sql, [id]);
  } catch (error) {
    throw new Error(`Error al obtener chatbot por ID: ${error.message}`);
  }
};

/**
 * Obtener chatbot por nombre
 * @param {string} nombre - Nombre del chatbot
 * @returns {Promise<Object|null>} Chatbot encontrado o null
 */
const obtenerPorNombre = async (nombre) => {
  try {
    const sql = 'SELECT * FROM cb_config WHERE nombre = ?';
    return await findOne(sql, [nombre]);
  } catch (error) {
    throw new Error(`Error al obtener chatbot por nombre: ${error.message}`);
  }
};

/**
 * Crear un nuevo chatbot
 * @param {Object} datos - Datos del chatbot
 * @returns {Promise<number>} ID del chatbot creado
 */
const crear = async (datos) => {
  try {
    const sql = `
      INSERT INTO cb_config (
        nombre,
        descripcion,
        categoria,
        duracion_dias,
        umbral_aprobacion,
        nombre_asistente,
        avatar_url,
        idioma,
        color_botones,
        color_conversacion,
        color_fondo,
        mensaje_bienvenida,
        mensaje_aprobado,
        mensaje_rechazado,
        email_reclutador,
        mensaje_finalizacion,
        smtp_config,
        activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      datos.nombre,
      datos.descripcion || null,
      datos.categoria || null,
      datos.duracion_dias || 7,
      datos.umbral_aprobacion || 70.00,
      datos.nombre_asistente || 'Asistente Virtual',
      datos.avatar_url || null,
      datos.idioma || 'es',
      datos.color_botones || '#007bff',
      datos.color_conversacion || '#f8f9fa',
      datos.color_fondo || '#ffffff',
      datos.mensaje_bienvenida || null,
      datos.mensaje_aprobado || null,
      datos.mensaje_rechazado || null,
      datos.email_reclutador || null,
      datos.mensaje_finalizacion || null,
      datos.smtp_config ? JSON.stringify(datos.smtp_config) : null,
      datos.activo !== undefined ? datos.activo : true
    ];

    return await insert(sql, params);
  } catch (error) {
    throw new Error(`Error al crear chatbot: ${error.message}`);
  }
};

/**
 * Actualizar un chatbot
 * @param {number} id - ID del chatbot
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<number>} Número de filas afectadas
 */
const actualizar = async (id, datos) => {
  try {
    // Construir dinámicamente la query según los campos recibidos
    const campos = [];
    const valores = [];

    if (datos.nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(datos.nombre);
    }
    if (datos.descripcion !== undefined) {
      campos.push('descripcion = ?');
      valores.push(datos.descripcion);
    }
    if (datos.categoria !== undefined) {
      campos.push('categoria = ?');
      valores.push(datos.categoria);
    }
    if (datos.duracion_dias !== undefined) {
      campos.push('duracion_dias = ?');
      valores.push(datos.duracion_dias);
    }
    if (datos.umbral_aprobacion !== undefined) {
      campos.push('umbral_aprobacion = ?');
      valores.push(datos.umbral_aprobacion);
    }
    if (datos.nombre_asistente !== undefined) {
      campos.push('nombre_asistente = ?');
      valores.push(datos.nombre_asistente);
    }
    if (datos.avatar_url !== undefined) {
      campos.push('avatar_url = ?');
      valores.push(datos.avatar_url);
    }
    if (datos.idioma !== undefined) {
      campos.push('idioma = ?');
      valores.push(datos.idioma);
    }
    if (datos.color_botones !== undefined) {
      campos.push('color_botones = ?');
      valores.push(datos.color_botones);
    }
    if (datos.color_conversacion !== undefined) {
      campos.push('color_conversacion = ?');
      valores.push(datos.color_conversacion);
    }
    if (datos.color_fondo !== undefined) {
      campos.push('color_fondo = ?');
      valores.push(datos.color_fondo);
    }
    if (datos.mensaje_bienvenida !== undefined) {
      campos.push('mensaje_bienvenida = ?');
      valores.push(datos.mensaje_bienvenida);
    }
    if (datos.mensaje_aprobado !== undefined) {
      campos.push('mensaje_aprobado = ?');
      valores.push(datos.mensaje_aprobado);
    }
    if (datos.mensaje_rechazado !== undefined) {
      campos.push('mensaje_rechazado = ?');
      valores.push(datos.mensaje_rechazado);
    }
    if (datos.email_reclutador !== undefined) {
      campos.push('email_reclutador = ?');
      valores.push(datos.email_reclutador);
    }
    if (datos.mensaje_finalizacion !== undefined) {
      campos.push('mensaje_finalizacion = ?');
      valores.push(datos.mensaje_finalizacion);
    }
    if (datos.smtp_config !== undefined) {
      campos.push('smtp_config = ?');
      valores.push(datos.smtp_config ? JSON.stringify(datos.smtp_config) : null);
    }
    if (datos.activo !== undefined) {
      campos.push('activo = ?');
      valores.push(datos.activo);
    }

    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    valores.push(id);

    const sql = `UPDATE cb_config SET ${campos.join(', ')} WHERE id = ?`;
    return await update(sql, valores);
  } catch (error) {
    throw new Error(`Error al actualizar chatbot: ${error.message}`);
  }
};

/**
 * Eliminar un chatbot (soft delete - marca como inactivo)
 * @param {number} id - ID del chatbot
 * @returns {Promise<number>} Número de filas afectadas
 */
const desactivar = async (id) => {
  try {
    const sql = 'UPDATE cb_config SET activo = 0 WHERE id = ?';
    return await update(sql, [id]);
  } catch (error) {
    throw new Error(`Error al desactivar chatbot: ${error.message}`);
  }
};

/**
 * Eliminar un chatbot permanentemente
 * @param {number} id - ID del chatbot
 * @returns {Promise<number>} Número de filas eliminadas
 */
const eliminar = async (id) => {
  try {
    const sql = 'DELETE FROM cb_config WHERE id = ?';
    return await remove(sql, [id]);
  } catch (error) {
    throw new Error(`Error al eliminar chatbot: ${error.message}`);
  }
};

/**
 * Contar chatbots por categoría
 * @param {string} categoria - Categoría a contar
 * @returns {Promise<number>} Cantidad de chatbots
 */
const contarPorCategoria = async (categoria) => {
  try {
    const sql = 'SELECT COUNT(*) as total FROM cb_config WHERE categoria = ?';
    const resultado = await findOne(sql, [categoria]);
    return resultado ? resultado.total : 0;
  } catch (error) {
    throw new Error(`Error al contar chatbots por categoría: ${error.message}`);
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorNombre,
  crear,
  actualizar,
  desactivar,
  eliminar,
  contarPorCategoria
};
