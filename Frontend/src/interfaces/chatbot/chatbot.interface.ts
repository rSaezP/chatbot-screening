// ========== TIPOS BÁSICOS ==========

export type TipoCampo =
  | 'texto'
  | 'texto_largo'
  | 'numero'
  | 'email'
  | 'telefono'
  | 'url'
  | 'fecha'
  | 'si_no'
  | 'opcion_multiple'
  | 'opcion_unica'

export type TipoRegla =
  | 'rango'
  | 'keywords'
  | 'igual'
  | 'opcion'
  | ''

// ========== INTERFACES ==========

export interface SMTPConfig {
  host: string
  port: number
  user: string
  pass: string
  from_name: string
}

export interface ReglaPregunta {
  tipo: TipoRegla
  // Para número
  min?: number | null
  max?: number | null
  // Para texto
  keywords?: string[]
  minimo?: number
  longitud_minima?: number | null
  longitud_maxima?: number | null
  // Para sí/no
  respuesta_correcta?: 'si' | 'no'
  // Para opción única
  opciones?: string[]
  opciones_correctas?: string[]
}

export interface Chatbot {
  id?: number
  // Paso 1: Asistente
  nombre_asistente: string
  avatar_url?: string
  color_botones: string
  color_conversacion: string
  color_fondo: string
  // Paso 2: Evaluación
  nombre: string
  descripcion?: string
  categoria?: string
  duracion_dias: number
  umbral_aprobacion: number
  // Paso 3: Mensajes
  mensaje_bienvenida: string
  mensaje_finalizacion: string
  // Paso 4: Email
  email_reclutador: string
  smtp_config?: SMTPConfig
  // Paso 5: Preguntas
  preguntas: Pregunta[]
  // Metadata
  activo?: boolean
  fecha_creacion?: string
  fecha_actualizacion?: string
}

// Import necesario para preguntas
import type { Pregunta } from './pregunta.interface'
