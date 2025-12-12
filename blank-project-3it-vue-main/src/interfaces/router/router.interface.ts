import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    layout: string
    requiresAuth: boolean
    permissionType: 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'
    requiresPermissions?: boolean
    module: string
    parent: string
  }
}