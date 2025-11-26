// stores/select.store.ts
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import axiosInstance from '@/config/axios.config'
import type { SelectFilter } from 'uikit-3it-vue'
import { 
  selectStatusBase,
  selectRoleUserBase,
  selectCurrencyBase,
  selectModuleBase
} from '@/factories'

import { mapperSelectRoles } from '@/mappers'

export const useStoreSelect = defineStore('storeSelect', () => {

  const selectStatus = reactive<SelectFilter>({ ...selectStatusBase })
  const selectRoleUser = reactive<SelectFilter>({ ...selectRoleUserBase })
  const selectCurrency = reactive<SelectFilter>({ ...selectCurrencyBase })
  const selectModule = reactive<SelectFilter>({ ...selectModuleBase })

  const errorBack = ref<unknown>(null)

  // Getters de datos
  async function getSelectStatus() {
    try {
      const response = await fetch('/db/select/status.json')
      const data = await response.json()
      selectStatus.data = data
    } catch (error) {
      errorBack.value = error
    }
  }

  async function getSelectRoleUser() {
    try {
      selectRoleUser.selected = null
      const { data } = await axiosInstance('/base/selector/role')
      selectRoleUser.data = mapperSelectRoles(data.data)
    } catch (error) {
      errorBack.value = error
    }
  }
  async function getSelectCurrency() {
    try {
      selectCurrency.selected = null
      const { data } = await axiosInstance('/base/selector/currency')
      selectCurrency.data = data.data
    } catch (error) {
      errorBack.value = error
    }
  }
  async function getSelectModule(payload: object) {
    try {
      selectModule.selected = null
        const { data } = await axiosInstance('/base/selector/submodule', {
        params: payload
      })
      selectModule.data = data.data
    } catch (error) {
      errorBack.value = error
    }
  }

  return {
    selectStatus,
    selectRoleUser,
    selectCurrency,
    selectModule,
    errorBack,
    getSelectStatus,
    getSelectRoleUser,
    getSelectCurrency,
    getSelectModule
  }
})