import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosError } from 'axios'
import { ref, reactive } from 'vue'

// Interfaces
import type { AlertsCore, ErrorBack } from 'uikit-3it-vue'
import type { Chatbot, Pregunta, Sesion } from '@/interfaces'

// Factories
import {
  initialChatbot,
  initialPregunta,
  initialAlert
} from '@/factories'

// Services
import { chatbotService } from '@/services'

export const useStoreChatbot = defineStore('storeChatbot', () => {

  // ========== STATE ==========

  // Data
  const chatbots = ref<Chatbot[]>([])
  const chatbot = ref<Chatbot>({ ...initialChatbot })
  const sesiones = ref<Sesion[]>([])

  // UI State
  const slideFilter = ref(false)
  const slideDetail = ref(false)
  const slideForm = ref(false)
  const smallSize = ref(false)

  // Messages
  const messageToast = ref<Record<string, unknown>>({})
  const messageAlert = ref<AlertsCore>({ ...initialAlert })
  const messageDialogAlert = ref<AlertsCore>({ ...initialAlert })

  // Loading States
  const loadingTable = ref(true)
  const loadingFilters = ref(true)
  const loadingBtnFilters = ref(false)
  const loadingDetail = ref(true)
  const loadingForm = ref(true)
  const loadingBtnForm = ref(false)
  const loadingDialog = ref(true)
  const loadingBtnDialog = ref(false)

  // Disabled States
  const disabledSubmit = ref(false)

  // Error
  const errorBack = ref<AxiosError<ErrorBack> | null>(null)

  // ========== ACTIONS - CHATBOTS ==========

  /**
   * Obtener todos los chatbots
   */
  const getChatbots = async () => {
    try {
      loadingTable.value = true
      errorBack.value = null
      chatbots.value = await chatbotService.getAll()
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingTable.value = false
    }
  }

  /**
   * Obtener un chatbot por ID para vista detalle
   */
  const getChatbotById = async (id: number) => {
    try {
      loadingDetail.value = true
      errorBack.value = null
      chatbot.value = await chatbotService.getById(id)
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingDetail.value = false
    }
  }

  /**
   * Obtener un chatbot por ID para formulario de edición
   */
  const getChatbotForm = async (id: number) => {
    try {
      loadingForm.value = true
      errorBack.value = null
      chatbot.value = await chatbotService.getById(id)
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingForm.value = false
    }
  }

  /**
   * Crear un nuevo chatbot
   */
  const mutationCreateChatbot = async (payload: Chatbot) => {
    try {
      errorBack.value = null
      loadingBtnForm.value = true
      const result = await chatbotService.create(payload)
      chatbot.value = result
      return result
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
      throw error
    } finally {
      loadingBtnForm.value = false
    }
  }

  /**
   * Actualizar un chatbot existente
   */
  const mutationUpdateChatbot = async (id: number, payload: Chatbot) => {
    try {
      errorBack.value = null
      loadingBtnForm.value = true
      const result = await chatbotService.update(id, payload)
      chatbot.value = result
      return result
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
      throw error
    } finally {
      loadingBtnForm.value = false
    }
  }

  /**
   * Eliminar un chatbot
   */
  const mutationDeleteChatbot = async (id: number) => {
    try {
      errorBack.value = null
      loadingBtnDialog.value = true
      await chatbotService.delete(id)
      chatbots.value = chatbots.value.filter(c => c.id !== id)
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
      throw error
    } finally {
      loadingBtnDialog.value = false
    }
  }

  // ========== ACTIONS - SESIONES ==========

  /**
   * Obtener sesiones con filtros opcionales
   */
  const getSesiones = async (filtros?: Record<string, any>) => {
    try {
      loadingTable.value = true
      errorBack.value = null
      sesiones.value = await chatbotService.getSesiones(filtros)
    } catch (error) {
      if (axios.isAxiosError(error)) errorBack.value = error
      else errorBack.value = null
    } finally {
      loadingTable.value = false
    }
  }

  // ========== UI HANDLERS ==========

  const handleSlideFilter = () => {
    slideDetail.value = false
    slideForm.value = false
    slideFilter.value = true
    loadingFilters.value = false
  }

  const handleSlideDetail = () => {
    slideFilter.value = false
    slideForm.value = false
    slideDetail.value = true
  }

  const handleSlideForm = () => {
    slideFilter.value = false
    slideDetail.value = false
    slideForm.value = true
  }

  const handleCloseSlide = () => {
    slideFilter.value = false
    slideDetail.value = false
    slideForm.value = false
  }

  /**
   * Resetear el chatbot actual a valores iniciales
   */
  const resetChatbot = () => {
    chatbot.value = { ...initialChatbot }
  }

  /**
   * Resetear todo el store
   */
  const resetStore = () => {
    chatbots.value = []
    chatbot.value = { ...initialChatbot }
    sesiones.value = []
    errorBack.value = null
    slideFilter.value = false
    slideDetail.value = false
    slideForm.value = false
  }

  return {
    // State - Data
    chatbots,
    chatbot,
    sesiones,

    // State - UI
    slideFilter,
    slideDetail,
    slideForm,
    smallSize,

    // State - Messages
    messageToast,
    messageAlert,
    messageDialogAlert,

    // State - Loading
    loadingTable,
    loadingFilters,
    loadingBtnFilters,
    loadingDetail,
    loadingForm,
    loadingBtnForm,
    loadingDialog,
    loadingBtnDialog,

    // State - Disabled
    disabledSubmit,

    // State - Error
    errorBack,

    // Actions - Queries
    getChatbots,
    getChatbotById,
    getChatbotForm,
    getSesiones,

    // Actions - Mutations
    mutationCreateChatbot,
    mutationUpdateChatbot,
    mutationDeleteChatbot,

    // UI Handlers
    handleSlideFilter,
    handleSlideDetail,
    handleSlideForm,
    handleCloseSlide,

    // Reset
    resetChatbot,
    resetStore
  }
})
