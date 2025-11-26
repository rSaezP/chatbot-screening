import type { RouteLocationNormalized } from 'vue-router'
import type { PermissionAction } from 'uikit-3it-vue'
import { ENVIROMENT } from '@/constants'
import { useStoreAuth } from '@/stores'
import { utils } from 'uikit-3it-vue'

const { modulePermissions } = utils.useAuth()

export async function handleAuthentication(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  storeAuth: ReturnType<typeof useStoreAuth>
): Promise<true | { path: string } | { name: string }> {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresPermissions = to.matched.some(r => r.meta.requiresPermissions)

  // Temporalmente deshabilitado para desarrollo
  // try {
  //   if (requiresAuth && !storeAuth.user && !storeAuth.loadingUser) {
  //     await storeAuth.getCurrentUser()
  //   }
  // } catch (error) {
  //   console.error(error)
  //   return { path: '/login' }
  // }

  if (!storeAuth.user && requiresAuth) return { path: '/login' }
  if (storeAuth.user && !requiresAuth) return { path: '/' }

  if (storeAuth.user && requiresPermissions) {
    const metaPermissionType = to.meta.permissionType as keyof PermissionAction
    const moduleName = to.meta.module

    const userModule = modulePermissions(storeAuth.permissions || []).find(
      m => m.name === moduleName
    )

    if (!userModule || !metaPermissionType || !userModule[metaPermissionType]) {
      return { name: 'unauthorized' }
    }

    if (['Localhost', 'Desarrollo'].includes(ENVIROMENT)) {
      console.log('🔐 Permiso requerido:', metaPermissionType)
      console.log('🎯 Módulo evaluado:', moduleName)
      console.log('👤 Permisos usuario:', userModule)
    }
  }
  return true
}

