import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosError } from 'axios'
import axiosInstance from '@/config/axios.config'
import { utils, composables } from 'uikit-3it-vue'
import { ref, reactive, computed } from 'vue'
import { roleRules } from '@/rules'

//Interfaces
import type { AlertsCore, ErrorBack } from 'uikit-3it-vue'
import type { 
  Role, 
  RoleForm,
  RoleQueryParams, 
  RoleFilters,
  SubModuleRoleForm
} from '@/interfaces'
import { 
  createTableData, 
  initialQueryParams, 
  initialFilters, 
  initialRole,
  initialRoleForm, 
  initialAlert,
} from '@/factories'

//Mappers
import { 
  mapperRoles, 
  mapperRole, 
  mapperRoleForm, 
} from '@/mappers'

const { sortTable } = utils.useTable()

export const useStoreRoles = defineStore('storeRoles', () => {

  const roles = ref(createTableData<Role>([
    'ID', 'Nombre', 'Cantidad de usuarios', 'Cantidad de módulos', 'Estado'
  ]))
  const role = ref<Role>({ ...initialRole })
  const roleForm = ref<RoleForm>({ ...initialRoleForm })
  const roleFormModules = ref<SubModuleRoleForm[]>([])

  //Validation Form
  const { isValid, errors } = composables.useRules(roleForm, roleRules)

  const filters = reactive<RoleFilters>({
    ...initialFilters,
    module: null,
    status: null
  })

  const queryParams = reactive<RoleQueryParams>({
    ...initialQueryParams,
    subModuleId: null,
    status: null
  })

  // Detail views
  const slideFilter = ref(false)
  const slideDetail = ref(false)
  const smallSize = ref(false)

  // Messages
  const messageToast = ref<Record<string, unknown>>({})
  const messageAlert = ref<AlertsCore>({ ...initialAlert })
  const messageDialogAlert = ref<AlertsCore>({ ...initialAlert })

  // Loading states
  const loadingTable = ref(true)
  const loadingFilters = ref(true)
  const loadingBtnFilters = ref(false)
  const loadingDetail = ref(true)
  const loadingForm = ref(true)
  const loadingBtnForm = ref(false)
  const loadingDialog = ref(true)
  const loadingBtnDialog = ref(false)
  const loadingBtnDownload = ref(false)

  //Disabled
  const disabledSubmit = ref(false)
  const disabledDownload = ref(false)

  // Error
  const errorBack = ref<AxiosError<ErrorBack> | null>(null)

  // Getters
  const filterTable = computed(() => {
    return sortTable(roles.value)
  })

  // Actions
  const getRoles = async (payload: Record<string, unknown>) => {
    try {
      loadingTable.value = true
      const { data } = await axiosInstance('/user/role/paged', {
        params: payload
      })
      roles.value.data = mapperRoles(data.data)

      //Paginator
      roles.value.paginator.total = data.meta.pagination.total
      roles.value.paginator.finalPage = data.meta.pagination.pageCount
      roles.value.paginator.currentPage = data.meta.pagination.page + 1
      filters.page = roles.value.paginator.currentPage
      //Define Sort
      if(roles.value.data.length) roles.value.sort.keys = Object.keys(roles.value.data[0])

    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingTable.value = false
    }
  }

  const getRoleById = async (payload: string | number) => {
    try {
      loadingDetail.value = true
      const { data } = await axiosInstance(`/user/role/${payload}`)
      role.value = mapperRole(data.data)
      console.log('role.value', role.value)

    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    }
    finally {
      loadingDetail.value = false
    }
  }

  const getRoleForm = async (payload: string | number) => {
    try {
      loadingForm.value = true
      const { data } = await axiosInstance(`/user/role/${payload}`)
      roleForm.value = mapperRoleForm(data.data)

    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingForm.value = false
    }
  }

  /* === Mutations === */
  const mutationCreateRole = async (payload: object) => {
    try {
      errorBack.value = null
      loadingBtnForm.value = true
      const { data } = await axiosInstance.post('/user/role/create', payload)
      console.log(data.data)
    }
    catch(error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    }
    finally {
      loadingBtnForm.value = false
    }
  }
  const mutationEditRole = async (payload: object) => {
    try {
      errorBack.value = null
      loadingBtnForm.value = true
      const { data } = await axiosInstance.put('/user/role/update', payload)
      console.log(data.data)
    }
    catch(error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    }
    finally {
      loadingBtnForm.value = false
    }
  }

  const handleSlideFilter = () => {
    slideDetail.value = false
    slideFilter.value = true
    loadingFilters.value = false
  }

  const handleSlideDetail = () => {
    slideFilter.value = false
    slideDetail.value = true
  }

  const handleCloseSlide = () => {
    slideFilter.value = false
    slideDetail.value = false
  }

  return {
    roles,
    role,
    roleForm,
    roleFormModules,
    filters,
    queryParams,
    slideFilter,
    slideDetail,
    smallSize,
    messageAlert,
    messageToast,
    messageDialogAlert,
    loadingTable,
    loadingFilters,
    loadingBtnFilters,
    loadingDetail,
    loadingForm,
    loadingBtnForm,
    loadingDialog,
    loadingBtnDialog,
    loadingBtnDownload,
    //disabled
    disabledSubmit,
    disabledDownload,
    //Form
    isValid,
    errors,
    //Error
    errorBack,
    filterTable,
    //Getters
    getRoles,
    getRoleById,
    getRoleForm,
    //Mutations
    mutationCreateRole,
    mutationEditRole,
    //Handlers
    handleSlideFilter,
    handleSlideDetail,
    handleCloseSlide
  }
})
