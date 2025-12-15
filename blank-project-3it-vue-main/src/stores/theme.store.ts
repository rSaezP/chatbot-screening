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
      handleThemeColors([
        // Light colors
        '#005AEE',
        '#3BC0CF',
        '#3BC0CF',
        // Dark colors
        '#005AEE',
        '#3BC0CF',
        '#3BC0CF'
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