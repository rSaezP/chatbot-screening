
import type { SelectOption, SelectFilter } from 'uikit-3it-vue'

export const selectCore = {
  placeholder: 'Seleccionar',
  selected: null,
  clearable: true,
  disabled: false,
  data: [] as SelectOption[]
}

export const selectStatusBase: SelectFilter = {
  ...selectCore,
  type: 'select',
  key: 'status',
  filter: 'Estado'
}

export const selectRoleUserBase: SelectFilter = {
  ...selectCore,
  type: 'select',
  key: 'role',
  filter: 'Rol'
}
export const selectCurrencyBase: SelectFilter = {
  ...selectCore,
  type: 'select',
  key: 'currency',
  filter: 'Moneda',
  multiple: true
}
export const selectModuleBase: SelectFilter = {
  ...selectCore,
  type: 'select',
  key: 'module',
  filter: 'Módulo'
}