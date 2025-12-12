<script setup lang="ts">
	import { useStoreAuth, useStoreTheme } from '@/stores'
	import { ref, computed } from 'vue'
  import router from '@/router'
  import { utils, composables } from 'uikit-3it-vue'

  //Components
  import { FooterComponent } from '@/components'

	//Stores
	const storeAuth = useStoreAuth()
  const storeTheme = useStoreTheme()
  
  const storeAuthTheme = ref({
    config: {
      darkTheme: storeAuth.config.darkTheme
    }
  })
  const storeLogoTheme = ref({
    logotipo: storeTheme.logotipo
  })
  const { logotipo } = composables.useLogos(storeAuthTheme.value, storeLogoTheme.value)
  const { validateDefault } = utils.useValidator()

  //Get Stores
  storeTheme.getTheme()

  //** Variables **/
	const form = ref({ email: '', password: '' })
  const remindMe = ref(false)

  const showPassword = ref(false)

	const controlIsValidForm = computed(() => {
		return Object.entries(form.value).every(([, value]) => value)
	})

  const controlLoginAlert = computed(() => {
		return storeAuth.loginError ? 'show' : 'hide'
	})

	/** Methods **/

  //Handles
  const handleEmailValue = (value: string) => {
		form.value.email = value
	}
  const handlePasswordValue = (value: string) => {
		form.value.password = value
	}
  const handleRecovery = () => {
    router.push('/recovery')
    storeAuth.loginError = false
	}

  const handleVisiblePass = () => {
		showPassword.value = !showPassword.value;
	}

  //Handles Alert
  const handleMessageAlert = async () => {
    if(storeAuth.loginError) {
      storeAuth.messageAlert = {
        icon: "fa-solid fa-arrow-down",
        variant: "error",
        message: "El <strong>usuario o contraseña</strong> son incorrectos."
      }
    }
  }

  //Submit
  const submitForm = async () => {
    if(controlIsValidForm.value) {
      await storeAuth.login(form.value)
      if(storeAuth.loginError) handleMessageAlert()
    }
    else {
      storeAuth.loginError = true
      handleMessageAlert()
    }
  }
</script>

<template>
  <section 
    id="login" 
    class="public-page"
  >
  <div
    data-eit-mb="3"
    data-eit-text-align='center'
  >
    <img 
      :src="logotipo"
      class="public-page__logo"
    >
      <h2 
        data-eit-font-size="x7"
        data-eit-color="text"
        data-eit-my="0"
      >
        Hola, <strong>inicia sesión</strong>
      </h2>
      <h6 
        data-eit-font-size="x3"
        data-eit-font-weight="500"
        data-eit-font="primary"
        data-eit-color="text-soft"
        data-eit-my="2"
      >
        Ingresando los datos de tu cuenta corporativa
      </h6>
  </div>
  <form @submit.prevent="submitForm">
    <AlertComponent
      :data-eit-variant="storeAuth.messageAlert.variant"
      :data-eit-animation="controlLoginAlert"
      :icon="storeAuth.messageAlert.icon"
      :message="storeAuth.messageAlert.message"
    />
      <div data-eit-my="3">
        <InputComponent 
          inputType="text"
          floatLabel="Correo electrónico"
          :validation="validateDefault"
          :requiredField="true"
          :error="storeAuth.loginError"
          @emitValue="handleEmailValue"
        />
      </div>
      <div data-eit-mb="3">
        <InputComponent
          :inputType="showPassword ? 'text' : 'password'"
          floatLabel="Contraseña"
          floatRight
          :validation="validateDefault"
          :requiredField="true"
          :error="storeAuth.loginError"
          @emitValue="handlePasswordValue"
        >
        <template #float-right>
          <a 
            @click="handleVisiblePass()"
            href="javascript:"
            data-eit-color="text-soft"
            data-eit-link
          >
            <font-awesome-icon 
              v-if="!showPassword"
              icon="fa-regular fa-eye-slash"
            />  
            <font-awesome-icon 
              v-if="showPassword"
              icon="fa-regular fa-eye"
            />  
          </a> 
        </template>
        </InputComponent>
      </div> 
      <div 
        data-eit-mb="3"
        data-eit-display="flex"
        data-eit-justify="between"
        data-eit-align="center"
      >
        <label class="eit-checkbox">
          <input 
            type="checkbox" 
            v-model="remindMe"
            class="eit-checkbox__input"
          >
          <span class="eit-checkbox__checkmark"></span>
          Recordarme
        </label>
        <a 
          href="javascript:"
          data-eit-font-size="x2"
          data-eit-color="secondary"
          data-eit-link
          @click="handleRecovery"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <ButtonComponent
        data-eit-w="100"
        data-eit-variant="primary"
        text="Iniciar sesión"
        loadingText="Accediendo..."
        :isDisabled="storeAuth.loginSubmitting"
        :loading="storeAuth.loginSubmitting"
        @emitEvent="submitForm"
      />
      <div 
        data-eit-border="all"
        data-eit-border-color="default"
        data-eit-border-radius="x3"
        data-eit-p="2"
        data-eit-mb="3"
        data-eit-bg="color-soft"
        data-eit-text-align="center"
        data-eit-mt="3"
      >
        <p 
          data-eit-color="text-soft"
          data-eit-m="0"
        >
          <strong>Admin →</strong> user: <code>adminTest@3it.cl</code> pass: <code>admin2025</code>
        </p>
      </div>
    </form>
  </section> 
  <FooterComponent/>
</template>
