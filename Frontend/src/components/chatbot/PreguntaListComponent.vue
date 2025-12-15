<template>
  <div>
    <!-- Estado vacío -->
    <div
      v-if="!preguntas || preguntas.length === 0"
      data-eit-border="all"
      data-eit-border-color="default"
      data-eit-border-radius="x3"
      data-eit-p="4"
      data-eit-text-align="center"
    >
      <AlertComponent
        data-eit-variant="light"
        icon="fa-solid fa-clipboard-question"
        message="No hay preguntas. Haz click en <strong>Agregar Pregunta</strong>"
      />
    </div>

    <!-- Lista de preguntas -->
    <div v-else data-eit-display="flex" data-eit-flex-direction="column" data-eit-gap="3">
      <div
        v-for="(pregunta, index) in preguntas"
        :key="index"
        data-eit-border="all"
        data-eit-border-color="default"
        data-eit-border-radius="x3"
        data-eit-p="4"
        data-eit-display="flex"
        data-eit-align="center"
        data-eit-gap="4"
      >
        <!-- Número de pregunta -->
        <div
          data-eit-font-weight="900"
          data-eit-font-size="x4"
          data-eit-color="secondary"
          style="min-width: 40px; text-align: center;"
        >
          {{ index + 1 }}
        </div>

        <!-- Contenido -->
        <div data-eit-flex="fill">
          <div data-eit-mb="2" data-eit-color="text" data-eit-font-weight="500">
            {{ pregunta.pregunta }}
          </div>
          <div data-eit-display="flex" data-eit-gap="2" data-eit-flex-wrap="wrap">
            <BadgeComponent
              :text="getTipoTexto(pregunta.tipo_campo)"
              data-eit-variant="blue"
              data-eit-outline
            />
            <BadgeComponent
              :text="`${pregunta.peso} pts`"
              data-eit-variant="secondary"
            />
            <BadgeComponent
              v-if="pregunta.es_eliminatoria"
              text="⚠️ Eliminatoria"
              data-eit-variant="red"
            />
            <BadgeComponent
              v-if="pregunta.requerida"
              text="* Requerida"
              data-eit-variant="yellow"
            />
          </div>
        </div>

        <!-- Acciones -->
        <div data-eit-display="flex" data-eit-gap="2">
          <ButtonComponent
            text="✏️"
            data-eit-variant="blue"
            data-eit-outline
            @emitEvent="$emit('editar', index)"
          />
          <ButtonComponent
            text="🗑️"
            data-eit-variant="red"
            data-eit-outline
            @emitEvent="$emit('eliminar', index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pregunta } from '@/interfaces'

// UIKit Components are globally registered in main.ts
// No need to import them here

defineProps<{
  preguntas: Pregunta[]
}>()

defineEmits<{
  editar: [index: number]
  eliminar: [index: number]
}>()

function getTipoTexto(tipo: string): string {
  const tipos: Record<string, string> = {
    'texto_corto': 'Texto Corto',
    'texto_largo': 'Texto Largo',
    'numero': 'Número',
    'email': 'Email',
    'telefono': 'Teléfono',
    'si_no': 'Sí/No',
    'opcion_unica': 'Opción Única'
  }
  return tipos[tipo] || tipo
}
</script>
