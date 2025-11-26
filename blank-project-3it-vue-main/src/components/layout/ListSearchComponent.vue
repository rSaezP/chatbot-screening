<script setup lang="ts">
  import { utils } from 'uikit-3it-vue'

  const { handleTooltip } = utils.useTooltip()

  interface Props {
    input?: string
    searchPlaceholder?: string
    btnFilter?: boolean
    btnNewRecord?: string
    btnDownload?: {
      loading: boolean
      isDisabled: boolean,
      active: boolean
    }
  }

  // Props
  const props = withDefaults(defineProps<Props>(), {
    input: '',
    btnActionText: '',
    searchPlaceholder: '',
    btnFilter: false,
    btnNewRecord: '',
    btnDownload: () => ({
      loading: false,
      isDisabled: false,
      active: false
    })
  })

  // Emits
  const emit = defineEmits<{
    (e: 'emitNewRecord'): void
    (e: 'emitDownloadRecords'): void
    (e: 'emitSlideFilter'): void
    (e: 'emitInputSearch', value: string): void
    (e: 'emitPressEnter'): void
  }>()

  /** Methods **/
  const handleNewRecord = async () => {
    emit('emitNewRecord')
  }

  const handleDownloadRecords = () => {
    emit('emitDownloadRecords')
  }

  const handleSlideFilter = async () => {
    emit('emitSlideFilter')
  }

  const handleInputSearch = (output: string) => {
    emit('emitInputSearch', output)
  }

  const handlePressEnter = () => {
    emit('emitPressEnter')
  }
</script>

<template>
  <div 
    data-eit-display="flex"
    data-eit-flex-wrap='wrap'
    data-eit-gap="2"
    data-eit-mb="3"
  >
    <template v-if="props.btnFilter">
      <div 
        data-eit-flex-grow='1'
        data-eit-flex-grow-lg='0'
        data-eit-flex-shrink-lg='0'
      >
        <ButtonComponent
          text="Filtrar"
          icon="fa-solid fa-sliders" 
          data-eit-variant='gray'
          data-eit-outline
          data-eit-w="100"
          @click="handleSlideFilter"
        />
      </div>
    </template>
    <div data-eit-flex-grow='1'>
      <InputComponent
        inputType="text"
        floatLeft
        floatRight
        :input="props.input"
        :placeHolder="props.searchPlaceholder"
        icon="fa-solid fa-search"
        @emitValue="handleInputSearch"
        @emitPressEnter="handlePressEnter"
      >
      <template #float-left>
        <font-awesome-icon 
          icon="fa-solid fa-search"
        />
      </template>
      <template #float-right>
        <span 
          class="eit-icon-enter"
           v-tippy="handleTooltip('Presiona ENTER para buscar', false, 'top')"
        >
          <font-awesome-icon 
            icon="fa-solid fa-arrow-turn-down"
            class="eit-transform"
            data-eit-rotate='90'
          />
        </span>
      </template>
      </InputComponent>
    </div>
    <div 
      data-eit-flex-grow='1'
      data-eit-flex-grow-lg='0'
      data-eit-flex-shrink-lg='0'
      data-eit-display="flex"
      data-eit-gap="2"
    >
    <template v-if="props.btnDownload.active">
      <ButtonComponent
        text=""
        icon="fa-solid fa-download"
        class="eit-btn"
        data-eit-variant='gray'
        data-eit-outline
        :loading="props.btnDownload.loading"
        loadingText=""
        :isDisabled="props.btnDownload.isDisabled"
        @emitEvent="handleDownloadRecords"
        v-tippy="handleTooltip('Descargar información', false, 'top')"
      />
    </template>
    <template v-if="props.btnNewRecord">
        <ButtonComponent
          :text="props.btnNewRecord"
          icon="fa-solid fa-plus"
          data-eit-variant='primary'
          data-eit-w="100"
          @click="handleNewRecord"
        />
      </template>
    </div>
  </div>
</template>