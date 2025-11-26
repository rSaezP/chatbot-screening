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
      // 3IT Corporate colors
      handleThemeColors([
        '#5150c0', // Light theme: --eit-c-primary
        '#3fcfdf', // Light theme: --eit-c-secondary
        '#8857c5', // Light theme: --eit-c-tertiary
        '#5150c0', // Dark theme: --eit-c-dark-primary
        '#2d99a5', // Dark theme: --eit-c-dark-secondary
        '#af90d1'  // Dark theme: --eit-c-dark-tertiary
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