/**
 * pdfService.js
 * Servicio para generar reportes PDF de evaluaciones de candidatos
 * Sistema: ChatBot 3IT
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Genera un reporte PDF completo de la evaluación del candidato
 * @param {Object} sesionData - Datos completos de la sesión (con mensajes y evaluaciones)
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
async function generarReporteCandidato(sesionData) {
  return new Promise((resolve, reject) => {
    try {
      // Crear documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Buffer para almacenar el PDF
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ==================== ENCABEZADO ====================
      doc.fontSize(24)
         .fillColor('#1a73e8')
         .text('ChatBot 3IT', { align: 'center' });

      doc.fontSize(16)
         .fillColor('#333333')
         .text('Reporte de Evaluación de Candidato', { align: 'center' });

      doc.moveDown(1);
      doc.strokeColor('#1a73e8')
         .lineWidth(2)
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke();

      doc.moveDown(2);

      // ==================== INFORMACIÓN DEL CANDIDATO ====================
      doc.fontSize(14)
         .fillColor('#1a73e8')
         .text('INFORMACIÓN DEL CANDIDATO', { underline: true });

      doc.moveDown(0.5);
      doc.fontSize(11)
         .fillColor('#333333');

      agregarCampo(doc, 'Nombre', sesionData.candidato_nombre || 'No especificado');
      agregarCampo(doc, 'Email', sesionData.candidato_email || 'No especificado');
      agregarCampo(doc, 'Teléfono', sesionData.candidato_telefono || 'No especificado');
      agregarCampo(doc, 'Fecha de evaluación', formatearFecha(sesionData.fecha_fin));
      agregarCampo(doc, 'Token de sesión', sesionData.token);

      doc.moveDown(1.5);

      // ==================== RESULTADO DE LA EVALUACIÓN ====================
      doc.fontSize(14)
         .fillColor('#1a73e8')
         .text('RESULTADO DE LA EVALUACIÓN', { underline: true });

      doc.moveDown(0.5);

      // Color según resultado
      const colorResultado = sesionData.resultado === 'aprobado' ? '#28a745' : '#dc3545';
      const textoResultado = sesionData.resultado === 'aprobado' ? 'APROBADO' : 'RECHAZADO';

      doc.fontSize(18)
         .fillColor(colorResultado)
         .text(textoResultado, { align: 'center' });

      doc.moveDown(0.5);

      doc.fontSize(11)
         .fillColor('#333333');

      agregarCampo(doc, 'Puntaje obtenido', `${sesionData.puntaje_total || 0} / ${sesionData.puntaje_maximo || 100}`);
      agregarCampo(doc, 'Porcentaje', `${sesionData.porcentaje_aprobacion || 0}%`);
      agregarCampo(doc, 'Umbral de aprobación', `${sesionData.umbral_aprobacion || 70}%`);

      doc.moveDown(1.5);

      // ==================== CONVERSACIÓN COMPLETA ====================
      doc.fontSize(14)
         .fillColor('#1a73e8')
         .text('CONVERSACIÓN COMPLETA', { underline: true });

      doc.moveDown(0.5);

      if (sesionData.mensajes && sesionData.mensajes.length > 0) {
        sesionData.mensajes.forEach((mensaje, index) => {
          // Verificar si necesitamos nueva página
          if (doc.y > 700) {
            doc.addPage();
          }

          const tipo = mensaje.tipo_mensaje;
          const hora = formatearHora(mensaje.fecha_creacion);

          // Encabezado del mensaje
          doc.fontSize(10)
             .fillColor('#666666')
             .text(`[${hora}] ${obtenerEtiquetaTipo(tipo)}`, { continued: false });

          // Contenido del mensaje
          doc.fontSize(11)
             .fillColor('#333333')
             .text(mensaje.contenido, {
               indent: 20,
               width: 475,
               align: 'left'
             });

          // Si es una respuesta, mostrar evaluación
          if (tipo === 'respuesta' && mensaje.evaluacion) {
            doc.moveDown(0.3);
            doc.fontSize(9)
               .fillColor('#666666')
               .text(`   → Evaluación: ${mensaje.evaluacion.es_correcta ? '✓ Correcta' : '✗ Incorrecta'} | Puntaje: ${mensaje.evaluacion.puntaje}/100`, {
                 indent: 20
               });
          }

          doc.moveDown(0.7);
        });
      } else {
        doc.fontSize(11)
           .fillColor('#666666')
           .text('No hay mensajes registrados.', { italic: true });
      }

      doc.moveDown(1.5);

      // ==================== EVALUACIONES DESGLOSADAS ====================
      doc.addPage();

      doc.fontSize(14)
         .fillColor('#1a73e8')
         .text('EVALUACIONES DESGLOSADAS', { underline: true });

      doc.moveDown(0.5);

      if (sesionData.evaluaciones && sesionData.evaluaciones.length > 0) {
        sesionData.evaluaciones.forEach((evaluacion, index) => {
          // Verificar si necesitamos nueva página
          if (doc.y > 650) {
            doc.addPage();
          }

          // Encabezado de la evaluación
          doc.fontSize(12)
             .fillColor('#1a73e8')
             .text(`Pregunta ${index + 1}`, { underline: true });

          doc.moveDown(0.3);

          // Pregunta
          doc.fontSize(11)
             .fillColor('#333333')
             .text('Pregunta:', { continued: true })
             .fillColor('#666666')
             .text(` ${evaluacion.pregunta_texto || 'N/A'}`);

          // Respuesta
          doc.fillColor('#333333')
             .text('Respuesta:', { continued: true })
             .fillColor('#666666')
             .text(` ${evaluacion.respuesta_texto || 'N/A'}`);

          doc.moveDown(0.5);

          // Resultado
          const colorEval = evaluacion.es_correcta ? '#28a745' : '#dc3545';
          const textoEval = evaluacion.es_correcta ? '✓ Correcta' : '✗ Incorrecta';

          doc.fontSize(10)
             .fillColor('#333333')
             .text('Resultado:', { continued: true })
             .fillColor(colorEval)
             .text(` ${textoEval}`);

          // Puntaje
          doc.fillColor('#333333')
             .text('Puntaje:', { continued: true })
             .fillColor('#666666')
             .text(` ${evaluacion.puntaje}/100`);

          // Peso
          doc.fillColor('#333333')
             .text('Peso:', { continued: true })
             .fillColor('#666666')
             .text(` ${evaluacion.peso || 1}`);

          // Método de evaluación
          doc.fillColor('#333333')
             .text('Método:', { continued: true })
             .fillColor('#666666')
             .text(` ${evaluacion.metodo_evaluacion || 'N/A'}`);

          // Retroalimentación
          if (evaluacion.retroalimentacion) {
            doc.fillColor('#333333')
               .text('Retroalimentación:', { continued: true })
               .fillColor('#666666')
               .text(` ${evaluacion.retroalimentacion}`);
          }

          // Detalles de evaluación (si existen)
          if (evaluacion.detalle_evaluacion && typeof evaluacion.detalle_evaluacion === 'object') {
            doc.moveDown(0.3);
            doc.fontSize(9)
               .fillColor('#666666')
               .text('Detalles:', { underline: true });

            Object.entries(evaluacion.detalle_evaluacion).forEach(([key, value]) => {
              doc.text(`  • ${key}: ${JSON.stringify(value)}`);
            });
          }

          doc.moveDown(1);

          // Línea separadora
          doc.strokeColor('#cccccc')
             .lineWidth(0.5)
             .moveTo(50, doc.y)
             .lineTo(545, doc.y)
             .stroke();

          doc.moveDown(1);
        });
      } else {
        doc.fontSize(11)
           .fillColor('#666666')
           .text('No hay evaluaciones registradas.', { italic: true });
      }

      // ==================== PIE DE PÁGINA ====================
      doc.fontSize(8)
         .fillColor('#999999')
         .text(
           `Reporte generado por ChatBot 3IT | Fecha: ${formatearFecha(new Date())}`,
           50,
           750,
           { align: 'center', width: 495 }
         );

      // Finalizar documento
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Guarda el PDF en el sistema de archivos
 * @param {Buffer} pdfBuffer - Buffer del PDF
 * @param {String} nombreArchivo - Nombre del archivo (sin extensión)
 * @returns {Promise<String>} - Ruta del archivo guardado
 */
async function guardarPDF(pdfBuffer, nombreArchivo) {
  const dirReportes = path.join(__dirname, '../../../reportes');

  // Crear directorio si no existe
  if (!fs.existsSync(dirReportes)) {
    fs.mkdirSync(dirReportes, { recursive: true });
  }

  const rutaArchivo = path.join(dirReportes, `${nombreArchivo}.pdf`);

  return new Promise((resolve, reject) => {
    fs.writeFile(rutaArchivo, pdfBuffer, (err) => {
      if (err) reject(err);
      else resolve(rutaArchivo);
    });
  });
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Agrega un campo de información al PDF
 */
function agregarCampo(doc, etiqueta, valor) {
  doc.fontSize(11)
     .fillColor('#333333')
     .text(etiqueta + ':', { continued: true })
     .fillColor('#666666')
     .text(' ' + valor);
}

/**
 * Formatea una fecha a formato legible
 */
function formatearFecha(fecha) {
  if (!fecha) return 'N/A';
  const f = new Date(fecha);
  return f.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea solo la hora
 */
function formatearHora(fecha) {
  if (!fecha) return 'N/A';
  const f = new Date(fecha);
  return f.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Obtiene etiqueta legible del tipo de mensaje
 */
function obtenerEtiquetaTipo(tipo) {
  const tipos = {
    'sistema': 'Sistema',
    'pregunta': 'Pregunta',
    'respuesta': 'Respuesta del candidato'
  };
  return tipos[tipo] || tipo;
}

module.exports = {
  generarReporteCandidato,
  guardarPDF
};
