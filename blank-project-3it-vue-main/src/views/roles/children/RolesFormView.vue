<script setup lang="ts">
	import { useStoreRoles, useStoreSelect } from '@/stores'
  import { useRoute, useRouter } from 'vue-router'
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { composables, utils } from 'uikit-3it-vue'
  import messages from '@/messages/messages'

  //Types
  import type { ToastExpose, SelectOption } from 'uikit-3it-vue'

import type { 
  SubModuleSelectable,
  SubModuleRoleForm
} from '@/interfaces'

  //Factories
  import { 
    initialRoleForm,
    initialRoleFormModules
  } from '@/factories'

  //Utils
  const { 
    handleTooltip 
  } = utils.useTooltip()
  const { 
    validateDefault,
  } = utils.useValidator()
  const { 
    inputOnlyLettersAndNumbers
  } = utils.useInputMask()
  const { 
    messageToastCreateUpdate,
    messageAlertDefault
  } = composables.useMessage()

  //Stores
  const storeRoles = useStoreRoles()
  const storeSelect = useStoreSelect()

  //Route
  const route = useRoute()
  const router = useRouter()

  //** Constants **/

 //Form
  const errorForm = ref(false)
  const submittedForm = ref(false)

  //Toast
  const toast = ref<ToastExpose | null>(null)
	const toastDelay = ref(3000)
  const toastPosition = ref('top')

  //** Methods **/

  const handleInitialSelect = async () => {
    try {
      await Promise.all([ 
        storeSelect.getSelectModule({
          filter: true
        })
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateForm = async () => {
    try {
      storeRoles.loadingForm = true 
      storeRoles.errorBack = null
      await handleInitialSelect()
      if(route.params.id) {
        await storeRoles.getRoleForm(String(route.params.id))
      }
      else {
        storeRoles.loadingForm = false
        storeRoles.roleForm = { ...initialRoleForm }
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

  //Form
  const handleValueName = (value: string) => {
    storeRoles.roleForm.name = value
  }
  const handleValuesDescription = (value: string) => {
    storeRoles.roleForm.description = value
  }
  const handleSelectModule = (value: SelectOption[]) => {
    storeRoles.roleForm.subModules = value
  }

  const isWithPermissions = (value: SubModuleSelectable): value is SubModuleRoleForm =>
    value != null && 
    typeof value === 'object' &&
    'canRead' in value &&
    'canCreate' in value &&
    'canUpdate' in value && 
    'canDelete' in value

  const changeSelectModules = (): void => {
    const selected: ReadonlyArray<SubModuleSelectable> = storeRoles.roleForm.subModules ?? []
    const prevById = new Map<number, SubModuleRoleForm>()
    for (const mod of storeRoles.roleFormModules) {
      if (mod.id != null) prevById.set(mod.id, mod)
    }
    const permsById = new Map<number, SubModuleRoleForm>()
    for (const item of selected) {
      if (isWithPermissions(item) && item.id != null) {
        permsById.set(item.id, item)
      }
    }
    storeRoles.roleFormModules = selected.map((opt) => {
      const id = opt.id ?? null
      const name = opt.name
      if (id != null) {
        const keep = prevById.get(id)
        if (keep) return { ...keep, name }
        const fromEdit = permsById.get(id)
        if (fromEdit) return { ...fromEdit, id, name }
      }
      return { ...initialRoleFormModules, id, name }
    })
  }

  const handleCreateEditUser = async (id: number | null) => {

    const data_ = {
      ...storeRoles.roleForm,
      subModules: storeRoles.roleFormModules.map((item) => ({
        subModuleId: item.id,
        canRead: true,
        canCreate: item.canCreate,
        canUpdate: item.canUpdate,
        canDelete: item.canDelete
      }))
    }

    if(id) await storeRoles.mutationEditRole(data_)
    else await storeRoles.mutationCreateRole(data_)
  }

  const submitForm = async () => {
    //Valid form
    if(storeRoles.isValid) {
      submittedForm.value = false
      try {
        //Create or Edit
        await handleCreateEditUser(storeRoles.roleForm.id ?? null)
        //Message
        messageToastCreateUpdate(
          storeRoles,
          storeRoles.roleForm.id ?? null,
          toastDelay,
          messages.role
        )
        
        //Success
        if(!storeRoles.errorBack) {
          errorForm.value = false
          
          //Reset form
          storeRoles.roleForm = { ...initialRoleForm }
          submittedForm.value = true

          if(!storeRoles.loadingBtnDialog) {
            await nextTick()
            submittedForm.value = false
            handleToastShow()
            setTimeout(() => {
              router.push('/roles')
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
      storeRoles,
      errorForm.value,
      messages.role
    )
	}, {immediate: true})

  watch(() => storeRoles.roleForm.subModules, () => {
    changeSelectModules()
  })

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
    :data-eit-variant="storeRoles.messageAlert.variant"
    :message="storeRoles.messageAlert.message"
  />

  <template v-if="storeRoles.loadingForm">
    <LoadingComponent 
      size="100" 
      data-eit-mb="3"
    />
  </template>
  <template v-if="!storeRoles.loadingForm">
    <form>
      <div 
        class="row"
        data-eit-mb="3"
      >
        <div class="col-12">
          <h5 
            data-eit-m="0"
            data-eit-font-size="x5"
            data-eit-font-weight="500"
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
          class="col-12"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Nombre
          </label>
            <InputComponent
              inputType="text"
              :input="storeRoles.roleForm.name"
              :validation="validateDefault"
              :maxLength="100"
              placeHolder="Ingresa un nombre"
              :requiredField="storeRoles.errors.name?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleValueName"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeRoles.errors.name?.message"
            />
        </div>
      </div>

      <div class="row">
        <div 
          class="col-12"
          data-eit-mb="3"
        >
          <label data-eit-color="text">
            Descripción
          </label>
            <TextareaResizeComponent
              inputType="text"
              :input="storeRoles.roleForm.description"
              :inputMask="inputOnlyLettersAndNumbers"
              maxLength="200"
              placeHolder="Ingresa la descripción"
              :submitted="submittedForm"
              @emitValue="handleValuesDescription"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeRoles.errors.firstName?.message"
            />
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5 
            data-eit-font-size="x5"
            data-eit-font-weight="500"
            data-eit-color="blue"
            data-eit-mt="0"
            data-eit-mb="1"
          >
            Módulos
          </h5>
          <p 
            data-eit-color="text-soft"
            data-eit-my="0"
          >
            Un rol de usuario no quedará activo, hasta asociarle al menos un <strong data-eit-color="text">módulo.</strong>
          </p>
          <div 
            data-eit-border="all"
            data-eit-border-color="blue"
            data-eit-border-radius="x3"
            data-eit-p="3"
            data-eit-mb="3"
          >
            <SelectComponent
              label="name"
              placeholder="Seleccionar"
              :data="storeSelect.selectModule.data"
              :selected="storeRoles.roleForm.subModules"
              :validation="validateDefault"
              :requiredField="storeRoles.errors.subModules?.required"
              :error="errorForm"
              :submitted="submittedForm"
              @emitValue="handleSelectModule"
              :clearable="false"
              multiple
              :selectable="(option: SelectOption) => {
                return !storeRoles.roleForm.subModules?.some(
                  (selected) => selected.id === option.id
                )
              }"
            />
            <FieldErrorComponent
              :errorForm="errorForm"
              :errorMessage="storeRoles.errors.subModules?.message"
            />
          </div>
        </div>
      </div>

      <template v-if="!storeRoles.roleFormModules.length">
        <AlertComponent
          icon="fa-solid fa-info"
          data-eit-mb="3"
          data-eit-variant="light"
          message="Los permisos del módulo aparecerán aquí <strong>cuando lo selecciones.</strong>"
        />
      </template>

      <template v-else>
        <h5 
          data-eit-font-size="x3"
          data-eit-font-weight="500"
          data-eit-color="text"
          data-eit-mt="0"
          data-eit-mb="1"
        >
          Permisos de módulo
        </h5>
        <p 
          data-eit-font-size="x2"
          data-eit-color="text-soft"
          data-eit-mt="0"
          data-eit-mb="1"
        >
          Agrega o quita  <strong data-eit-color="text">permisos específicos</strong> para este rol.
        </p>
        <div class="d-flex flex-column gap-2">
          <div 
            v-for="(item, index) in storeRoles.roleFormModules" 
            :key="index"
            class="eit-box-shadow"
            data-eit-variant='center'
            data-eit-border-radius="x3"
            data-eit-mb="3"
            data-eit-p="3"
          >
            <h5 
              data-eit-color="text"
              data-eit-font-size="x4"
              data-eit-font-weight="500"
              data-eit-my="0"
            >
              <font-awesome-icon 
                :icon="['fas', 'border-all']"
                data-eit-color="text"
              />
              {{ item.name }}
            </h5>
  
            <div
              data-eit-display="flex"
              data-eit-flex-wrap='wrap'
              data-eit-gap="2"
            >
              <div
                :key="index"
                data-eit-flex="col"
                data-eit-border="all"
                data-eit-border-color="default"
                data-eit-border-radius="x3"
                data-eit-p="2"
              >
                <label 
                  class="eit-cursor--pointer"
                  data-eit-display='flex'
                  data-eit-justify='between'
                  data-eit-align='center'
                >
                  <span 
                    data-eit-display='flex'
                    data-eit-flex-wrap='nowrap'
                    data-eit-color='text-soft'
                    data-eit-me="2"
                  >
                    <font-awesome-icon 
                      :icon="['fas', 'eye']" 
                      data-eit-font-size="x4"
                      data-eit-color="text-soft"
                      data-eit-me="2"
                    />
                    Ver
                  </span>
                  <span 
                    class="eit-switch"
                    v-tippy="handleTooltip('El permiso ver no puede deshabilitarse', false, 'top')"
                  >
                    <input
                      type="checkbox"
                      class="eit-switch__input"
                      v-model="item.canRead"
                      disabled
                    >
                    <span class="eit-switch__slider"></span>
                  </span>
                </label> 
              </div>
            
              <div
                :key="index"
                data-eit-flex="col"
                data-eit-border="all"
                data-eit-border-color="default"
                data-eit-border-radius="x3"
                data-eit-p="2"
              >
                <label 
                  class="eit-cursor--pointer"
                  data-eit-display='flex'
                  data-eit-justify='between'
                  data-eit-align='center'
                >
                  <span 
                    data-eit-display='flex'
                    data-eit-flex-wrap='nowrap'
                    data-eit-color='text-soft'
                    data-eit-me="2"
                  >
                    <font-awesome-icon 
                      :icon="['fas', 'square-plus']" 
                      data-eit-font-size="x4"
                      data-eit-color="text-soft"
                      data-eit-me="2"
                    />
                    Crear
                  </span>
                  <span class="eit-switch">
                    <input
                      type="checkbox"
                      class="eit-switch__input"
                      v-model="item.canCreate"
                    >
                    <span class="eit-switch__slider"></span>
                  </span>
                </label> 
              </div>    

              <div
                :key="index"
                data-eit-flex="col"
                data-eit-border="all"
                data-eit-border-color="default"
                data-eit-border-radius="x3"
                data-eit-p="2"
              >
                <label 
                  class="eit-cursor--pointer"
                  data-eit-display='flex'
                  data-eit-justify='between'
                  data-eit-align='center'
                >
                  <span 
                    data-eit-display='flex'
                    data-eit-flex-wrap='nowrap'
                    data-eit-color='text-soft'
                    data-eit-me="2"
                  >
                    <font-awesome-icon 
                      :icon="['fas', 'square-plus']" 
                      data-eit-font-size="x4"
                      data-eit-color="text-soft"
                      data-eit-me="2"
                    />
                    Editar
                  </span>
                  <span class="eit-switch">
                    <input
                      type="checkbox"
                      class="eit-switch__input"
                      v-model="item.canUpdate"
                    >
                    <span class="eit-switch__slider"></span>
                  </span>
                </label> 
              </div>  

              <div
                :key="index"
                data-eit-flex="col"
                data-eit-border="all"
                data-eit-border-color="default"
                data-eit-border-radius="x3"
                data-eit-p="2"
              >
                <label 
                  class="eit-cursor--pointer"
                  data-eit-display='flex'
                  data-eit-justify='between'
                  data-eit-align='center'
                >
                  <span 
                    data-eit-display='flex'
                    data-eit-flex-wrap='nowrap'
                    data-eit-color='text-soft'
                    data-eit-me="2"
                  >
                    <font-awesome-icon 
                      :icon="['fas', 'trash-can']" 
                      data-eit-font-size="x4"
                      data-eit-color="text-soft"
                      data-eit-me="2"
                    />
                    Eliminar
                  </span>
                  <span class="eit-switch">
                    <input
                      type="checkbox"
                      class="eit-switch__input"
                      v-model="item.canDelete"
                    >
                    <span class="eit-switch__slider"></span>
                  </span>
                </label> 
              </div> 

            </div>

          </div>
        </div>

      </template>

      <ErrorComponent
        data-eit-mb="3"
        :data="storeRoles.errorBack?.response?.data?.error?.errorFields"
      />

      <div 
        data-eit-display="flex"
        data-eit-justify="end"
      >
        <ButtonComponent
          text="Guardar rol"
          icon="fa-solid fa-floppy-disk"
          data-eit-variant="primary"
          :loading="storeRoles.loadingBtnForm"
          :isDisabled="storeRoles.loadingBtnForm"
          loadingText="Guardando..."
          @emitEvent.prevent="submitForm"
        />
      </div>
    </form>

    <ToastComponent 
      ref="toast"
      :data="storeRoles.messageToast"
      :position="toastPosition"
      :visible="toastDelay"
    />

  </template>

</template>