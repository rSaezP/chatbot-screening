<script setup lang="ts">
  import { useStoreUsers, useStoreSelect } from '@/stores'
  import { ref, watch, watchEffect } from 'vue'
  import { utils } from 'uikit-3it-vue'
  import type { SelectOption } from 'uikit-3it-vue'
  import type { ExampleFormDialogProps } from '@/interfaces'
  import { initialUserForm } from '@/factories'

interface DatepickerInstance {
  clean: () => void
}

//Utils
const { 
  handleTooltip 
} = utils.useTooltip()
const { 
  formatDate,
} = utils.useFormat()
const { 
  validateDefault,
  validateEmail,
  validateRut,
  validatePhone
} = utils.useValidator()
const { 
  inputMaskPhone,
  inputMaskRut
} = utils.useInputMask()
const { 
  keyPressRut
} = utils.useKeypress()

//Stores
const storeUsers = useStoreUsers()
const storeSelect = useStoreSelect()

const props = withDefaults(defineProps<ExampleFormDialogProps>(), {
  errorForm: false,
  submittedForm: false
})

  //Emits
	const emit = defineEmits([
    'emitForm'
  ])

/** Variables **/
const formOutput = ref(props.form)
const datepickerRef = ref<DatepickerInstance | null>(null)

/** Methods **/

//Handles
const handleValueIdentification = (value: string) => {
  formOutput.value.identification = value
}
const handleSelectRole = (value: SelectOption) => {
  formOutput.value.roleId = value
}
const handleValueFirstName = (value: string) => {
  formOutput.value.firstName = value
}
const handleValueLastName = (value: string) => {
  formOutput.value.lastName = value
}
const handleValueWorkEmail = (value: string) => {
  formOutput.value.workEmail = value
}
const handleValuePhoneNumber = (value: string) => {
  formOutput.value.phoneNumber = value
}

const clean = () => {
  formOutput.value = { ...initialUserForm }
}

const handleClearDate = () => {
  datepickerRef.value?.clean()
}

watch(formOutput, (value) => {
  emit('emitForm', value)
}, { deep: true })

watchEffect (() => {
  if(props.submittedForm) clean()
  if(props.form) formOutput.value = props.form
})

</script>

<template>
    <form>
      <div 
        class="row"
        data-eit-mb="3"
      >
        <div class="col-12">
          <h5 
            data-eit-m="0"
            data-eit-font-size="x5"
            data-eit-color="secondary"
            data-eit-border="bottom"
            data-eit-border-color="default"
          >
            Datos principales
          </h5>
        </div>
      </div>

      <div class="row">
        <div 
          class="col-12 col-lg-6"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            RUT
          </label>
            <InputComponent
              inputType="text"
              :input="formOutput.identification"
              :validation="validateRut"
              :inputMask="inputMaskRut"
              :keyPress="keyPressRut"
              :maxLength="12"
              placeHolder="12.345.678-9"
              :requiredField="storeUsers.errors.identification?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleValueIdentification"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeUsers.errors.identification?.message"
            />
        </div>
        <div 
          class="col-12 col-lg-6"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Rol de cuenta
          </label>
          <SelectComponent
            label="name"
            placeholder="Seleccionar"
            :data="storeSelect.selectRoleUser.data"
            :selected="formOutput.roleId"
            :validation="validateDefault"
            :requiredField="storeUsers.errors.roleId?.required"
            :error="errorForm"
            :submitted="submittedForm"
            @emitValue="handleSelectRole"
            :clearable="false"
          />
          <FieldErrorComponent
            :errorForm="errorForm"
            :errorMessage="storeUsers.errors.roleId?.message"
          />
        </div>
      </div>

      <div class="row">
        <div 
          class="col-12 col-lg-6"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Nombre
          </label>
            <InputComponent
              inputType="text"
              :input="formOutput.firstName"
              :validation="validateDefault"
              maxLength="100"
              placeHolder="Ingresa un nombre"
              :requiredField="storeUsers.errors.firstName?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleValueFirstName"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeUsers.errors.firstName?.message"
            />
        </div>
        <div 
          class="col-12 col-lg-6"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Apellido
          </label>
            <InputComponent
              inputType="text"
              :input="formOutput.lastName"
              :validation="validateDefault"
              maxLength="100"
              placeHolder="Ingresa un apellido"
              :requiredField="storeUsers.errors.lastName?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleValueLastName"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeUsers.errors.lastName?.message"
            />
        </div>
      </div>

      <div class="row">
        <div 
          class="col-12 col-lg-6"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Correo electrónico
          </label>
            <InputComponent
              inputType="text"
              :input="formOutput.workEmail"
              :validation="validateEmail"
              maxLength="200"
              placeHolder="Ingresa un correo"
              :requiredField="storeUsers.errors.workEmail?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleValueWorkEmail"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeUsers.errors.workEmail?.message"
            />
        </div>
        <div 
          class="col-12 col-lg-6"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Teléfono
          </label>
            <InputComponent
              inputType="text"
              :input="formOutput.phoneNumber"
              :validation="validatePhone"
              :inputMask="inputMaskPhone"
              :maxLength="14"
              placeHolder="Ingresa un teléfono"
              :requiredField="storeUsers.errors.phoneNumber?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleValuePhoneNumber"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeUsers.errors.phoneNumber?.message"
            />
        </div>
      </div>
      
      <div
        data-eit-border="all"
        data-eit-border-color="default"
        data-eit-border-radius="x3"
        data-eit-p="2"
        data-eit-mb="3"
      >
        <label 
          class="eit-cursor--pointer"
          data-eit-display='flex'
          data-eit-justify='between'
          data-eit-align='center'
        >
          <span data-eit-color='text-soft'>
            <font-awesome-icon 
              :icon="['fas', 'circle-info']" 
              v-tippy="handleTooltip('El modo SSO requiere un correo corporativo', true, 'bottom')"
              data-eit-font-size="x4"
              data-eit-color="blue"
            />
            Activar modo SSO
          </span>
          <span class="eit-switch">
            <input
              type="checkbox"
              class="eit-switch__input"
              v-model="formOutput.loginViaSso"
            >
            <span class="eit-switch__slider"></span>
          </span>
        </label> 
      </div>

      <div class="row">
        <div class="col-12 mb-3">
          <label class="eit-color--text-soft">Inicio actividades</label>
          <VueDatePicker 
            auto-apply
            locale="es"
            :enable-time-picker="false"
            :month-change-on-scroll="false"
            :format="formatDate"
            :max-date="new Date()"
            v-model="formOutput.date"
          >
              <template #dp-input="{ value }">
                <InputComponent 
                  ref="datepickerRef"
                  inputType="text"
                  floatLeft
                  :validation="validateDefault"
                  :input="value"
                  placeHolder="Fecha"
                  :submitted="submittedForm"
                >
                  <template #float-left>
                    <font-awesome-icon icon="fa-regular fa-calendar"/>
                  </template>
                </InputComponent>
              </template>
              <template #clear-icon="{ clear }">
                <font-awesome-icon 
                  :icon="['fas', 'xmark']" 
                  class="pe-3" 
                  @click="clear(), handleClearDate()" 
                />
              </template>
          </VueDatePicker>
        </div>
      </div>

      <ErrorComponent
        data-eit-mb="3"
        :data="storeUsers.errorBack?.response?.data?.error?.errorFields"
      />

<!--       <div 
        data-eit-display="flex"
        data-eit-justify="end"
      >
        <ButtonComponent
          text="Guardar usuario"
          icon="fa-solid fa-floppy-disk"
          data-eit-variant="primary"
          :loading="storeUsers.loadingBtnForm"
          :isDisabled="storeUsers.loadingBtnForm"
          loadingText="Guardando..."
        />
      </div> -->
    </form>
</template>