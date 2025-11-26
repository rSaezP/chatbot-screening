/**
 * Repository: Evaluaciones de Respuestas
 * Maneja todas las operaciones de base de datos para cb_evaluaciones
 */

const { findAll, findOne, insert, update, remove } = require('../../../shared/utils/queryHelper');

/**
 * Crear una nueva evaluación
 * @param {Object} datos - Datos de la evaluación
 * @returns {Promise<number>} ID de la evaluación creada
 */
const crear = async (datos) => {
  try {
    const sql = `
      INSERT INTO cb_evaluaciones (
        sesion_id,
        pregunta_id,
        mensaje_id,
        cumple,
        puntaje,
        razon,
        metodo_evaluacion,
        detalles,
        evaluador
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      datos.sesion_id,
      datos.pregunta_id,
      datos.mensaje_id || null,
      datos.cumple,
      datos.puntaje || 0.00,
      datos.razon || null,
      datos.metodo_evaluacion,
      datos.detalles ? JSON.stringify(datos.detalles) : null,
      datos.evaluador || 'sistema'
    ];

    return await insert(sql, params);
  } catch (error) {
    throw new Error(`Error al crear evaluación: ${error.message}`);
  }
};

/**
 * Obtener una evaluación por ID
 * @param {number} id - ID de la evaluación
 * @returns {Promise<Object|null>} Evaluación encontrada o null
 */
const obtenerPorId = async (id) => {
  try {
    const sql = 'SELECT * FROM cb_evaluaciones WHERE id = ?';
    return await findOne(sql, [id]);
  } catch (error) {
    throw new Error(`Error al obtener evaluación por ID: ${error.message}`);
  }
};

/**
 * Obtener todas las evaluaciones de una sesión
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Array>} Lista de evaluaciones
 */
const obtenerPorSesion = async (sesionId) => {
  try {
    const sql = `
      SELECT
        e.*,
        p.pregunta,
        p.peso,
        p.es_eliminatoria
      FROM cb_evaluaciones e
      INNER JOIN cb_preguntas p ON e.pregunta_id = p.id
      WHERE e.sesion_id = ?
      ORDER BY e.created_at ASC
    `;
    return await findAll(sql, [sesionId]);
  } catch (error) {
    throw new Error(`Error al obtener evaluaciones por sesión: ${error.message}`);
  }
};

/**
 * Obtener evaluación por mensaje
 * @param {number} mensajeId - ID del mensaje
 * @returns {Promise<Object|null>} Evaluación encontrada o null
 */
const obtenerPorMensaje = async (mensajeId) => {
  try {
    const sql = `
      SELECT
        e.*,
        p.pregunta,
        p.peso,
        p.es_eliminatoria
      FROM cb_evaluaciones e
      INNER JOIN cb_preguntas p ON e.pregunta_id = p.id
      WHERE e.mensaje_id = ?
    `;
    return await findOne(sql, [mensajeId]);
  } catch (error) {
    throw new Error(`Error al obtener evaluación por mensaje: ${error.message}`);
  }
};

/**
 * Obtener evaluación de una pregunta específica en una sesión
 * @param {number} sesionId - ID de la sesión
 * @param {number} preguntaId - ID de la pregunta
 * @returns {Promise<Object|null>} Evaluación encontrada o null
 */
const obtenerPorPregunta = async (sesionId, preguntaId) => {
  try {
    const sql = `
      SELECT
        e.*,
        p.pregunta,
        p.peso,
        p.es_eliminatoria
      FROM cb_evaluaciones e
      INNER JOIN cb_preguntas p ON e.pregunta_id = p.id
      WHERE e.sesion_id = ? AND e.pregunta_id = ?
    `;
    return await findOne(sql, [sesionId, preguntaId]);
  } catch (error) {
    throw new Error(`Error al obtener evaluación por pregunta: ${error.message}`);
  }
};

/**
 * Actualizar una evaluación
 * @param {number} id - ID de la evaluación
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<number>} Número de filas afectadas
 */
const actualizar = async (id, datos) => {
  try {
    const campos = [];
    const valores = [];

    if (datos.cumple !== undefined) {
      campos.push('cumple = ?');
      valores.push(datos.cumple);
    }

    if (datos.puntaje !== undefined) {
      campos.push('puntaje = ?');
      valores.push(datos.puntaje);
    }

    if (datos.razon !== undefined) {
      campos.push('razon = ?');
      valores.push(datos.razon);
    }

    if (datos.detalles !== undefined) {
      campos.push('detalles = ?');
      valores.push(datos.detalles ? JSON.stringify(datos.detalles) : null);
    }

    if (datos.evaluador !== undefined) {
      campos.push('evaluador = ?');
      valores.push(datos.evaluador);
    }

    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    valores.push(id);

    const sql = `UPDATE cb_evaluaciones SET ${campos.join(', ')} WHERE id = ?`;
    return await update(sql, valores);
  } catch (error) {
    throw new Error(`Error al actualizar evaluación: ${error.message}`);
  }
};

/**
 * Eliminar una evaluación
 * @param {number} id - ID de la evaluación
 * @returns {Promise<number>} Número de filas eliminadas
 */
const eliminar = async (id) => {
  try {
    const sql = 'DELETE FROM cb_evaluaciones WHERE id = ?';
    return await remove(sql, [id]);
  } catch (error) {
    throw new Error(`Error al eliminar evaluación: ${error.message}`);
  }
};

/**
 * Obtener estadísticas de evaluaciones de una sesión
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Object>} Estadísticas de evaluación
 */
const estadisticasPorSesion = async (sesionId) => {
  try {
    const sql = `
      SELECT
        COUNT(*) as total_evaluaciones,
        SUM(CASE WHEN cumple = 1 THEN 1 ELSE 0 END) as preguntas_aprobadas,
        SUM(CASE WHEN cumple = 0 THEN 1 ELSE 0 END) as preguntas_reprobadas,
        SUM(CASE WHEN cumple IS NULL THEN 1 ELSE 0 END) as preguntas_pendientes,
        SUM(puntaje) as puntaje_total,
        AVG(puntaje) as puntaje_promedio,
        SUM(CASE WHEN metodo_evaluacion = 'regla_fija' THEN 1 ELSE 0 END) as evaluadas_regla,
        SUM(CASE WHEN metodo_evaluacion = 'ia' THEN 1 ELSE 0 END) as evaluadas_ia,
        SUM(CASE WHEN metodo_evaluacion = 'manual' THEN 1 ELSE 0 END) as evaluadas_manual
      FROM cb_evaluaciones
      WHERE sesion_id = ?
    `;
    return await findOne(sql, [sesionId]);
  } catch (error) {
    throw new Error(`Error al obtener estadísticas: ${error.message}`);
  }
};

/**
 * Verificar si hay preguntas eliminatorias reprobadas
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<boolean>} true si hay eliminatorias reprobadas
 */
const tieneEliminatoriasReprobadas = async (sesionId) => {
  try {
    const sql = `
      SELECT COUNT(*) as total
      FROM cb_evaluaciones e
      INNER JOIN cb_preguntas p ON e.pregunta_id = p.id
      WHERE e.sesion_id = ? AND p.es_eliminatoria = 1 AND e.cumple = 0
    `;
    const resultado = await findOne(sql, [sesionId]);
    return resultado ? resultado.total > 0 : false;
  } catch (error) {
    throw new Error(`Error al verificar eliminatorias: ${error.message}`);
  }
};

/**
 * Calcular puntaje ponderado de una sesión
 * @param {number} sesionId - ID de la sesión
 * @returns {Promise<Object>} Puntaje total y máximo
 */
const calcularPuntajePonderado = async (sesionId) => {
  try {
    const sql = `
      SELECT
        SUM(e.puntaje * p.peso) as puntaje_total,
        SUM(p.peso * 100) as puntaje_maximo
      FROM cb_evaluaciones e
      INNER JOIN cb_preguntas p ON e.pregunta_id = p.id
      WHERE e.sesion_id = ?
    `;
    const resultado = await findOne(sql, [sesionId]);
    return {
      puntaje_total: resultado?.puntaje_total || 0,
      puntaje_maximo: resultado?.puntaje_maximo || 0
    };
  } catch (error) {
    throw new Error(`Error al calcular puntaje ponderado: ${error.message}`);
  }
};

/**
 * Obtener evaluaciones pendientes de revisión manual
 * @param {number} configId - ID del chatbot (opcional)
 * @returns {Promise<Array>} Lista de evaluaciones pendientes
 */
const obtenerPendientes = async (configId = null) => {
  try {
    let sql = `
      SELECT
        e.*,
        p.pregunta,
        p.peso,
        p.es_eliminatoria,
        s.token as sesion_token,
        s.candidato_nombre,
        s.candidato_email,
        c.nombre as chatbot_nombre
      FROM cb_evaluaciones e
      INNER JOIN cb_preguntas p ON e.pregunta_id = p.id
      INNER JOIN cb_sesiones s ON e.sesion_id = s.id
      INNER JOIN cb_config c ON s.config_id = c.id
      WHERE e.cumple IS NULL
    `;

    const params = [];

    if (configId) {
      sql += ' AND s.config_id = ?';
      params.push(configId);
    }

    sql += ' ORDER BY e.created_at DESC';

    return await findAll(sql, params);
  } catch (error) {
    throw new Error(`Error al obtener evaluaciones pendientes: ${error.message}`);
  }
};

module.exports = {
  crear,
  obtenerPorId,
  obtenerPorSesion,
  obtenerPorMensaje,
  obtenerPorPregunta,
  actualizar,
  eliminar,
  estadisticasPorSesion,
  tieneEliminatoriasReprobadas,
  calcularPuntajePonderado,
  obtenerPendientes
};
