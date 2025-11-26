import type { TipoCampo, ReglaPregunta } from './chatbot.interface'

export interface Pregunta {
  id?: number
  config_id?: number
  pregunta: string
  descripcion?: string
  media_url?: string
  tipo_campo: TipoCampo
  opciones?: string[] | null
  requerida: boolean
  min_longitud?: number | null
  max_longitud?: number | null
  patron_validacion?: string | null
  metodo_evaluacion: 'regla_fija' | 'ia_opcional' | 'manual'
  regla?: ReglaPregunta | null
  usar_ia?: boolean
  prompt_ia?: string | null
  criterios_ia?: Record<string, any> | null
  es_eliminatoria: boolean
  peso: number
  orden: number
  activo?: boolean
  created_at?: string
  updated_at?: string
}
