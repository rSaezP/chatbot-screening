<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { RecordEnableDisable, StoreEnableDisable, CustomRecordEnableDisable } from '@/interfaces'
  import { defaultCustomRecordEnableDisable } from '@/factories'
  import type { DialogExpose } from 'uikit-3it-vue'

  //Props
  const props = withDefaults(defineProps<{
    store: StoreEnableDisable
    record: RecordEnableDisable
    customRecord?: CustomRecordEnableDisable
  }>(), {
    customRecord: () => ({ ...defaultCustomRecordEnableDisable })
  })

  const dialogComponent = ref<DialogExpose | null>(null)

  const showDialog = () => dialogComponent.value?.showDialog()
  const closeDialog = () => dialogComponent.value?.closeDialog()
  defineExpose({ showDialog, closeDialog })

  //Emits
  const emit = defineEmits<{
    (e: 'dialogSubmit'): void
  }>()

  const controlError = computed(() => {
    return props.store.errorBack?.response?.data?.error?.errorFields
  })

  const handleDialogSubmit = () => {
		emit('dialogSubmit')
  }

  const handleBtnSubmitDialogEnableDisable = (record: RecordEnableDisable) => {
    if(record?.recordStatus?.status) {
      return {
        text: 'Deshabilitar',
        loadingText: 'Deshabilitando...',
        variant: 'red'
      }
    }
    else {
      return {
        text: 'Habilitar',
        loadingText: 'Habilitando...',
        variant: 'green'
      }
    }
  }

</script> 
<template>
  <DialogComponent
    ref="dialogComponent"
    class="eit-dialog--top"
    :btnSubmit="true"
    :loading="props.store.loadingDialog"
    :loadingSubmit="props.store.loadingBtnDialog"
    :disabledSubmit="props.store.disabledSubmit"
    @emitSubmit="handleDialogSubmit"
    :btnSubmitConfig="handleBtnSubmitDialogEnableDisable(props.record)"
  >
    <template #head>
      <h3 
        data-eit-font-size="x5"
        data-eit-color="text"
        data-eit-m="0"
      >
        <template v-if="props.record.recordStatus.status">
          <font-awesome-icon 
            :icon="['fas', 'ban']" 
            data-eit-color="red"
          />
          Deshabilitar
        </template>
        <template v-if="!props.record.recordStatus.status">
          <font-awesome-icon 
            :icon="['far', 'circle-check']" 
            data-eit-color="green"
          />
          Habilitar
        </template>
      </h3>
    </template>
    <template #content>
      <AlertComponent
        :data-eit-variant="props.store.messageDialogAlert.variant"
        data-eit-mb="3"
        icon="fa-solid fa-arrow-down"
        :message="props.store.messageDialogAlert.message"
      />
      <div 
        data-eit-border="all"
        data-eit-border-color="default"
        data-eit-border-radius="x3"
        data-eit-p="2"
      >
        <div 
          data-eit-display="flex"
          data-eit-align="center"
        >
          <div data-eit-flex-shrink='0'>
            <font-awesome-icon 
              :icon="props.customRecord?.icon" 
              data-eit-font-size="x8"
              data-eit-color="secondary"
            />
          </div>
          <div 
            data-eit-flex-grow='1'
            data-eit-ms="3"
          >
            <h4 
              data-eit-color="text"
              data-eit-font-size="x4"
              data-eit-m="0"
            >
              {{ props.customRecord?.title }}
            </h4>
            <p 
              data-eit-m="0"
              data-eit-color="text-soft"
              data-eit-font-size="x2"
            >
              {{ props.customRecord?.subtitle }}
            </p>
          </div>
        </div>
      </div>
      <slot name="additional"></slot>

      <ErrorComponent 
        class="mt-3"
        :data="controlError"
      />
    </template>
  </DialogComponent>
</template>