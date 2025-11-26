/**
 * ScoringService - Servicio de cálculo de puntajes
 * Calcula puntajes totales, porcentajes y determina aprobación
 */

class ScoringService {
  /**
   * Calcular puntaje total ponderado
   * @param {Array} evaluaciones - Array de evaluaciones con sus preguntas
   * @returns {Object} Puntaje total y máximo
   */
  static calcularPuntaje(evaluaciones) {
    let puntajeTotal = 0;
    let puntajeMaximo = 0;

    evaluaciones.forEach(evaluacion => {
      const peso = parseFloat(evaluacion.peso) || 1;
      const puntaje = parseFloat(evaluacion.puntaje) || 0;

      // Puntaje obtenido = (puntaje de evaluación * peso)
      puntajeTotal += (puntaje * peso);

      // Puntaje máximo = (100 * peso)
      puntajeMaximo += (100 * peso);
    });

    return {
      puntaje_total: Math.round(puntajeTotal * 100) / 100, // 2 decimales
      puntaje_maximo: Math.round(puntajeMaximo * 100) / 100
    };
  }

  /**
   * Calcular porcentaje de aprobación
   * @param {number} puntajeTotal - Puntaje total obtenido
   * @param {number} puntajeMaximo - Puntaje máximo posible
   * @returns {number} Porcentaje (0-100)
   */
  static calcularPorcentaje(puntajeTotal, puntajeMaximo) {
    if (puntajeMaximo === 0) {
      return 0;
    }

    const porcentaje = (puntajeTotal / puntajeMaximo) * 100;
    return Math.round(porcentaje * 100) / 100; // 2 decimales
  }

  /**
   * Determinar si aprueba o no según el umbral
   * @param {number} porcentaje - Porcentaje obtenido
   * @param {number} umbral - Umbral de aprobación
   * @returns {string} 'aprobado' o 'rechazado'
   */
  static determinarAprobacion(porcentaje, umbral) {
    return porcentaje >= umbral ? 'aprobado' : 'rechazado';
  }

  /**
   * Verificar si hay preguntas eliminatorias reprobadas
   * @param {Array} evaluaciones - Array de evaluaciones
   * @returns {boolean} true si hay eliminatorias reprobadas
   */
  static tieneEliminatoriasReprobadas(evaluaciones) {
    return evaluaciones.some(evaluacion =>
      evaluacion.es_eliminatoria && !evaluacion.cumple
    );
  }

  /**
   * Calcular resultado completo de una sesión
   * @param {Array} evaluaciones - Evaluaciones con preguntas
   * @param {number} umbralAprobacion - Umbral de aprobación
   * @returns {Object} Resultado completo
   */
  static calcularResultadoCompleto(evaluaciones, umbralAprobacion) {
    // Verificar eliminatorias
    const tieneEliminatoriasReprobadas = this.tieneEliminatoriasReprobadas(evaluaciones);

    if (tieneEliminatoriasReprobadas) {
      return {
        puntaje_total: 0,
        puntaje_maximo: 0,
        porcentaje: 0,
        resultado: 'rechazado',
        razon: 'Reprobó una o más preguntas eliminatorias',
        eliminatorias_reprobadas: evaluaciones.filter(e => e.es_eliminatoria && !e.cumple).length
      };
    }

    // Calcular puntajes
    const { puntaje_total, puntaje_maximo } = this.calcularPuntaje(evaluaciones);
    const porcentaje = this.calcularPorcentaje(puntaje_total, puntaje_maximo);
    const resultado = this.determinarAprobacion(porcentaje, umbralAprobacion);

    // Estadísticas adicionales
    const totalPreguntas = evaluaciones.length;
    const preguntasAprobadas = evaluaciones.filter(e => e.cumple).length;
    const preguntasReprobadas = totalPreguntas - preguntasAprobadas;

    return {
      puntaje_total,
      puntaje_maximo,
      porcentaje,
      resultado,
      razon: resultado === 'aprobado'
        ? `Aprobado con ${porcentaje}% (umbral: ${umbralAprobacion}%)`
        : `Reprobado con ${porcentaje}% (umbral: ${umbralAprobacion}%)`,
      estadisticas: {
        total_preguntas: totalPreguntas,
        preguntas_aprobadas: preguntasAprobadas,
        preguntas_reprobadas: preguntasReprobadas,
        porcentaje_preguntas_aprobadas: Math.round((preguntasAprobadas / totalPreguntas) * 100)
      },
      eliminatorias_reprobadas: 0
    };
  }

  /**
   * Obtener distribución de puntajes por método de evaluación
   * @param {Array} evaluaciones - Evaluaciones
   * @returns {Object} Distribución
   */
  static distribucionPorMetodo(evaluaciones) {
    const distribucion = {
      regla_fija: { count: 0, puntaje_promedio: 0 },
      ia: { count: 0, puntaje_promedio: 0 },
      manual: { count: 0, puntaje_promedio: 0 }
    };

    evaluaciones.forEach(evaluacion => {
      const metodo = evaluacion.metodo_evaluacion || 'regla_fija';
      if (distribucion[metodo]) {
        distribucion[metodo].count++;
        distribucion[metodo].puntaje_promedio += parseFloat(evaluacion.puntaje) || 0;
      }
    });

    // Calcular promedios
    Object.keys(distribucion).forEach(metodo => {
      if (distribucion[metodo].count > 0) {
        distribucion[metodo].puntaje_promedio =
          Math.round((distribucion[metodo].puntaje_promedio / distribucion[metodo].count) * 100) / 100;
      }
    });

    return distribucion;
  }
}

module.exports = ScoringService;
