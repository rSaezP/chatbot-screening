/**
 * EmailService - Servicio de envío de emails
 * Usa nodemailer y plantillas de cb_email_templates
 */

const nodemailer = require('nodemailer');
const emailTemplateRepository = require('../repositories/emailTemplateRepository');
const pdfService = require('./pdfService');
const fs = require('fs');
const path = require('path');

/**
 * Crear transporter de nodemailer
 * @returns {Object} Transporter configurado
 */
const crearTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  return nodemailer.createTransport(config);
};

/**
 * Obtener plantilla HTML desde archivo o base de datos
 * @param {string} codigo - Código de la plantilla
 * @returns {Promise<Object>} Plantilla con asunto y cuerpo
 */
const obtenerPlantilla = async (codigo) => {
  try {
    // 1. Intentar obtener de base de datos
    const plantillaBD = await emailTemplateRepository.obtenerPorCodigo(codigo);

    if (plantillaBD) {
      return {
        asunto: plantillaBD.asunto,
        cuerpo: plantillaBD.cuerpo,
        fuente: 'base_datos'
      };
    }

    // 2. Si no existe en BD, usar plantilla HTML de archivo
    const templatePath = path.join(__dirname, '../templates/emails', `${codigo}.html`);

    if (fs.existsSync(templatePath)) {
      const cuerpo = fs.readFileSync(templatePath, 'utf-8');

      // Asuntos por defecto según código
      const asuntosPorDefecto = {
        'invitacion': '¡Has sido invitado a una entrevista!',
        'aprobado': '¡Felicitaciones! Has aprobado la evaluación',
        'rechazado': 'Resultado de tu evaluación',
        'notificacion-reclutador': 'Nuevo candidato evaluado',
        'recordatorio': 'Recordatorio: Completa tu entrevista'
      };

      return {
        asunto: asuntosPorDefecto[codigo] || 'Notificación del sistema',
        cuerpo,
        fuente: 'archivo'
      };
    }

    throw new Error(`No se encontró plantilla para el código: ${codigo}`);

  } catch (error) {
    throw new Error(`Error al obtener plantilla: ${error.message}`);
  }
};

/**
 * Renderizar plantilla con variables
 * @param {string} template - Template con {{variables}}
 * @param {Object} variables - Variables a reemplazar
 * @returns {string} Template renderizado
 */
const renderizarPlantilla = (template, variables) => {
  let resultado = template;

  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    resultado = resultado.replace(regex, variables[key] || '');
  });

  return resultado;
};

/**
 * Enviar email genérico
 * @param {string} destinatario - Email del destinatario
 * @param {string} asunto - Asunto del email
 * @param {string} cuerpoHtml - Cuerpo HTML del email
 * @param {string} cuerpoTexto - Cuerpo texto plano (opcional)
 * @param {Array} attachments - Archivos adjuntos (opcional)
 * @returns {Promise<Object>} Información del envío
 */
const enviarEmail = async (destinatario, asunto, cuerpoHtml, cuerpoTexto = null, attachments = []) => {
  try {
    // Verificar configuración
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Configuración de email no encontrada. Email no enviado (modo desarrollo)');
      return {
        success: true,
        modo: 'desarrollo',
        mensaje: 'Email no enviado (configuración no disponible)',
        destinatario,
        asunto
      };
    }

    const transporter = crearTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'ChatBot 3IT'}" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      html: cuerpoHtml,
      text: cuerpoTexto || cuerpoHtml.replace(/<[^>]*>/g, ''), // Strip HTML si no hay texto
      attachments: attachments
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email enviado a ${destinatario}: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      destinatario,
      asunto
    };

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw new Error(`Error al enviar email: ${error.message}`);
  }
};

/**
 * Enviar invitación a candidato
 * @param {string} candidatoEmail - Email del candidato
 * @param {string} chatbotUrl - URL del chatbot
 * @param {Object} config - Configuración del chatbot
 * @param {Object} sesion - Datos de la sesión
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarInvitacion = async (candidatoEmail, chatbotUrl, config, sesion) => {
  try {
    console.log(`📧 Enviando invitación a ${candidatoEmail}`);

    const plantilla = await obtenerPlantilla('invitacion');

    const variables = {
      nombre_candidato: sesion.candidato_nombre || 'Candidato',
      nombre_chatbot: config.nombre,
      nombre_empresa: config.nombre_empresa || 'Nuestra empresa',
      chatbot_url: chatbotUrl,
      fecha_expiracion: new Date(sesion.fecha_expiracion).toLocaleDateString('es-ES'),
      duracion_dias: config.duracion_dias || 7,
      descripcion: config.descripcion || ''
    };

    const asunto = renderizarPlantilla(plantilla.asunto, variables);
    const cuerpo = renderizarPlantilla(plantilla.cuerpo, variables);

    return await enviarEmail(candidatoEmail, asunto, cuerpo);

  } catch (error) {
    console.error('Error al enviar invitación:', error);
    throw error;
  }
};

/**
 * Enviar notificación de aprobación
 * @param {string} candidatoEmail - Email del candidato
 * @param {Object} sesionData - Datos completos de la sesión
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarAprobado = async (candidatoEmail, sesionData) => {
  try {
    console.log(`📧 Enviando notificación de aprobación a ${candidatoEmail}`);

    const plantilla = await obtenerPlantilla('aprobado');

    const variables = {
      nombre_candidato: sesionData.candidato_nombre || 'Candidato',
      nombre_chatbot: sesionData.chatbot_nombre || 'Evaluación',
      nombre_empresa: sesionData.nombre_empresa || 'Nuestra empresa',
      puntaje: sesionData.porcentaje || 0,
      umbral: sesionData.umbral_aprobacion || 70,
      fecha_completado: new Date(sesionData.fecha_completado).toLocaleDateString('es-ES'),
      mensaje_personalizado: sesionData.mensaje_aprobado || '¡Felicitaciones por tu excelente desempeño!'
    };

    const asunto = renderizarPlantilla(plantilla.asunto, variables);
    const cuerpo = renderizarPlantilla(plantilla.cuerpo, variables);

    return await enviarEmail(candidatoEmail, asunto, cuerpo);

  } catch (error) {
    console.error('Error al enviar email de aprobación:', error);
    throw error;
  }
};

/**
 * Enviar notificación de rechazo
 * @param {string} candidatoEmail - Email del candidato
 * @param {Object} sesionData - Datos completos de la sesión
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarRechazado = async (candidatoEmail, sesionData) => {
  try {
    console.log(`📧 Enviando notificación de rechazo a ${candidatoEmail}`);

    const plantilla = await obtenerPlantilla('rechazado');

    const variables = {
      nombre_candidato: sesionData.candidato_nombre || 'Candidato',
      nombre_chatbot: sesionData.chatbot_nombre || 'Evaluación',
      nombre_empresa: sesionData.nombre_empresa || 'Nuestra empresa',
      puntaje: sesionData.porcentaje || 0,
      umbral: sesionData.umbral_aprobacion || 70,
      fecha_completado: new Date(sesionData.fecha_completado).toLocaleDateString('es-ES'),
      mensaje_personalizado: sesionData.mensaje_rechazado || 'Gracias por tu tiempo e interés en formar parte de nuestro equipo.'
    };

    const asunto = renderizarPlantilla(plantilla.asunto, variables);
    const cuerpo = renderizarPlantilla(plantilla.cuerpo, variables);

    return await enviarEmail(candidatoEmail, asunto, cuerpo);

  } catch (error) {
    console.error('Error al enviar email de rechazo:', error);
    throw error;
  }
};

/**
 * Notificar al reclutador sobre nueva evaluación completada
 * INCLUYE: Conversación completa + Evaluaciones desglosadas + PDF adjunto
 * @param {string} reclutadorEmail - Email del reclutador
 * @param {Object} sesionData - Datos completos de la sesión (con mensajes y evaluaciones)
 * @returns {Promise<Object>} Resultado del envío
 */
const notificarReclutador = async (reclutadorEmail, sesionData) => {
  try {
    console.log(`📧 Notificando a reclutador: ${reclutadorEmail}`);

    // 1. GENERAR PDF
    console.log('📄 Generando PDF del reporte...');
    const pdfBuffer = await pdfService.generarReporteCandidato(sesionData);

    // 2. CONSTRUIR EMAIL COMPLETO CON TODA LA INFORMACIÓN
    const colorResultado = sesionData.resultado === 'aprobado' ? '#28a745' : '#dc3545';
    const textoResultado = sesionData.resultado === 'aprobado' ? 'APROBADO ✅' : 'RECHAZADO ❌';

    const cuerpoHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evaluación Completada - ChatBot 3IT</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #1a73e8;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #1a73e8;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .info-label {
      font-weight: 600;
      color: #555555;
    }
    .info-value {
      color: #333333;
    }
    .resultado-badge {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      margin: 20px 0;
      color: #ffffff;
      background-color: ${colorResultado};
    }
    .mensaje {
      background-color: #f8f9fa;
      border-left: 4px solid #dee2e6;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .mensaje.sistema {
      border-left-color: #6c757d;
    }
    .mensaje.pregunta {
      border-left-color: #1a73e8;
      background-color: #e3f2fd;
    }
    .mensaje.respuesta {
      border-left-color: #28a745;
      background-color: #f1f8f4;
    }
    .mensaje-header {
      font-size: 12px;
      color: #666666;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .mensaje-contenido {
      color: #333333;
      font-size: 14px;
      line-height: 1.5;
    }
    .evaluacion-item {
      background-color: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .evaluacion-pregunta {
      font-weight: 600;
      color: #1a73e8;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .evaluacion-respuesta {
      color: #555555;
      margin-bottom: 10px;
      font-size: 14px;
      font-style: italic;
    }
    .evaluacion-resultado {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #dee2e6;
    }
    .evaluacion-campo {
      font-size: 13px;
    }
    .evaluacion-campo strong {
      color: #555555;
    }
    .correcta {
      color: #28a745;
      font-weight: 700;
    }
    .incorrecta {
      color: #dc3545;
      font-weight: 700;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #666666;
      font-size: 13px;
    }
    .adjunto-info {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
    }
    .adjunto-info strong {
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <h1>ChatBot 3IT</h1>
      <p>Nueva Evaluación Completada</p>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- INFORMACIÓN DEL CANDIDATO -->
      <div class="section">
        <div class="section-title">📋 Información del Candidato</div>
        <div class="info-grid">
          <div class="info-label">Nombre:</div>
          <div class="info-value">${sesionData.candidato_nombre || 'No especificado'}</div>

          <div class="info-label">Email:</div>
          <div class="info-value">${sesionData.candidato_email || 'No especificado'}</div>

          <div class="info-label">Teléfono:</div>
          <div class="info-value">${sesionData.candidato_telefono || 'No especificado'}</div>

          <div class="info-label">Fecha de evaluación:</div>
          <div class="info-value">${new Date(sesionData.fecha_fin || sesionData.fecha_completado).toLocaleString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</div>

          <div class="info-label">Chatbot:</div>
          <div class="info-value">${sesionData.chatbot_nombre || 'Evaluación'}</div>
        </div>
      </div>

      <!-- RESULTADO -->
      <div class="section">
        <div class="section-title">🎯 Resultado de la Evaluación</div>
        <div style="text-align: center;">
          <div class="resultado-badge">${textoResultado}</div>
        </div>
        <div class="info-grid">
          <div class="info-label">Puntaje obtenido:</div>
          <div class="info-value"><strong>${sesionData.puntaje_total || 0} / ${sesionData.puntaje_maximo || 100}</strong></div>

          <div class="info-label">Porcentaje:</div>
          <div class="info-value"><strong>${sesionData.porcentaje_aprobacion || 0}%</strong></div>

          <div class="info-label">Umbral requerido:</div>
          <div class="info-value">${sesionData.umbral_aprobacion || 70}%</div>
        </div>
      </div>

      <!-- CONVERSACIÓN COMPLETA -->
      <div class="section">
        <div class="section-title">💬 Conversación Completa</div>
        ${generarHtmlConversacion(sesionData.mensajes)}
      </div>

      <!-- EVALUACIONES DESGLOSADAS -->
      <div class="section">
        <div class="section-title">📊 Evaluaciones Desglosadas</div>
        ${generarHtmlEvaluaciones(sesionData.evaluaciones)}
      </div>

      <!-- PDF ADJUNTO -->
      <div class="adjunto-info">
        <strong>📎 PDF Adjunto:</strong> Se ha adjuntado un reporte completo en formato PDF con toda la información de la evaluación.
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Este es un correo automático generado por <strong>ChatBot 3IT</strong></p>
      <p>Fecha de envío: ${new Date().toLocaleString('es-ES')}</p>
    </div>

  </div>
</body>
</html>
    `;

    // 3. ADJUNTAR PDF
    const attachments = [
      {
        filename: `evaluacion_${sesionData.candidato_nombre?.replace(/\s+/g, '_') || sesionData.token}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ];

    // 4. ENVIAR EMAIL
    const asunto = `[ChatBot 3IT] Nueva Evaluación Completada - ${sesionData.candidato_nombre || 'Candidato'} (${textoResultado})`;

    return await enviarEmail(reclutadorEmail, asunto, cuerpoHtml, null, attachments);

  } catch (error) {
    console.error('Error al notificar a reclutador:', error);
    throw error;
  }
};

/**
 * Generar HTML de la conversación completa
 */
function generarHtmlConversacion(mensajes) {
  if (!mensajes || mensajes.length === 0) {
    return '<p style="color: #999; font-style: italic;">No hay mensajes registrados.</p>';
  }

  let html = '';

  mensajes.forEach((mensaje) => {
    const tipo = mensaje.tipo_mensaje;
    const hora = new Date(mensaje.fecha_creacion).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const etiquetas = {
      'sistema': 'Sistema',
      'pregunta': 'Pregunta',
      'respuesta': 'Respuesta del candidato'
    };

    html += `
      <div class="mensaje ${tipo}">
        <div class="mensaje-header">[${hora}] ${etiquetas[tipo] || tipo}</div>
        <div class="mensaje-contenido">${mensaje.contenido || ''}</div>
        ${mensaje.evaluacion && tipo === 'respuesta' ? `
          <div style="margin-top: 10px; font-size: 12px; color: #666;">
            → Evaluación: <span class="${mensaje.evaluacion.es_correcta ? 'correcta' : 'incorrecta'}">
              ${mensaje.evaluacion.es_correcta ? '✓ Correcta' : '✗ Incorrecta'}
            </span> | Puntaje: ${mensaje.evaluacion.puntaje || 0}/100
          </div>
        ` : ''}
      </div>
    `;
  });

  return html;
}

/**
 * Generar HTML de las evaluaciones desglosadas
 */
function generarHtmlEvaluaciones(evaluaciones) {
  if (!evaluaciones || evaluaciones.length === 0) {
    return '<p style="color: #999; font-style: italic;">No hay evaluaciones registradas.</p>';
  }

  let html = '';

  evaluaciones.forEach((evaluacion, index) => {
    const esCorrecta = evaluacion.es_correcta;

    html += `
      <div class="evaluacion-item">
        <div class="evaluacion-pregunta">Pregunta ${index + 1}: ${evaluacion.pregunta_texto || 'N/A'}</div>
        <div class="evaluacion-respuesta">"${evaluacion.respuesta_texto || 'N/A'}"</div>

        <div class="evaluacion-resultado">
          <div class="evaluacion-campo">
            <strong>Resultado:</strong> <span class="${esCorrecta ? 'correcta' : 'incorrecta'}">
              ${esCorrecta ? '✓ Correcta' : '✗ Incorrecta'}
            </span>
          </div>
          <div class="evaluacion-campo">
            <strong>Puntaje:</strong> ${evaluacion.puntaje || 0}/100
          </div>
          <div class="evaluacion-campo">
            <strong>Peso:</strong> ${evaluacion.peso || 1}
          </div>
          <div class="evaluacion-campo">
            <strong>Método:</strong> ${evaluacion.metodo_evaluacion || 'N/A'}
          </div>
        </div>

        ${evaluacion.retroalimentacion ? `
          <div style="margin-top: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; font-size: 13px;">
            <strong>Retroalimentación:</strong> ${evaluacion.retroalimentacion}
          </div>
        ` : ''}
      </div>
    `;
  });

  return html;
}

/**
 * Enviar recordatorio de evaluación pendiente
 * @param {string} candidatoEmail - Email del candidato
 * @param {string} chatbotUrl - URL del chatbot
 * @param {number} horasRestantes - Horas restantes antes de expiración
 * @param {Object} sesion - Datos de la sesión
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarRecordatorio = async (candidatoEmail, chatbotUrl, horasRestantes, sesion) => {
  try {
    console.log(`📧 Enviando recordatorio a ${candidatoEmail}`);

    const plantilla = await obtenerPlantilla('recordatorio');

    const variables = {
      nombre_candidato: sesion.candidato_nombre || 'Candidato',
      nombre_chatbot: sesion.chatbot_nombre || 'Evaluación',
      chatbot_url: chatbotUrl,
      horas_restantes: horasRestantes,
      fecha_expiracion: new Date(sesion.fecha_expiracion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const asunto = renderizarPlantilla(plantilla.asunto, variables);
    const cuerpo = renderizarPlantilla(plantilla.cuerpo, variables);

    return await enviarEmail(candidatoEmail, asunto, cuerpo);

  } catch (error) {
    console.error('Error al enviar recordatorio:', error);
    throw error;
  }
};

/**
 * Verificar configuración de email
 * @returns {Object} Estado de la configuración
 */
const verificarConfiguracion = () => {
  const config = {
    configurado: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    host: process.env.EMAIL_HOST || 'No configurado',
    port: process.env.EMAIL_PORT || 'No configurado',
    user: process.env.EMAIL_USER || 'No configurado',
    fromName: process.env.EMAIL_FROM_NAME || 'No configurado'
  };

  return config;
};

/**
 * Enviar email de prueba
 * @param {string} destinatario - Email de destino
 * @returns {Promise<Object>} Resultado del envío
 */
const enviarEmailPrueba = async (destinatario) => {
  try {
    const asunto = 'Email de prueba - Sistema de Screening';
    const cuerpo = `
      <h1>Email de Prueba</h1>
      <p>Este es un email de prueba del sistema de screening.</p>
      <p>Si recibes este mensaje, la configuración de email está funcionando correctamente.</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
    `;

    return await enviarEmail(destinatario, asunto, cuerpo);

  } catch (error) {
    throw error;
  }
};

module.exports = {
  enviarEmail,
  enviarInvitacion,
  enviarAprobado,
  enviarRechazado,
  notificarReclutador,
  enviarRecordatorio,
  verificarConfiguracion,
  enviarEmailPrueba
};
