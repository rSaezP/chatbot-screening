// ========== TIPOS ==========

export type EstadoSesion =
  | 'pendiente'
  | 'en_progreso'
  | 'completado'
  | 'expirado'

export type ResultadoSesion =
  | 'sin_evaluar'
  | 'aprobado'
  | 'rechazado'

export type TipoMensaje =
  | 'sistema'
  | 'pregunta'
  | 'respuesta'

// ========== INTERFACES ==========

export interface Sesion {
  id?: number
  token: string
  config_id: number
  candidato_nombre: string
  candidato_email: string
  candidato_telefono?: string
  candidato_notas?: string
  estado: EstadoSesion
  resultado?: ResultadoSesion
  porcentaje?: number
  puntaje_obtenido?: number
  puntaje_total?: number
  fecha_creacion: string
  fecha_inicio?: string
  fecha_completado?: string
  fecha_expiracion: string
  chatbot_nombre?: string
  chatbot_descripcion?: string
}

export interface Mensaje {
  id?: number
  sesion_id: number
  pregunta_id?: number
  tipo: TipoMensaje
  contenido: string
  respuesta?: string
  es_correcta?: boolean
  puntaje_obtenido?: number
  metadata?: any
  fecha_creacion: string
}

export interface Progreso {
  total_preguntas: number
  preguntas_respondidas: number
  preguntas_pendientes: number
  porcentaje_completado: number
}

export interface Candidato {
  nombre: string
  email: string
  telefono?: string
  notas?: string
}
