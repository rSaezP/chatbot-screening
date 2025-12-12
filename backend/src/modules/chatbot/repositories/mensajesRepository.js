/**
 * Repository: Mensajes de Conversación
 * Maneja todas las operaciones de base de datos para cb_mensajes
 */

const { findAll, findOne, insert, update, remove } = require('../../../shared/utils/queryHelper');

/**
 * Crear un nuevo mensaje
 * @param {Object} datos - Datos del mensaje
 * @returns {Promise<number>} ID del mensaje creado
 */
const crear = async (datos) => {
  try {
    const sql = `
      INSERT INTO cb_mensajes (
        sesion_id,
        pregunta_id,
        tipo,
        contenido,
        metadata
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      datos.sesion_id,
      datos.pregunta_id || null,
      datos.tipo,
      datos.contenido,
      datos.metadata ? JSON.stringify(datos.metadata) : null
    ];

    return await insert(sql, params);
  } catch (error) {
    throw new Error(`Error al crear mensaje: ${error.message}`);
  }
};

/**
 * Obtener un mensaje por ID
 * @param {number} id - ID del mensaje
 * @returns {Promise<Object|null>} Mensaje encontrado o null
 */
const obtenerPorId = async (id) => {
  try {
    const sql = 'SELECT * FROM cb_mensajes WHERE id = ?';
    return await findOne(sql, [id]);
  } catch (error) {
    throw new Error(`Error al obtener mensaje por ID: ${error.message}`);
  }
};

/**
 * Obtener todos los mensajes de una sesión
 * @param {number} sesionId - ID de la sesión
 * @param {Object} filtros - Filtros opcionales (tipo)
 * @returns {Promise<Array>} Lista de mensajes
 */
const obtenerPorSesion = async (sesionId, filtros = {}) => {
  try {
    let sql = 'SELECT * FROM cb_mensajes WHERE sesion_id = ?';
    const params = [sesionId];

    if (filtros.tipo) {
      sql += ' AND tipo = ?';
      params.push(filtros.tipo);
    }

    sql += ' ORDER BY created_at ASC';

    return await findAll(sql, params);
  } catch (error) {
    throw new Error(`Error al obtener mensajes por sesión: ${error.message}`);
  }
};

/**
 * Obtener solo las preguntas de una sesión
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Array>} Lista de preguntas
 */
const obtenerPreguntasSesion = async (sesionId) => {
  try {
    const sql = `
      SELECT m.*, p.pregunta as texto_pregunta, p.tipo_campo
      FROM cb_mensajes m
      LEFT JOIN cb_preguntas p ON m.pregunta_id = p.id
      WHERE m.sesion_id = ? AND m.tipo = 'pregunta'
      ORDER BY m.created_at ASC
    `;
    return await findAll(sql, [sesionId]);
  } catch (error) {
    throw new Error(`Error al obtener preguntas de sesión: ${error.message}`);
  }
};

/**
 * Obtener solo las respuestas de una sesión
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Array>} Lista de respuestas
 */
const obtenerRespuestasSesion = async (sesionId) => {
  try {
    const sql = `
      SELECT m.*, p.pregunta as texto_pregunta
      FROM cb_mensajes m
      LEFT JOIN cb_preguntas p ON m.pregunta_id = p.id
      WHERE m.sesion_id = ? AND m.tipo = 'respuesta'
      ORDER BY m.created_at ASC
    `;
    return await findAll(sql, [sesionId]);
  } catch (error) {
    throw new Error(`Error al obtener respuestas de sesión: ${error.message}`);
  }
};

/**
 * Obtener conversación completa con detalles
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Array>} Conversación completa
 */
const obtenerConversacionCompleta = async (sesionId) => {
  try {
    const sql = `
      SELECT
        m.*,
        p.pregunta as texto_pregunta,
        p.tipo_campo,
        p.descripcion as descripcion_pregunta,
        p.media_url
      FROM cb_mensajes m
      LEFT JOIN cb_preguntas p ON m.pregunta_id = p.id
      WHERE m.sesion_id = ?
      ORDER BY m.created_at ASC
    `;
    return await findAll(sql, [sesionId]);
  } catch (error) {
    throw new Error(`Error al obtener conversación completa: ${error.message}`);
  }
};

/**
 * Actualizar un mensaje
 * @param {number} id - ID del mensaje
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<number>} Número de filas afectadas
 */
const actualizar = async (id, datos) => {
  try {
    const campos = [];
    const valores = [];

    if (datos.contenido !== undefined) {
      campos.push('contenido = ?');
      valores.push(datos.contenido);
    }

    if (datos.metadata !== undefined) {
      campos.push('metadata = ?');
      valores.push(datos.metadata ? JSON.stringify(datos.metadata) : null);
    }

    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    valores.push(id);

    const sql = `UPDATE cb_mensajes SET ${campos.join(', ')} WHERE id = ?`;
    return await update(sql, valores);
  } catch (error) {
    throw new Error(`Error al actualizar mensaje: ${error.message}`);
  }
};

/**
 * Eliminar un mensaje
 * @param {number} id - ID del mensaje
 * @returns {Promise<number>} Número de filas eliminadas
 */
const eliminar = async (id) => {
  try {
    const sql = 'DELETE FROM cb_mensajes WHERE id = ?';
    return await remove(sql, [id]);
  } catch (error) {
    throw new Error(`Error al eliminar mensaje: ${error.message}`);
  }
};

/**
 * Contar mensajes de una sesión por tipo
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Object>} Conteo por tipo
 */
const contarPorTipo = async (sesionId) => {
  try {
    const sql = `
      SELECT
        tipo,
        COUNT(*) as total
      FROM cb_mensajes
      WHERE sesion_id = ?
      GROUP BY tipo
    `;
    const resultados = await findAll(sql, [sesionId]);

    const conteo = {
      sistema: 0,
      pregunta: 0,
      respuesta: 0
    };

    resultados.forEach(item => {
      conteo[item.tipo] = item.total;
    });

    return conteo;
  } catch (error) {
    throw new Error(`Error al contar mensajes: ${error.message}`);
  }
};

/**
 * Obtener último mensaje de una sesión
 * @param {number} sesionId - ID de la sesión
 * @param {string} tipo - Tipo de mensaje (opcional)
 * @returns {Promise<Object|null>} Último mensaje
 */
const obtenerUltimoMensaje = async (sesionId, tipo = null) => {
  try {
    let sql = 'SELECT * FROM cb_mensajes WHERE sesion_id = ?';
    const params = [sesionId];

    if (tipo) {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }

    sql += ' ORDER BY created_at DESC LIMIT 1';

    return await findOne(sql, params);
  } catch (error) {
    throw new Error(`Error al obtener último mensaje: ${error.message}`);
  }
};

/**
 * Verificar si ya existe una respuesta para una pregunta en una sesión
 * @param {number} sesionId - ID de la sesión
 * @param {number} preguntaId - ID de la pregunta
 * @returns {Promise<boolean>} true si ya existe respuesta
 */
const existeRespuesta = async (sesionId, preguntaId) => {
  try {
    const sql = `
      SELECT COUNT(*) as total
      FROM cb_mensajes
      WHERE sesion_id = ? AND pregunta_id = ? AND tipo = 'respuesta'
    `;
    const resultado = await findOne(sql, [sesionId, preguntaId]);
    return resultado ? resultado.total > 0 : false;
  } catch (error) {
    throw new Error(`Error al verificar respuesta existente: ${error.message}`);
  }
};

/**
 * Eliminar todos los mensajes de una sesión
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<number>} Número de mensajes eliminados
 */
const eliminarPorSesion = async (sesionId) => {
  try {
    const sql = 'DELETE FROM cb_mensajes WHERE sesion_id = ?';
    return await remove(sql, [sesionId]);
  } catch (error) {
    throw new Error(`Error al eliminar mensajes de sesión: ${error.message}`);
  }
};

module.exports = {
  crear,
  obtenerPorId,
  obtenerPorSesion,
  obtenerPreguntasSesion,
  obtenerRespuestasSesion,
  obtenerConversacionCompleta,
  actualizar,
  eliminar,
  contarPorTipo,
  obtenerUltimoMensaje,
  existeRespuesta,
  eliminarPorSesion
};
