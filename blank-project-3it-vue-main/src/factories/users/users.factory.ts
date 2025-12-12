import type { User, UserForm, UserFilters, UserQueryParams } from '@/interfaces'

export const initialFiltersUser: UserFilters = {
  page: 1,
  search: '',
  role: null,
  status: null,
  publicationStart: null,
  publicationEnd: null,
  currency: null,
  date: null
}

export const initialQueryParamsUser: UserQueryParams = {
  page: 0,
  size: 8,
  sort: 'createdAt,desc',
  search: '',
  roleId: null,
  status: null
}

export const initialUser: User = {
  id: '',
  workEmail: '',
  name: '',
  phoneNumber: '',
  identification: '',
  identificationTypeId: 1,
  role: { id: 0, name: '' },
  recordStatus: { name: '', className: '', status: false },
  phantomKey: { id: 0, url: '', status: false }
}

export const initialUserForm: UserForm = {
  id: null,
  workEmail: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  identification: '',
  identificationTypeId: 1,
  roleId: null,
  date: null
}