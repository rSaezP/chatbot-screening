<template>
  <DialogComponent
    ref="dialogRef"
    class="eit-dialog--top eit-dialog--large"
  >
    <template #head>
      <h2 data-eit-font-size="x5" data-eit-my="0">
        {{ isEditing ? 'Editar Pregunta' : 'Nueva Pregunta' }}
      </h2>
    </template>

    <template #content>
      <!-- Texto de la pregunta -->
      <div data-eit-mb="4">
        <InputComponent
          inputType="textarea"
          floatLabel="Texto de la pregunta *"
          :input="form.pregunta"
          maxLength="500"
          @emitValue="form.pregunta = $event"
        />
      </div>

      <!-- Tipo de campo -->
      <div data-eit-mb="4">
        <label data-eit-display="block" data-eit-mb="2" data-eit-font-weight="500">
          Tipo de respuesta *
        </label>
        <v-select
          v-model="selectedTipo"
          :options="tiposRespuesta"
          label="label"
          placeholder="Selecciona tipo de respuesta"
          :reduce="(option: any) => option"
          @update:modelValue="handleTipoChange"
        />
      </div>

      <!-- Configuración según tipo -->
      <div v-if="form.tipo_campo" data-eit-mb="4">

        <!-- NÚMERO: Min y Max -->
        <div v-if="form.tipo_campo === 'numero'" data-eit-display="flex" data-eit-gap="3">
          <div data-eit-flex="fill">
            <InputComponent
              inputType="number"
              floatLabel="Mínimo (opcional)"
              :input="String(form.regla.min || '')"
              maxLength="10"
              @emitValue="form.regla.min = $event ? Number($event) : null"
            />
          </div>
          <div data-eit-flex="fill">
            <InputComponent
              inputType="number"
              floatLabel="Máximo (opcional)"
              :input="String(form.regla.max || '')"
              maxLength="10"
              @emitValue="form.regla.max = $event ? Number($event) : null"
            />
          </div>
        </div>

        <!-- TEXTO: Keywords -->
        <div v-if="form.tipo_campo === 'texto' || form.tipo_campo === 'texto_largo'">
          <InputComponent
            inputType="textarea"
            floatLabel="Palabras clave (separadas por comas)"
            :input="keywordsRaw"
            maxLength="300"
            @emitValue="keywordsRaw = $event"
          />
          <p data-eit-font-size="x1" data-eit-color="text-soft" data-eit-mt="2">
            Ejemplo: javascript, react, node
          </p>
          <div data-eit-mt="3">
            <InputComponent
              inputType="number"
              floatLabel="Cantidad mínima de keywords a encontrar"
              :input="String(form.regla.minimo)"
              maxLength="3"
              @emitValue="form.regla.minimo = Number($event)"
            />
          </div>
        </div>

        <!-- SÍ/NO: Respuesta correcta -->
        <div v-if="form.tipo_campo === 'si_no'">
          <label data-eit-display="block" data-eit-mb="2" data-eit-font-weight="500">
            Respuesta correcta
          </label>
          <v-select
            v-model="selectedRespuestaCorrecta"
            :options="opcionesSiNo"
            label="label"
            placeholder="Selecciona respuesta correcta"
            :reduce="(option: any) => option"
          />
        </div>

        <!-- OPCIÓN ÚNICA: Opciones -->
        <div v-if="form.tipo_campo === 'opcion_unica'">
          <InputComponent
            inputType="textarea"
            floatLabel="Opciones (una por línea)"
            :input="opcionesRaw"
            maxLength="500"
            @emitValue="opcionesRaw = $event"
          />
          <p data-eit-font-size="x1" data-eit-color="text-soft" data-eit-mt="2">
            Una opción por línea. Ejemplo:<br>
            Inmediata<br>
            1 mes<br>
            2 meses
          </p>
          <div data-eit-mt="3">
            <InputComponent
              inputType="textarea"
              floatLabel="Opciones correctas (una por línea)"
              :input="opcionesCorrectasRaw"
              maxLength="300"
              @emitValue="opcionesCorrectasRaw = $event"
            />
          </div>
        </div>
      </div>

      <!-- Peso -->
      <div data-eit-mb="4">
        <InputComponent
          inputType="number"
          floatLabel="Peso (puntos) *"
          :input="String(form.peso)"
          maxLength="3"
          @emitValue="form.peso = Number($event)"
        />
        <p data-eit-font-size="x1" data-eit-color="text-soft" data-eit-mt="2">
          Importancia de la pregunta en la evaluación (1-100)
        </p>
      </div>

      <!-- Checkboxes -->
      <div data-eit-display="flex" data-eit-flex-direction="column" data-eit-gap="3">
        <label data-eit-display="flex" data-eit-align="center" data-eit-gap="2">
          <input type="checkbox" v-model="form.es_eliminatoria" />
          <span>Pregunta eliminatoria (rechaza automáticamente si falla)</span>
        </label>
        <label data-eit-display="flex" data-eit-align="center" data-eit-gap="2">
          <input type="checkbox" v-model="form.requerida" />
          <span>Pregunta requerida</span>
        </label>
      </div>
      
      <!-- Botones en el contenido -->
      <div data-eit-display="flex" data-eit-justify="end" data-eit-gap="3" data-eit-mt="4">
        <ButtonComponent
          data-eit-variant="blue"
          data-eit-outline
          text="Cancelar"
          @emitEvent="$emit('cancel')"
        />
        <ButtonComponent
          data-eit-variant="blue"
          text="Guardar"
          @emitEvent="guardar"
        />
      </div>
    </template>
  </DialogComponent>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Pregunta } from '@/interfaces'
import type { SelectOption } from 'uikit-3it-vue'
import { tiposRespuesta } from '@/constants'

// UIKit Components are globally registered, no need to import

interface Props {
  isOpen: boolean
  pregunta?: Pregunta | null
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pregunta: null,
  isEditing: false
})

const emit = defineEmits<{
  save: [pregunta: Pregunta]
  cancel: []
}>()

// Ref del dialog
type DialogExpose = {
  showDialog: () => void
  closeDialog: () => void
}

const dialogRef = ref<DialogExpose | null>(null)

// Watch para abrir/cerrar el dialog
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => dialogRef.value?.showDialog(), 100)
  }
}, { flush: 'post' })

const form = ref<Pregunta>({
  pregunta: '',
  tipo_campo: '' as any,
  metodo_evaluacion: 'regla_fija',
  regla: {
    tipo: '',
    min: null,
    max: null,
    keywords: [],
    minimo: 1,
    longitud_minima: null,
    longitud_maxima: null,
    respuesta_correcta: 'si',
    opciones: [],
    opciones_correctas: []
  },
  peso: 25,
  es_eliminatoria: false,
  requerida: true,
  orden: 1
})

const selectedTipo = ref<SelectOption | null>(null)
const selectedRespuestaCorrecta = ref<SelectOption | null>(null)
const keywordsRaw = ref('')
const opcionesRaw = ref('')
const opcionesCorrectasRaw = ref('')

const opcionesSiNo: SelectOption[] = [
  { id: 'si', label: 'Sí' },
  { id: 'no', label: 'No' }
]

// Cargar datos si estamos editando
watch(() => props.pregunta, (nueva) => {
  if (nueva) {
    form.value = { ...nueva }
    selectedTipo.value = tiposRespuesta.find(t => String(t.id) === nueva.tipo_campo) || null

    if (nueva.regla) {
      keywordsRaw.value = nueva.regla.keywords?.join(', ') || ''
      opcionesRaw.value = nueva.regla.opciones?.join('\n') || ''
      opcionesCorrectasRaw.value = nueva.regla.opciones_correctas?.join('\n') || ''
      selectedRespuestaCorrecta.value = opcionesSiNo.find(o => String(o.id) === nueva.regla.respuesta_correcta) || null
    }
  }
}, { immediate: true })

function handleTipoChange(option: SelectOption | null) {
  if (option) {
    form.value.tipo_campo = String(option.id) as any

    // Configurar tipo de regla según el tipo de campo
    switch (String(option.id)) {
      case 'numero':
        form.value.regla.tipo = 'rango'
        break
      case 'texto':
      case 'texto_largo':
        form.value.regla.tipo = 'keywords'
        break
      case 'si_no':
        form.value.regla.tipo = 'igual'
        break
      case 'opcion_unica':
      case 'opcion_multiple':
        form.value.regla.tipo = 'opcion'
        break
      default:
        form.value.regla.tipo = ''
    }
  }
}

function guardar() {
  // Procesar keywords
  if (keywordsRaw.value) {
    form.value.regla.keywords = keywordsRaw.value
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
  }

  // Procesar opciones
  if (opcionesRaw.value) {
    form.value.regla.opciones = opcionesRaw.value
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0)
  }

  if (opcionesCorrectasRaw.value) {
    form.value.regla.opciones_correctas = opcionesCorrectasRaw.value
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0)
  }

  // Procesar respuesta correcta
  if (selectedRespuestaCorrecta.value) {
    form.value.regla.respuesta_correcta = String(selectedRespuestaCorrecta.value.id) as 'si' | 'no'
  }

  emit('save', { ...form.value })
  dialogRef.value?.closeDialog()
}
</script>
