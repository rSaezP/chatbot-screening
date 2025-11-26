/**
 * ManualEvaluator - Evaluador manual
 * Marca respuestas para evaluación manual posterior
 */

class ManualEvaluator {
  /**
   * Evaluar (marcar para revisión manual)
   * @param {Object} pregunta - Pregunta
   * @param {string} respuesta - Respuesta del candidato
   * @returns {Promise<Object>} Resultado marcado para revisión
   */
  async evaluar(pregunta, respuesta) {
    return {
      cumple: null, // null indica pendiente de evaluación
      puntaje: 0,
      razon: 'Pendiente de evaluación manual',
      metodo_evaluacion: 'manual',
      detalles: {
        respuesta_guardada: respuesta,
        estado: 'pendiente_revision',
        fecha_marcado: new Date().toISOString()
      }
    };
  }

  /**
   * Actualizar evaluación manual
   * @param {boolean} cumple - Si cumple o no
   * @param {number} puntaje - Puntaje asignado (0-100)
   * @param {string} razon - Razón de la evaluación
   * @param {string} evaluador - Nombre del evaluador
   * @returns {Object} Evaluación actualizada
   */
  actualizarEvaluacion(cumple, puntaje, razon, evaluador) {
    return {
      cumple,
      puntaje,
      razon,
      metodo_evaluacion: 'manual',
      detalles: {
        evaluador,
        fecha_evaluacion: new Date().toISOString(),
        estado: 'evaluado'
      }
    };
  }
}

module.exports = ManualEvaluator;
