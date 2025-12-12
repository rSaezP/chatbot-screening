import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosError } from 'axios'
import axiosInstance from '@/config/axios.config'
import { utils, composables } from 'uikit-3it-vue'
import { ref, reactive, computed } from 'vue'
import { userRules } from '@/rules'

//Interfaces
import type { AlertsCore, ErrorBack } from 'uikit-3it-vue'
import type { 
  User, 
  UserForm,
  UserQueryParams, 
  UserFilters
} from '@/interfaces'
import { 
  createTableData, 
  initialQueryParamsUser, 
  initialFiltersUser, 
  initialUser,
  initialUserForm, 
  initialAlert,
} from '@/factories'

//Mappers
import { 
  mapperUsers, 
  mapperUser, 
  mapperUserForm 
} from '@/mappers'

const { sortTable } = utils.useTable()

export const useStoreUsers = defineStore('storeUsers', () => {

  const users = ref(createTableData<User>([
    'ID', 'Nombre', 'RUT', 'Rol', 'Estado'
  ]))
  const user = ref<User>({ ...initialUser })
  const userForm = ref<UserForm>({ ...initialUserForm })

  //Validation Form
  const { isValid, errors } = composables.useRules(userForm, userRules)

  const filters = reactive<UserFilters>({ ...initialFiltersUser })
  const queryParams = reactive<UserQueryParams>({ ...initialQueryParamsUser })

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
    return sortTable(users.value)
  })

  // Actions
  const getUsers = async (payload: Record<string, unknown>) => {
    try {
      loadingTable.value = true
      const { data } = await axiosInstance('/user/paged', {
        params: payload
      })
      users.value.data = mapperUsers(data.data)

      //Paginator
      users.value.paginator.total = data.meta.pagination.total 
      users.value.paginator.finalPage = data.meta.pagination.pageCount
      users.value.paginator.currentPage = data.meta.pagination.page + 1
      filters.page = users.value.paginator.currentPage
      //Define Sort
      if(users.value.data.length) users.value.sort.keys = Object.keys(users.value.data[0])
 
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingTable.value = false
    }
  }

  const getUserById = async (payload: string | number) => {
    try {
      loadingDetail.value = true
      const { data } = await axiosInstance(`/user/${payload}`)
      user.value = mapperUser(data.data)
      console.log('user.value', user.value)

    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    }
    finally {
      loadingDetail.value = false
    }
  }

  const getUserForm = async (payload: string | number) => {
    try {
      loadingForm.value = true
      const { data } = await axiosInstance(`/user/${payload}`)
      userForm.value = mapperUserForm(data.data)

    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingForm.value = false
    }
  }

  /* === Mutations === */
  const mutationCreateUser = async (payload: object) => {
    try {
      errorBack.value = null
      loadingBtnForm.value = true
      const { data } = await axiosInstance.post('/user/create', payload)
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
  const mutationEditUser = async (payload: object) => {
    try {
      errorBack.value = null
      loadingBtnForm.value = true
      const { data } = await axiosInstance.put('/user/update', payload)
      console.log(data.data)
    }
    catch(error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    }
    finally {
      loadingBtnForm.value = false
    }
    console.log('mutationEditUser', payload)
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
    users,
    user,
    userForm,
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
    getUsers,
    getUserById,
    getUserForm,
    //Mutations
    mutationCreateUser,
    mutationEditUser,
    //Handlers
    handleSlideFilter,
    handleSlideDetail,
    handleCloseSlide
  }
})
