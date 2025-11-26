import type { RoleRaw, Role, RoleForm, SubModuleRoleRaw } from '@/interfaces'
import useBadge from '@/utils/useBadge'
import type { SelectOption } from 'uikit-3it-vue'

  //Utils
const { 
  changeRecordStatus,
} = useBadge()

export function mapperRoles(result: RoleRaw[]): Role[]  {
  return result.map(item => ({
    id: String(item.id),
    name: item.name,
    totalUsers: String(item.totalUsers),
    totalModules: String(item.totalModules),
    recordStatus: changeRecordStatus(item.status),
    phantomKey: { id: item.id, status: item.status }
  }))
}

export function mapperRole(result: RoleRaw): Role {
  return {
    id: String(result.id),
    name: result.name,
    description: result.description || 'Sin descrición',
    totalUsers: String(result.totalUsers),
    totalModules: String(result.totalModules),
    subModules: result.subModules ? result.subModules.map((subModule) => ({
      ...subModule,
      id: subModule.subModuleId ?? 0,
      name: subModule.subModuleName ?? 'Sin nombre',

    })) : [],
    recordStatus: changeRecordStatus(result.status),
    phantomKey: { id: result.id, status: result.status }
  }
}

export function mapperRoleForm(result: RoleRaw): RoleForm {
  return {
    id: result.id,
    name: result.name,
    description: result.description,
    subModules: result.subModules ? result.subModules.map((subModule: SubModuleRoleRaw) => ({
      id: subModule.subModuleId ?? 0,
      name: subModule.subModuleName ?? 'Sin nombre',
      description: 'Sin descripción',
      canRead: subModule.canRead ?? true,
      canCreate: subModule.canCreate ?? true,
      canUpdate: subModule.canUpdate ?? true,
      canDelete: subModule.canDelete ?? true
    })) : []
  }
}