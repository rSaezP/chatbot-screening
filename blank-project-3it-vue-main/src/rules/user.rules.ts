import { composables } from 'uikit-3it-vue'
import type { ValidatorRules } from 'uikit-3it-vue'
import type { UserForm } from '@/interfaces'

const { 
  requiredString,
  requiredObject
} = composables.useRequired()

export const userRules: ValidatorRules<UserForm> = {
  identification: requiredString('RUT'),
  firstName: requiredString('Nombre'),
  lastName: requiredString('Apellido'),
  roleId: requiredObject('Rol'),
}