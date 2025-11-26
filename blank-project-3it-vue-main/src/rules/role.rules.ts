import { composables } from 'uikit-3it-vue'
import type { ValidatorRules } from 'uikit-3it-vue'
import type { RoleForm } from '@/interfaces'

const { 
  requiredString,
  requiredObject
} = composables.useRequired()

export const roleRules: ValidatorRules<RoleForm> = {
  name: requiredString('Nombre'),
  subModules: requiredObject('Módulos'),
}