import type { Permission, FiltersCore, SelectOption } from 'uikit-3it-vue'
import type { MetaDataBase, QueryParamsCore } from '@/interfaces'

//Types
export type SubModuleSelectable = SelectOption | SubModuleRoleForm

export interface SubModuleRoleForm extends Permission {
  id?: number | null
}

export interface SubModuleRoleRaw extends Permission {
  subModuleId: number
  subModuleName: string
}

export type RoleCounts<T extends number | string> = {
  totalUsers: T
  totalModules: T
}

export interface RoleRaw extends RoleCounts<number> {
  id: number
  name: string
  description: string
  subModules: SubModuleRoleRaw[] | null
  status: boolean
  [key: string]: unknown
} 

export interface RoleBase extends MetaDataBase, RoleCounts<string> {
  id: string
  name: string
}

export interface Role extends MetaDataBase, RoleBase {
  description?: string
  subModules?: SubModuleRoleForm[] | null
}

export interface RoleForm {
  id?: number | null
  name: string
  description?: string
  subModules: SelectOption[] | null
}

export interface RoleQueryParams extends QueryParamsCore {
  subModuleId: number | null
  status: boolean | null
}

export interface RoleFilters extends FiltersCore {
  module: number | null
  status: boolean | null
}