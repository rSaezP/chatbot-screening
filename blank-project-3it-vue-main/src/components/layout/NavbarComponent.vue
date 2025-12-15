<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { utils } from 'uikit-3it-vue'

	import type { UserAuthCore } from '@/interfaces'

	const { handleTooltip } = utils.useTooltip()

  export interface NavbarProps {
		user: UserAuthCore | null
		darkTheme: boolean
		slideNotificaction?: boolean
  }

// Props
  const props = withDefaults(defineProps<NavbarProps>(), {
    user: null,
    darkTheme: false,
		slideNotificaction: false
  })
  
	// Emits
	const emit = defineEmits<{
		(e: 'changeDarkTheme'): void
		(e: 'toggleNotificaciones', event: Event): void
	}>()

	const toggleDarkTheme = ref<boolean>(props.darkTheme)

  const toggleNotificaciones = (event: Event) => {
    emit("toggleNotificaciones", event)
  }

	watch(toggleDarkTheme, () => {
		emit('changeDarkTheme')
	})
</script>

<template>
	<nav 
		id="navbar" 
		class="eit-navbar"
		data-eit-display="none"
		data-eit-justify="between"
		data-eit-align="center"
		data-eit-display-md="flex"
	>
		<div class="eit-navbar-left">
			<BreadcrumbComponent/>
		</div>
		<div
			class="eit-navbar-right"
			data-eit-display="flex"
		>
		<ButtonComponent
			text=""
			:class="`eit-btn ${slideNotificaction && 'active'}`"
			data-eit-display="flex"
			data-eit-justify="center"
			data-eit-align="center"
			data-eit-gap='1'
			data-eit-variant='gray'
			data-eit-outline
			data-eit-shape='square'
			data-eit-font-size="x5"
			data-eit-border="clean"
			icon="fa-regular fa-bell"
			@emitEvent="toggleNotificaciones"
			v-tippy="handleTooltip('Notificaciones', true, 'bottom')"
		/>
			<DropdownComponent 
				position="right"
				width="large"
				btnClass="eit-flex eit-ms-3"
			>
				<template #button>
          <AvatarComponent
            width="48"
            data-eit-object-fit='contain'
            data-eit-shape='circle'
          />
				</template>
				<template #list>
					<div 
						data-eit-display="flex"
						data-eit-p="3"
					>
						<div data-eit-flex-shrink='0'>
							<AvatarComponent
								width="60"
								data-eit-object-fit='contain'
								data-eit-border-radius='x3'
							/>
						</div>
						<div 
							data-eit-flex-grow='1'
							data-eit-ms="3"
						>
							<h6 
								data-eit-font-size="x3"
								data-eit-font-weight="500"
								data-eit-color="text"
								data-eit-my="0"
							> 
								{{ user?.firstName }} {{ user?.lastName }} 
							</h6>
							<p 
								data-eit-font-size="x2"
								data-eit-color="text-soft"
								data-eit-my="0"
							>
								{{ user?.email }}<br>
								<small 
									data-eit-border="all"
									data-eit-border-color="default"
									data-eit-border-radius="x3"
									data-eit-px="1"
								> 
									{{ user?.role.name }} 
								</small>
							</p>
						</div>
					</div>
					<div data-eit-px="3">
						<label 
							class="eit-dropdown__item-text eit-cursor--pointer"
							data-eit-display="flex"
							data-eit-justify="between"
							data-eit-align="center"
						>
							<span>
								<font-awesome-icon icon="fa-solid fa-circle-half-stroke"/>
								Tema oscuro
							</span>
							<span class="eit-switch">
								<input
									v-model="toggleDarkTheme"
									type="checkbox"
									class="eit-switch__input"
								>
								<span class="eit-switch__slider"></span>
							</span>
						</label> 
					</div>
					<div class="eit-dropdown-divider"></div>
					<div data-eit-mx="3">
						<a 
							class="eit-dropdown__item" 
							href="/settings"
						>
							<font-awesome-icon 
								icon="fa-solid fa-gear" 
								data-eit-me="2"
							/>
							Administrar tu cuenta
						</a>
					</div>
					<div class="eit-dropdown-divider"></div>
					<div data-eit-mx="3">
						<router-link 
							to="/logout"
							class="eit-dropdown__item" 
						>
							<font-awesome-icon 
								icon="fa-solid fa-right-from-bracket" 
								data-eit-me="2"
							/>
							Cerrar sesión
						</router-link>
					</div>
				</template>
			</DropdownComponent>
		</div>
	</nav>
</template>

<style>

	.eit-navbar {
		grid-area: eit-navbar;
		padding: 15px 25px 0 25px;
	}

	.eit-navbar .btn-link.active {
		color: lch(from var(--eit-color-primary) calc(l - 5) c h);
		background-color: lch(from var(--eit-color-primary) l c h / 0.1);
	}

</style>