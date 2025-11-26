import type { BaseAction } from 'uikit-3it-vue'

export default function useTableCustomAction<T = unknown>() {
  function actionViewUrl(
    handler: (row: T) => void,
    label = 'Ver perfil', 
    actionShow = ''
  ): BaseAction<T> {
    return {
      name: 'viewProfile',
      label,
      icon: 'fa-solid fa-graduation-cap',
      iconClass: 'eit-color--blue',
      handler,
      actionShow
    }
  }
  return { 
    actionViewUrl
  }
}