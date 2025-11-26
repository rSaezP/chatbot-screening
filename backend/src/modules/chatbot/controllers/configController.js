/**
 * Controller: Configuración de Chatbots
 * Maneja las peticiones HTTP relacionadas con configuración y preguntas
 */

const configRepository = require('../repositories/configRepository');
const preguntasRepository = require('../repositories/preguntasRepository');

// ============================================================================
// CONTROLADORES DE CONFIGURACIÓN
// ============================================================================

/**
 * GET /api/config
 * Obtener todos los chatbots
 */
const obtenerTodos = async (req, res, next) => {
  try {
    const soloActivos = req.query.activos === 'true';
    const chatbots = await configRepository.obtenerTodos(soloActivos);

    res.json({
      success: true,
      data: chatbots,
      total: chatbots.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/config/:id
 * Obtener un chatbot por ID
 */
const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chatbot = await configRepository.obtenerPorId(id);

    if (!chatbot) {
      return res.status(404).json({
        success: false,
        message: 'Chatbot no encontrado'
      });
    }

    res.json({
      success: true,
      data: chatbot
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/config
 * Crear un nuevo chatbot
 */
const crear = async (req, res, next) => {
  try {
    const datos = req.body;

    // Validar campos requeridos
    if (!datos.nombre) {
      return res.status(400).json({
        success: false,
        message: 'El campo "nombre" es requerido'
      });
    }

    // Verificar que no exista un chatbot con el mismo nombre
    const existe = await configRepository.obtenerPorNombre(datos.nombre);
    if (existe) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un chatbot con ese nombre'
      });
    }

    const nuevoId = await configRepository.crear(datos);
    const chatbot = await configRepository.obtenerPorId(nuevoId);

    res.status(201).json({
      success: true,
      message: 'Chatbot creado exitosamente',
      data: chatbot
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/config/:id
 * Actualizar un chatbot
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    // Verificar que el chatbot existe
    const chatbot = await configRepository.obtenerPorId(id);
    if (!chatbot) {
      return res.status(404).json({
        success: false,
        message: 'Chatbot no encontrado'
      });
    }

    // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
    if (datos.nombre && datos.nombre !== chatbot.nombre) {
      const existe = await configRepository.obtenerPorNombre(datos.nombre);
      if (existe) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro chatbot con ese nombre'
        });
      }
    }

    await configRepository.actualizar(id, datos);
    const chatbotActualizado = await configRepository.obtenerPorId(id);

    res.json({
      success: true,
      message: 'Chatbot actualizado exitosamente',
      data: chatbotActualizado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/config/:id
 * Eliminar un chatbot (soft delete)
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permanente } = req.query;

    // Verificar que el chatbot existe
    const chatbot = await configRepository.obtenerPorId(id);
    if (!chatbot) {
      return res.status(404).json({
        success: false,
        message: 'Chatbot no encontrado'
      });
    }

    if (permanente === 'true') {
      // Eliminación permanente
      await configRepository.eliminar(id);
      return res.json({
        success: true,
        message: 'Chatbot eliminado permanentemente'
      });
    } else {
      // Soft delete (desactivar)
      await configRepository.desactivar(id);
      return res.json({
        success: true,
        message: 'Chatbot desactivado exitosamente'
      });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// CONTROLADORES DE PREGUNTAS
// ============================================================================

/**
 * GET /api/config/:id/preguntas
 * Obtener todas las preguntas de un chatbot
 */
const obtenerPreguntas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const soloActivas = req.query.activas === 'true';

    // Verificar que el chatbot existe
    const chatbot = await configRepository.obtenerPorId(id);
    if (!chatbot) {
      return res.status(404).json({
        success: false,
        message: 'Chatbot no encontrado'
      });
    }

    const preguntas = await preguntasRepository.obtenerPorConfig(id, soloActivas);

    res.json({
      success: true,
      data: preguntas,
      total: preguntas.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/config/:configId/preguntas/:preguntaId
 * Obtener una pregunta específica
 */
const obtenerPreguntaPorId = async (req, res, next) => {
  try {
    const { preguntaId } = req.params;

    const pregunta = await preguntasRepository.obtenerPorId(preguntaId);

    if (!pregunta) {
      return res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada'
      });
    }

    res.json({
      success: true,
      data: pregunta
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/config/:id/preguntas
 * Crear una nueva pregunta para un chatbot
 */
const crearPregunta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    // Verificar que el chatbot existe
    const chatbot = await configRepository.obtenerPorId(id);
    if (!chatbot) {
      return res.status(404).json({
        success: false,
        message: 'Chatbot no encontrado'
      });
    }

    // Validar campos requeridos
    if (!datos.pregunta) {
      return res.status(400).json({
        success: false,
        message: 'El campo "pregunta" es requerido'
      });
    }

    // Asignar el config_id
    datos.config_id = id;

    // Si no se especifica orden, obtener el siguiente
    if (!datos.orden && datos.orden !== 0) {
      const totalPreguntas = await preguntasRepository.contar(id);
      datos.orden = totalPreguntas;
    }

    const nuevaPreguntaId = await preguntasRepository.crear(datos);
    const pregunta = await preguntasRepository.obtenerPorId(nuevaPreguntaId);

    res.status(201).json({
      success: true,
      message: 'Pregunta creada exitosamente',
      data: pregunta
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/config/:configId/preguntas/:preguntaId
 * Actualizar una pregunta
 */
const actualizarPregunta = async (req, res, next) => {
  try {
    const { preguntaId } = req.params;
    const datos = req.body;

    // Verificar que la pregunta existe
    const pregunta = await preguntasRepository.obtenerPorId(preguntaId);
    if (!pregunta) {
      return res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada'
      });
    }

    await preguntasRepository.actualizar(preguntaId, datos);
    const preguntaActualizada = await preguntasRepository.obtenerPorId(preguntaId);

    res.json({
      success: true,
      message: 'Pregunta actualizada exitosamente',
      data: preguntaActualizada
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/config/:configId/preguntas/:preguntaId
 * Eliminar una pregunta
 */
const eliminarPregunta = async (req, res, next) => {
  try {
    const { preguntaId } = req.params;

    // Verificar que la pregunta existe
    const pregunta = await preguntasRepository.obtenerPorId(preguntaId);
    if (!pregunta) {
      return res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada'
      });
    }

    await preguntasRepository.eliminar(preguntaId);

    res.json({
      success: true,
      message: 'Pregunta eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/config/:id/preguntas/reordenar
 * Reordenar preguntas de un chatbot
 */
const reordenarPreguntas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orden } = req.body; // Array de IDs [id1, id2, id3...]

    if (!Array.isArray(orden) || orden.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array "orden" con los IDs de las preguntas'
      });
    }

    await preguntasRepository.reordenar(id, orden);

    res.json({
      success: true,
      message: 'Preguntas reordenadas exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Configuración
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,

  // Preguntas
  obtenerPreguntas,
  obtenerPreguntaPorId,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  reordenarPreguntas
};
