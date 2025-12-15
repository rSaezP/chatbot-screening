<script setup lang="ts">
import { ref, watchEffect, useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import { utils, type TextareaProps } from 'uikit-3it-vue'
const { handleTooltip } = utils.useTooltip()

// Props
const props = withDefaults(defineProps<TextareaProps>(), {
  inputMask: null,
  submitted: false
})

//Route
const router = useRouter()

//Emits
const emit = defineEmits<{
  (e: 'submit', value: string): void     
}>()

// Constants
const attrs = useAttrs()
const textarea = ref<HTMLTextAreaElement | null>(null)
const output = ref('')

/** Methods **/
const clean = () => {
  output.value = ''
}

const update = () => {
  if (textarea.value) {
    textarea.value.style.height = '40px'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault() 
if (output.value.trim().length > 0) {
      emit('submit', output.value)
    }
  }
}

const handleSeePrevious = () => {
  router.push('/ia-report')
}

watchEffect(() => {
  if (props.inputMask) output.value = props.inputMask(output.value)
  if (props.submitted) clean()
})

//Expose
defineExpose({ clean })
</script>

<template>
  <div 
    class="eit-prompt-component eit-box-shadow"
    data-eit-variant='center'
    data-eit-flex-grow='1'
    data-eit-border-radius="x10"
    data-eit-p="3"
  >
    <div 
      class="eit-prompt-component-inner"
      data-eit-bg="color-soft"
      data-eit-p="2"
      data-eit-border-radius="x10"
    >
      <textarea
        ref="textarea"
        :maxlength="240"
        autocomplete="off"
        v-model.trim="output"
        @input="update"
        @keydown="onKeyDown"
        v-bind="attrs"
      ></textarea>
    </div>
    <div
      data-eit-display="flex"
      data-eit-justify="between"
      data-eit-align="center"
      data-eit-mt="3"
      data-eit-flex-shrink='1'
    >
      <ButtonComponent
        text="Ver historial"
        icon="fa-solid fa-clock-rotate-left"
        data-eit-variant="gray"
        data-eit-outline
        data-eit-size='small'
        @emitEvent="handleSeePrevious"
      />
      <span
        data-eit-display="flex"
        data-eit-align="center"
        data-eit-gap="2"
      >
      <span 
        data-eit-color="text-soft" 
        data-eit-font-size="x2"
      >
        {{ output.length }} / 500
      </span>
        <kbd 
          v-tippy="handleTooltip('ENTER', false, 'bottom')"
          >
            ⏎ Preguntar
        </kbd>
        <kbd 
          v-tippy="handleTooltip('Shift + ENTER', false, 'bottom')"
          >
            ⇧ ⏎ Salto línea
        </kbd>
      </span>
    </div>
  </div>
</template>

<style>

.eit-prompt-component {
  width: 100%;
  max-width: 760px;
  min-width: 0;
}

.eit-prompt-component textarea {
  display: block;
  width: 100%;
  height: 40px;
  min-width: 0;    
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  border: 0;
  background: none;
  line-height: 1.2;
  resize: none;
  color: var(--eit-color-text);
}

.eit-prompt-component textarea:focus {
  outline: none;
}

kbd {
  display: inline-block;
  min-width: 2ch;
  padding: 0.25em 0.6em;
  margin: 0 0.15em;

  font-family: "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  font-size: 0.85em;
  font-weight: 500;
  text-align: center;
  line-height: 1.4;

  color: var(--eit-color-text);
  background: var(--eit-color-bg-soft);
  border: 1px solid var(--eit-color-bg-mute);
  border-radius: 6px;

  box-shadow: 0 1px 0 var(--eit-color-bg) inset,
              0 1px 2px rgba(0,0,0,0.1);
}

</style>