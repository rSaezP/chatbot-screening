import type { SelectOption } from 'uikit-3it-vue'

export const tiposRespuesta: SelectOption[] = [
  { id: 'texto', label: 'Texto' },
  { id: 'texto_largo', label: 'Texto Largo' },
  { id: 'numero', label: 'Número' },
  { id: 'email', label: 'Email' },
  { id: 'telefono', label: 'Teléfono' },
  { id: 'url', label: 'URL' },
  { id: 'fecha', label: 'Fecha' },
  { id: 'si_no', label: 'Sí/No' },
  { id: 'opcion_multiple', label: 'Opción Múltiple' },
  { id: 'opcion_unica', label: 'Opción Única' }
]

export const categorias: SelectOption[] = [
  { id: 'tecnologia', label: 'Tecnología' },
  { id: 'ventas', label: 'Ventas' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'finanzas', label: 'Finanzas' },
  { id: 'rrhh', label: 'Recursos Humanos' },
  { id: 'otro', label: 'Otro' }
]

export const estadosSesion: SelectOption[] = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'en_progreso', label: 'En Progreso' },
  { id: 'completado', label: 'Completado' },
  { id: 'expirado', label: 'Expirado' }
]

export const resultadosSesion: SelectOption[] = [
  { id: 'sin_evaluar', label: 'Sin Evaluar' },
  { id: 'aprobado', label: 'Aprobado' },
  { id: 'rechazado', label: 'Rechazado' }
]
