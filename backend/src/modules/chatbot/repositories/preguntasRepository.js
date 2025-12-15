/**
 * Repository: Preguntas de Chatbot
 * Maneja todas las operaciones de base de datos para cb_preguntas
 */

const { findAll, findOne, insert, update, remove, executeQuery } = require('../../../shared/utils/queryHelper');

/**
 * Obtener todas las preguntas de un chatbot
 * @param {number} configId - ID del chatbot
 * @param {boolean} soloActivas - Si true, solo retorna preguntas activas
 * @returns {Promise<Array>} Lista de preguntas
 */
const obtenerPorConfig = async (configId, soloActivas = false) => {
  try {
    let sql = 'SELECT * FROM cb_preguntas WHERE config_id = ?';

    if (soloActivas) {
      sql += ' AND activa = 1';
    }

    sql += ' ORDER BY orden ASC, id ASC';

    return await findAll(sql, [configId]);
  } catch (error) {
    throw new Error(`Error al obtener preguntas: ${error.message}`);
  }
};

/**
 * Obtener una pregunta por ID
 * @param {number} id - ID de la pregunta
 * @returns {Promise<Object|null>} Pregunta encontrada o null
 */
const obtenerPorId = async (id) => {
  try {
    const sql = 'SELECT * FROM cb_preguntas WHERE id = ?';
    return await findOne(sql, [id]);
  } catch (error) {
    throw new Error(`Error al obtener pregunta por ID: ${error.message}`);
  }
};

/**
 * Crear una nueva pregunta
 * @param {Object} datos - Datos de la pregunta
 * @returns {Promise<number>} ID de la pregunta creada
 */
const crear = async (datos) => {
  try {
    const sql = `
      INSERT INTO cb_preguntas (
        config_id,
        pregunta,
        descripcion,
        media_url,
        tipo_campo,
        opciones,
        requerida,
        min_longitud,
        max_longitud,
        patron_validacion,
        metodo_evaluacion,
        regla,
        usar_ia,
        prompt_ia,
        criterios_ia,
        es_eliminatoria,
        peso,
        orden,
        activa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      datos.config_id,
      datos.pregunta,
      datos.descripcion || null,
      datos.media_url || null,
      datos.tipo_campo || 'texto',
      datos.opciones ? JSON.stringify(datos.opciones) : null,
      datos.requerida !== undefined ? datos.requerida : true,
      datos.min_longitud || null,
      datos.max_longitud || null,
      datos.patron_validacion || null,
      datos.metodo_evaluacion || 'regla_fija',
      datos.regla ? JSON.stringify(datos.regla) : null,
      datos.usar_ia !== undefined ? datos.usar_ia : false,
      datos.prompt_ia || null,
      datos.criterios_ia ? JSON.stringify(datos.criterios_ia) : null,
      datos.es_eliminatoria !== undefined ? datos.es_eliminatoria : false,
      datos.peso || 1.00,
      datos.orden || 0,
      datos.activa !== undefined ? datos.activa : true
    ];

    return await insert(sql, params);
  } catch (error) {
    throw new Error(`Error al crear pregunta: ${error.message}`);
  }
};

/**
 * Actualizar una pregunta
 * @param {number} id - ID de la pregunta
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<number>} Número de filas afectadas
 */
const actualizar = async (id, datos) => {
  try {
    const campos = [];
    const valores = [];

    if (datos.pregunta !== undefined) {
      campos.push('pregunta = ?');
      valores.push(datos.pregunta);
    }
    if (datos.descripcion !== undefined) {
      campos.push('descripcion = ?');
      valores.push(datos.descripcion);
    }
    if (datos.media_url !== undefined) {
      campos.push('media_url = ?');
      valores.push(datos.media_url);
    }
    if (datos.tipo_campo !== undefined) {
      campos.push('tipo_campo = ?');
      valores.push(datos.tipo_campo);
    }
    if (datos.opciones !== undefined) {
      campos.push('opciones = ?');
      valores.push(datos.opciones ? JSON.stringify(datos.opciones) : null);
    }
    if (datos.requerida !== undefined) {
      campos.push('requerida = ?');
      valores.push(datos.requerida);
    }
    if (datos.min_longitud !== undefined) {
      campos.push('min_longitud = ?');
      valores.push(datos.min_longitud);
    }
    if (datos.max_longitud !== undefined) {
      campos.push('max_longitud = ?');
      valores.push(datos.max_longitud);
    }
    if (datos.patron_validacion !== undefined) {
      campos.push('patron_validacion = ?');
      valores.push(datos.patron_validacion);
    }
    if (datos.metodo_evaluacion !== undefined) {
      campos.push('metodo_evaluacion = ?');
      valores.push(datos.metodo_evaluacion);
    }
    if (datos.regla !== undefined) {
      campos.push('regla = ?');
      valores.push(datos.regla ? JSON.stringify(datos.regla) : null);
    }
    if (datos.usar_ia !== undefined) {
      campos.push('usar_ia = ?');
      valores.push(datos.usar_ia);
    }
    if (datos.prompt_ia !== undefined) {
      campos.push('prompt_ia = ?');
      valores.push(datos.prompt_ia);
    }
    if (datos.criterios_ia !== undefined) {
      campos.push('criterios_ia = ?');
      valores.push(datos.criterios_ia ? JSON.stringify(datos.criterios_ia) : null);
    }
    if (datos.es_eliminatoria !== undefined) {
      campos.push('es_eliminatoria = ?');
      valores.push(datos.es_eliminatoria);
    }
    if (datos.peso !== undefined) {
      campos.push('peso = ?');
      valores.push(datos.peso);
    }
    if (datos.orden !== undefined) {
      campos.push('orden = ?');
      valores.push(datos.orden);
    }
    if (datos.activa !== undefined) {
      campos.push('activa = ?');
      valores.push(datos.activa);
    }

    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    valores.push(id);

    const sql = `UPDATE cb_preguntas SET ${campos.join(', ')} WHERE id = ?`;
    return await update(sql, valores);
  } catch (error) {
    throw new Error(`Error al actualizar pregunta: ${error.message}`);
  }
};

/**
 * Eliminar una pregunta
 * @param {number} id - ID de la pregunta
 * @returns {Promise<number>} Número de filas eliminadas
 */
const eliminar = async (id) => {
  try {
    const sql = 'DELETE FROM cb_preguntas WHERE id = ?';
    return await remove(sql, [id]);
  } catch (error) {
    throw new Error(`Error al eliminar pregunta: ${error.message}`);
  }
};

/**
 * Desactivar una pregunta
 * @param {number} id - ID de la pregunta
 * @returns {Promise<number>} Número de filas afectadas
 */
const desactivar = async (id) => {
  try {
    const sql = 'UPDATE cb_preguntas SET activa = 0 WHERE id = ?';
    return await update(sql, [id]);
  } catch (error) {
    throw new Error(`Error al desactivar pregunta: ${error.message}`);
  }
};

/**
 * Reordenar preguntas de un chatbot
 * @param {number} configId - ID del chatbot
 * @param {Array} ordenIds - Array de IDs en el nuevo orden [id1, id2, id3...]
 * @returns {Promise<boolean>} true si se reordenó correctamente
 */
const reordenar = async (configId, ordenIds) => {
  try {
    // Actualizar el orden de cada pregunta
    for (let i = 0; i < ordenIds.length; i++) {
      const sql = 'UPDATE cb_preguntas SET orden = ? WHERE id = ? AND config_id = ?';
      await update(sql, [i, ordenIds[i], configId]);
    }
    return true;
  } catch (error) {
    throw new Error(`Error al reordenar preguntas: ${error.message}`);
  }
};

/**
 * Contar preguntas de un chatbot
 * @param {number} configId - ID del chatbot
 * @param {boolean} soloActivas - Si true, solo cuenta las activas
 * @returns {Promise<number>} Cantidad de preguntas
 */
const contar = async (configId, soloActivas = false) => {
  try {
    let sql = 'SELECT COUNT(*) as total FROM cb_preguntas WHERE config_id = ?';
    const params = [configId];

    if (soloActivas) {
      sql += ' AND activa = 1';
    }

    const resultado = await findOne(sql, params);
    return resultado ? resultado.total : 0;
  } catch (error) {
    throw new Error(`Error al contar preguntas: ${error.message}`);
  }
};

/**
 * Obtener preguntas eliminatorias de un chatbot
 * @param {number} configId - ID del chatbot
 * @returns {Promise<Array>} Lista de preguntas eliminatorias
 */
const obtenerEliminatorias = async (configId) => {
  try {
    const sql = `
      SELECT * FROM cb_preguntas
      WHERE config_id = ? AND es_eliminatoria = 1 AND activa = 1
      ORDER BY orden ASC
    `;
    return await findAll(sql, [configId]);
  } catch (error) {
    throw new Error(`Error al obtener preguntas eliminatorias: ${error.message}`);
  }
};

module.exports = {
  obtenerPorConfig,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  desactivar,
  reordenar,
  contar,
  obtenerEliminatorias
};
