import type { Chatbot, Pregunta, SMTPConfig, ReglaPregunta } from '@/interfaces'

// Valores iniciales para un nuevo chatbot
export const initialChatbot: Chatbot = {
  // Paso 1: Asistente
  nombre_asistente: '',
  avatar_url: '',
  color_botones: '#2E73EA',
  color_conversacion: '#FFFFFF',
  color_fondo: '#F5F5F5',
  // Paso 2: Evaluación
  nombre: '',
  descripcion: '',
  categoria: '',
  duracion_dias: 7,
  umbral_aprobacion: 70,
  // Paso 3: Mensajes
  mensaje_bienvenida: '',
  mensaje_finalizacion: '',
  // Paso 4: Email
  email_reclutador: '',
  smtp_config: {
    host: '',
    port: 587,
    user: '',
    pass: '',
    from_name: ''
  },
  // Paso 5: Preguntas
  preguntas: [],
  // Metadata
  activo: true
}

// Valores iniciales para una nueva pregunta
export const initialPregunta: Pregunta = {
  pregunta: '',
  tipo_campo: 'texto_corto',
  metodo_evaluacion: 'regla_fija',
  regla: {
    tipo: ''
  },
  peso: 1,
  es_eliminatoria: false,
  requerida: true,
  orden: 0,
  activo: true
}

// Valores iniciales para configuración SMTP
export const initialSMTPConfig: SMTPConfig = {
  host: '',
  port: 587,
  user: '',
  pass: '',
  from_name: ''
}

// Valores iniciales para una regla de pregunta
export const initialReglaPregunta: ReglaPregunta = {
  tipo: ''
}
