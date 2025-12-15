import { defineStore } from 'pinia'
import { ref } from 'vue'
import { utils } from 'uikit-3it-vue'
import type { Logotipo } from 'uikit-3it-vue'

//Factory
import { defaultLogotipo } from '@/factories'

// Utils
const { handleThemeColors, handleThemeLogos } = utils.useTheme()

export const useStoreTheme = defineStore('theme', () => {
  //State
  const logotipo = ref<Logotipo>({ ...defaultLogotipo })
  const colorTheme = ref({})
  const errorBack = ref<Error | null>(null)

  //Actions
  const getTheme = async () => {
    try {
      // Colores minimalistas y neutros
      handleThemeColors([
        '#4A5568', // Light theme: --eit-c-primary (gris azulado)
        '#718096', // Light theme: --eit-c-secondary (gris medio)
        '#2D3748', // Light theme: --eit-c-tertiary (gris oscuro)
        '#4A5568', // Dark theme: --eit-c-dark-primary
        '#718096', // Dark theme: --eit-c-dark-secondary
        '#2D3748'  // Dark theme: --eit-c-dark-tertiary
      ])
      logotipo.value = handleThemeLogos([
        // Light logos
        '/img/logo-light.svg',
        '/img/isotipo-light.svg',
        // Dark logos
        '/img/logo-dark.svg',
        '/img/isotipo-dark.svg'
      ])
    } catch (error) {
      errorBack.value = error as Error
    }
  }

  return {
    logotipo,
    colorTheme,
    errorBack,
    getTheme
  }
})