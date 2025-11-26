<script setup lang="ts">
	import { useStoreUsers, useStoreSelect } from '@/stores'
  import { useRoute, useRouter } from 'vue-router'
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { composables, utils } from 'uikit-3it-vue'
  import messages from '@/messages/messages'

  //Types
  import type { ToastExpose } from 'uikit-3it-vue'

  //Interfaces
  import type { SelectOption } from 'uikit-3it-vue'

  interface DatepickerInstance {
    clean: () => void
  }

  //Factories
  import { 
    initialUserForm,
  } from '@/factories'

  //Utils
  const { 
    handleTooltip 
  } = utils.useTooltip()
  const { 
    formatDate,
    formatRutToBack,
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
  const { 
    messageToastCreateUpdate,
    messageAlertDefault
  } = composables.useMessage()

  //Stores
  const storeUsers = useStoreUsers()
  const storeSelect = useStoreSelect()

  //Route
  const route = useRoute()
  const router = useRouter()

  //** Constants **/

 //Form
  const errorForm = ref(false)
  const submittedForm = ref(false)
  const datepickerRef = ref<DatepickerInstance | null>(null)

  //Toast
  const toast = ref<ToastExpose | null>(null)
	const toastDelay = ref(3000)
  const toastPosition = ref('top')

  //** Methods **/

  const handleInitialSelect = async () => {
    try {
      await Promise.all([ 
        storeSelect.getSelectRoleUser(),
        storeSelect.getSelectCurrency(),
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateForm = async () => {
    try {
      storeUsers.loadingForm = true 
      storeUsers.errorBack = null
      await handleInitialSelect()
      if(route.params.id) {
        await storeUsers.getUserForm(String(route.params.id))
      }
      else {
        storeUsers.loadingForm = false
        storeUsers.userForm = { ...initialUserForm }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleToastShow = async () => {
		toastPosition.value = 'bottom'
    setTimeout(() => {
      if (toast.value) toast.value.handleShowToast()
    }, 100)
	}

  const handleClearDate = () => {
    datepickerRef.value?.clean()
  }

  //Form
  const handleValueIdentification = (value: string) => {
    storeUsers.userForm.identification = value
  }
  const handleSelectRole = (value: SelectOption) => {
    storeUsers.userForm.roleId = value
  }
  const handleValueFirstName = (value: string) => {
    storeUsers.userForm.firstName = value
  }
  const handleValueLastName = (value: string) => {
    storeUsers.userForm.lastName = value
  }
  const handleValueWorkEmail = (value: string) => {
    storeUsers.userForm.workEmail = value
  }
  const handleValuePhoneNumber = (value: string) => {
    storeUsers.userForm.phoneNumber = value
  }
  const handleCreateEditUser = async (id: number | null) => {

    const data_ = {
      ...storeUsers.userForm,
      identification: formatRutToBack(storeUsers.userForm.identification),
      roleId: storeUsers.userForm.roleId?.id ?? null
    }

    if(id) await storeUsers.mutationEditUser(data_)
    else await storeUsers.mutationCreateUser(data_)
  }

  const submitForm = async () => {
    //Valid form
    if(storeUsers.isValid) {
      submittedForm.value = false
      try {
        //Create or Edit
        await handleCreateEditUser(storeUsers.userForm.id ?? null)
        //Message
        messageToastCreateUpdate(
          storeUsers, 
          storeUsers.userForm.id ?? null, 
          toastDelay, 
          messages.user
        )
        
        //Success
        if(!storeUsers.errorBack) {
          errorForm.value = false
          
          //Reset form
          storeUsers.userForm = { ...initialUserForm }
          submittedForm.value = true
          
          if(!storeUsers.loadingBtnDialog) {
            await nextTick()
            submittedForm.value = false
            handleToastShow()
            setTimeout(() => {
              router.push('/users')
            }, toastDelay.value)
          }
        }
      } catch (error) {
          console.log(error)
          handleToastShow()
        }
    } else errorForm.value = true
  } 

  /** Watch **/
	watch(errorForm, () => {
    messageAlertDefault(
      storeUsers, 
      errorForm.value, 
      messages.user
    )
	}, {immediate: true})

  onMounted(async () => {
    await handleCreateForm()
  })

</script>
<template>
  <h1 
    class="m-0"
    data-eit-font="primary"
    data-eit-font-size="x7"
    data-eit-color="text"
    data-eit-font-weight="900"
    data-eit-my="0"
  >
    {{ route.meta.title }}
  </h1>

  <AlertComponent
    data-eit-mb="3"
    icon="fa-solid fa-arrow-down"
    :data-eit-variant="storeUsers.messageAlert.variant"
    :message="storeUsers.messageAlert.message"
  />

  <template v-if="storeUsers.loadingForm">
    <LoadingComponent 
      size="100" 
      data-eit-mb="3"
    />
  </template>
  <template v-if="!storeUsers.loadingForm">
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
              :input="storeUsers.userForm.identification"
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
            :selected="storeUsers.userForm.roleId"
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
              :input="storeUsers.userForm.firstName"
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
              :input="storeUsers.userForm.lastName"
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
              :input="storeUsers.userForm.workEmail"
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
              :input="storeUsers.userForm.phoneNumber"
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
              v-model="storeUsers.userForm.loginViaSso"
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
            v-model="storeUsers.userForm.date"
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

      <div 
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
          @emitEvent.prevent="submitForm"
        />
      </div>
    </form>

    <ToastComponent 
      ref="toast"
      :data="storeUsers.messageToast"
      :position="toastPosition"
      :visible="toastDelay"
    />

  </template>

</template>