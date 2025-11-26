
import type { 
  FiltersCore, 
  DateFilter, 
  RangeFilter,
  SwitchFilter
} from 'uikit-3it-vue'

export const initialFilters: FiltersCore = {
  page: 1,
  search: ''
}

export const dateFilterBase: DateFilter = {
  type: 'date',
  key: 'dateFilter',
  filter: 'Fecha',
  input: null,
  minDate: '',
  maxDate: ''
}

export const rangeFilterBase: RangeFilter = {
  type: 'range',
  key: 'rangeFilter',
  filter: 'Fecha rango',
  start: {
    type: 'date',
    key: 'startKey',
    filter: 'Fecha inicio',
    input: null
  },
  end: {
    type: 'date',
    key: 'endKey',
    filter: 'Fecha término',
    input: null,
  }
}

export const switchFilterBase: SwitchFilter = {
  type: 'switch',
  key: 'switch',
  filter: 'Switch',
  input: null,
  tooltip: 'Activar / Desactivar'
}