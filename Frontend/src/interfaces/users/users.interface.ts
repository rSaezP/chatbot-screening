import type { FiltersCore } from 'uikit-3it-vue'
import type { QueryParamsCore } from '@/interfaces'

export interface UserRole {
  id: number
  name: string
  className?: string
}

export interface IdentificationData {
  identification: string
  identificationTypeId: number
}

export interface PersonalInfo {
  workEmail: string
  firstName: string
  lastName: string
  phoneNumber: string
  loginViaSso?: boolean
  createdAt?: string | null
  lastLogin?: string | null
}

export interface UserRaw extends PersonalInfo, IdentificationData {
  id: number
  role: UserRole
  status: boolean
  [key: string]: unknown
}

export interface UserBase {
  id: string
  name: string
  identification: string
  role: UserRole
}

export interface User extends UserBase {
  recordStatus: { name: string, className: string, status: boolean }
  phantomKey: { id: number, url: string, status: boolean }
  [key: string]: unknown
}

export interface UserForm extends PersonalInfo, IdentificationData {
  id?: number | null
  roleId: UserRole | null,
  date: Date | null
}

export interface UserStatus {
  id: number
  status: boolean
}

export interface UserQueryParams extends QueryParamsCore {
  roleId: number | null
  status: boolean | null
}

export interface UserFilters extends FiltersCore {
  role: number | null
  status: boolean | null
  publicationStart: string | null
  publicationEnd: string | null
  currency: string | null
  date: string | null
}