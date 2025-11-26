import type { UserRaw, User, UserForm } from '@/interfaces'
import { utils } from 'uikit-3it-vue'
import useBadge from '@/utils/useBadge'

  //Utils
  const { 
    formatDate,
  } = utils.useFormat()

const { 
  changeRecordStatus, 
  changeBadgeGray 
} = useBadge()

export function mapperUsers(result: UserRaw[]): User[]  {
  return result.map(item => ({
    id: String(item.id),
    name: `${item.firstName} ${item.lastName}`,
    identification: item.identification,
    role: item.role,
    recordStatus: changeRecordStatus(item.status),
    phantomKey: { id: item.id, url: 'https://www.google.com/', status: item.status }
  }))
}

export function mapperUser(result: UserRaw): User {
  return {
    id: String(result.id),
    name: `${result.firstName} ${result.lastName}`,
    workEmail: result.workEmail,
    identification: result.identification,
    phoneNumber: result.phoneNumber,
    role: changeBadgeGray(result.role),
    createdAt: result.createdAt ? formatDate(result.createdAt) : 'S/F',
    lastLogin: result.lastLogin ? formatDate(result.lastLogin) : 'S/F',
    loginViaSso: result.loginViaSso ?? false,
    recordStatus: changeRecordStatus(result.status),
    phantomKey: { id: result.id, url: 'https://www.google.com/', status: result.status }
  }
}

export function mapperUserForm(result: UserRaw): UserForm {
  return {
    id: result.id,
    workEmail: result.workEmail,
    firstName: result.firstName,
    lastName: result.lastName,
    phoneNumber: result.phoneNumber,
    identification: result.identification,
    identificationTypeId: 1,
    roleId: result.role,
    //Dummy
    date: 'New Date()' as unknown as Date
  }
}