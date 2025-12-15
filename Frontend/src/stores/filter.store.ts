// stores/select.store.ts
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { DateFilter, RangeFilter, SwitchFilter } from 'uikit-3it-vue'
import { 
  dateFilterBase,
  rangeFilterBase,
  switchFilterBase
} from '@/factories'

export const useStoreFilter = defineStore('storeFilter', () => {

  const dateFilter = reactive<DateFilter>({ ...dateFilterBase })
  const rangeFilter = reactive<RangeFilter>({ ...rangeFilterBase })
  const switchFilter = reactive<SwitchFilter>({ ...switchFilterBase })
  
  const errorBack = ref<unknown>(null)

  return {
    dateFilter,
    rangeFilter,
    switchFilter,
    errorBack
  }
})