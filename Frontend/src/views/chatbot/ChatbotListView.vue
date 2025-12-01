<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreChatbot } from '@/stores'
import InvitacionDialogComponent from '@/components/chatbot/InvitacionDialogComponent.vue'
import type { Chatbot } from '@/interfaces'

const router = useRouter()
const store = useStoreChatbot()

// State para el dialog de invitaciones
const dialogInvitacion = ref<any>(null)
const chatbotSeleccionado = ref<Chatbot | null>(null)
const resultadoEnvio = ref<any>(null)

// State para el dialog de confirmación de eliminación
const dialogEliminar = ref<any>(null)
const chatbotAEliminar = ref<number | null>(null)

onMounted(async () => {
  await store.getChatbots()
})

function crearNuevo() {
  router.push('/chatbots/new')
}

function editar(id: number) {
  router.push(`/chatbots/edit=${id}`)
}

function abrirDialogEliminar(id: number) {
  chatbotAEliminar.value = id
  dialogEliminar.value?.showDialog()
}

async function confirmarEliminar() {
  if (!chatbotAEliminar.value) return
  
  const id = chatbotAEliminar.value
  dialogEliminar.value?.closeDialog()
  
  try {
    await store.mutationDeleteChatbot(id)
    store.messageToast = {
      message: 'Chatbot eliminado exitosamente',
      variant: 'success',
      icon: 'fa-solid fa-check'
    }
  } catch (error: any) {
    const mensaje = error.response?.data?.message || 'Error al eliminar el chatbot'
    store.messageToast = {
      message: mensaje,
      variant: 'danger',
      icon: 'fa-solid fa-exclamation-triangle'
    }
    console.error('Error al eliminar:', error)
  } finally {
    chatbotAEliminar.value = null
  }
}

function cancelarEliminar() {
  dialogEliminar.value?.closeDialog()
  chatbotAEliminar.value = null
}

function abrirDialogInvitacion(chatbot: Chatbot) {
  chatbotSeleccionado.value = chatbot
  resultadoEnvio.value = null
  dialogInvitacion.value?.showDialog()
}

async function enviarInvitaciones(emails: string[]) {
  if (!chatbotSeleccionado.value?.id) return

  try {
    const resultado = await store.mutationEnviarInvitaciones(chatbotSeleccionado.value.id, emails)
    resultadoEnvio.value = resultado
    
    if (resultado.success) {
      alert(`✅ ${resultado.enviados} invitación(es) enviada(s) exitosamente`)
      dialogInvitacion.value?.closeDialog()
    } else {
      alert(`⚠️ ${resultado.message}\n${resultado.enviados} enviados, ${resultado.fallidos} fallidos`)
    }
  } catch (error: any) {
    const mensaje = error.response?.data?.message || 'Error al enviar invitaciones'
    alert(`❌ ${mensaje}`)
  }
}

function cerrarDialog() {
  dialogInvitacion.value?.closeDialog()
  chatbotSeleccionado.value = null
  resultadoEnvio.value = null
}
</script>

<template>
  <div data-eit-p="5">
    <!-- Header -->
    <div data-eit-mb="5">
      <h1 
        data-eit-font="primary"
        data-eit-font-size="x7"
        data-eit-color="text"
        data-eit-font-weight="900"
        data-eit-mt="0"
        data-eit-mb="2"
      >
        Chatbots Creados
      </h1>
      <p data-eit-color="text-soft" data-eit-font-size="x3" data-eit-mb="0">
        Gestiona tus chatbots de evaluación
      </p>
    </div>

    <!-- Loading -->
    <div v-if="store.loadingTable" data-eit-text-align="center" data-eit-p="5">
      <p data-eit-color="text-soft">Cargando chatbots...</p>
    </div>

    <!-- Error -->
    <AlertComponent
      v-if="store.errorBack"
      data-eit-variant="danger"
      data-eit-mb="4"
      icon="fa-solid fa-exclamation-triangle"
      message="Error al cargar los chatbots"
    />

    <!-- Lista de Chatbots -->
    <div 
      v-if="!store.loadingTable && store.chatbots.length > 0"
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;"
    >
      <div 
        v-for="chatbot in store.chatbots"
        :key="chatbot.id"
        data-eit-border="all"
        data-eit-border-color="default"
        data-eit-border-radius="x2"
        data-eit-p="3"
        data-eit-display="flex"
        data-eit-flex-direction="column"
      >
        <!-- Título -->
        <h3 
          data-eit-font-size="x3" 
          data-eit-mt="0" 
          data-eit-mb="2" 
          data-eit-color="text" 
          data-eit-font-weight="600"
          style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        >
          {{ chatbot.nombre }}
        </h3>

        <!-- Descripción -->
        <p 
          v-if="chatbot.descripcion"
          data-eit-font-size="x2" 
          data-eit-color="text-soft" 
          data-eit-mb="3"
          style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.5rem;"
        >
          {{ chatbot.descripcion }}
        </p>
        <div v-else data-eit-mb="3" style="min-height: 2.5rem;"></div>

        <!-- Detalles -->
        <div data-eit-mb="3">
          <div data-eit-mb="1">
            <span data-eit-font-size="x1" data-eit-color="text-soft">Asistente: </span>
            <span data-eit-font-size="x2" data-eit-color="text">{{ chatbot.nombre_asistente }}</span>
          </div>
          <div data-eit-mb="1">
            <span data-eit-font-size="x1" data-eit-color="text-soft">Vigencia: </span>
            <span data-eit-font-size="x2" data-eit-color="text">{{ chatbot.duracion_dias }} días</span>
          </div>
          <div data-eit-mb="1">
            <span data-eit-font-size="x1" data-eit-color="text-soft">Umbral: </span>
            <span data-eit-font-size="x2" data-eit-color="text">{{ chatbot.umbral_aprobacion }}%</span>
          </div>
          <div>
            <span data-eit-font-size="x1" data-eit-color="text-soft">Preguntas: </span>
            <span data-eit-font-size="x2" data-eit-color="text">{{ chatbot.preguntas?.length || 0 }}</span>
          </div>
        </div>

        <!-- Botones -->
        <div data-eit-display="flex" data-eit-flex-direction="column" data-eit-gap="2" style="margin-top: auto;">
          <ButtonComponent
            data-eit-variant="blue"
            text="Invitar Candidatos"
            icon="fa-solid fa-paper-plane"
            @emitEvent="abrirDialogInvitacion(chatbot)"
          />
          <div data-eit-display="flex" data-eit-gap="2">
            <ButtonComponent
              data-eit-variant="gray"
              data-eit-outline
              text="Editar"
              icon="fa-solid fa-edit"
              @emitEvent="editar(chatbot.id!)"
              style="flex: 1;"
            />
            <ButtonComponent
              data-eit-variant="gray"
              data-eit-outline
              text="Eliminar"
              icon="fa-solid fa-trash"
              @emitEvent="abrirDialogEliminar(chatbot.id!)"
              style="flex: 1;"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Sin chatbots -->
    <div 
      v-if="!store.loadingTable && store.chatbots.length === 0"
      data-eit-text-align="center"
      data-eit-p="5"
    >
      <font-awesome-icon 
        icon="fa-solid fa-robot"
        data-eit-font-size="x9"
        data-eit-color="text-soft"
        data-eit-mb="3"
      />
      <h3 data-eit-color="text" data-eit-mb="2">No hay chatbots creados</h3>
      <p data-eit-color="text-soft" data-eit-mb="4">
        Crea tu primer chatbot para comenzar a evaluar candidatos
      </p>
      <ButtonComponent
        data-eit-variant="blue"
        text="Crear Primer Chatbot"
        icon="fa-solid fa-plus"
        @emitEvent="crearNuevo"
      />
    </div>

    <!-- Dialog de Invitaciones -->
    <DialogComponent
      ref="dialogInvitacion"
      class="eit-dialog--top eit-dialog--large"
      style="max-height: 90vh; overflow-y: auto;"
    >
      <template #content>
        <InvitacionDialogComponent
          v-if="chatbotSeleccionado"
          :chatbot-id="chatbotSeleccionado.id!"
          :chatbot-nombre="chatbotSeleccionado.nombre"
          :loading="store.loadingBtnDialog"
          @enviar="enviarInvitaciones"
          @cerrar="cerrarDialog"
        />
      </template>
    </DialogComponent>

    <!-- Dialog de Confirmación de Eliminación -->
    <DialogComponent
      ref="dialogEliminar"
      class="eit-dialog--center"
    >
      <template #content>
        <div data-eit-p="4">
          <h3 data-eit-font-size="x4" data-eit-color="text" data-eit-mt="0" data-eit-mb="3">
            ¿Eliminar chatbot?
          </h3>
          <p data-eit-color="text-soft" data-eit-mb="4">
            Esta acción no se puede deshacer. El chatbot y todas sus configuraciones serán eliminados permanentemente.
          </p>
          <div data-eit-display="flex" data-eit-gap="2" data-eit-justify="end">
            <ButtonComponent
              data-eit-variant="gray"
              data-eit-outline
              text="Cancelar"
              @emitEvent="cancelarEliminar"
            />
            <ButtonComponent
              data-eit-variant="danger"
              text="Eliminar"
              icon="fa-solid fa-trash"
              :loading="store.loadingBtnDialog"
              @emitEvent="confirmarEliminar"
            />
          </div>
        </div>
      </template>
    </DialogComponent>

    <!-- Toast de Notificaciones -->
    <ToastComponent
      v-if="store.messageToast.message"
      :message="store.messageToast.message"
      :variant="store.messageToast.variant"
      :icon="store.messageToast.icon"
      @close="store.messageToast = {}"
    />
  </div>
</template>
