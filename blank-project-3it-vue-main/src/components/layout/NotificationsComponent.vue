<script setup lang="ts">
import { ref, watch } from 'vue'
import { utils } from 'uikit-3it-vue'

import type { NotificationBase } from '@/interfaces'

// Composables
import { useOutsideClick } from '@/composables'

// Utils
const { formatDateAgo } = utils.useFormat()

// Tipos
interface Module {
  name: string
	record_name: string
}

interface Maker {
  first_name: string
	last_name: string
	profile_name: string
}

interface NotificationType {
  type: string
	name: string
	icon: string
	color: string
}

interface Notification {
  id: number
	date: string
	url: string
  read: boolean
  inbox: boolean
	notification: NotificationType
	module: Module
	maker: Maker
}

interface Counter {
  [key: string]: number
}

// Props
const props = defineProps<{
  slide: boolean
  counter: Counter
  notifications: NotificationBase[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'tabChange', value: number): void
  (e: 'markAllAsRead'): void
  (e: 'archiveAll'): void
  (e: 'archiveNotification', registro: Notification): void
  (e: 'markAsRead', registro: Notification): void
  (e: 'markAsNotRead', registro: Notification): void
  (e: 'closeNotificaciones'): void
}>()

// Refs
const notification = ref<HTMLElement | null>(null)
const tab = ref<number>(1)

// Methods

// Notificaciones globales
const handleMarkAllAsRead = () => {
  emit('markAllAsRead')
}

const handleArchiveAll = () => {
  emit('archiveAll')
}

// Notificación individual
const handleArchiveNotification = (registro: Notification, event: MouseEvent) => {
  emit('archiveNotification', registro)
  event.stopPropagation()
}

const handleMarkAsRead = (registro: Notification, event: MouseEvent) => {
  emit('markAsRead', registro)
  event.stopPropagation()
}

const handleMarkAsNotRead = (registro: Notification, event: MouseEvent) => {
  emit('markAsNotRead', registro)
  event.stopPropagation()
}

// Click fuera del panel
useOutsideClick(notification, () => {
  emit('closeNotificaciones')
})

// Watcher
watch(tab, (value) => {
  emit('tabChange', value)
})
</script>


<template>
	<section 
		ref="notification"
		class="notification notification-float eit-box-shadow--bottom"
		:class="props.slide ? 'notification-float-show' : '' "
	>
		<div class="notification-head">
			<h4 
				data-eit-font-size="x5"
				data-eit-color="text"
				data-eit-my="0"
			>
				Notificaciones
			</h4>
			<DropdownComponent 
				position="right"
				btnClass="eit-btn-action"
				data-eit-display='none'
				data-eit-display-lg='inline'
			>
				<template #button>
					<font-awesome-icon 
						icon="fa-solid fa-ellipsis"
					/>
				</template>
				<template #list>
					<div data-eit-mx='2'>
						<a 
							@click="handleMarkAllAsRead"
							class="eit-dropdown__item" 
							href="javascript:"
						>
							<font-awesome-icon 
								icon="fa-regular fa-circle-check" 
								data-eit-me="1"
							/>
							Marcar todo como leído
						</a>
						<a 
							@click="handleArchiveAll"
							class="eit-dropdown__item" 
							href="javascript:"
						>
							<font-awesome-icon 
								icon="fa-solid fa-box-archive" 
								data-eit-me="1"
							/>
							Archivar todo
						</a>
						<a 
							class="eit-dropdown__item" 
							href="javascript:"
						>
							<font-awesome-icon 
								icon="fa-solid fa-gear" 
								data-eit-me="1"
							/>
							Ajustes
						</a>
					</div>
				</template>
			</DropdownComponent>
		</div>
		<div class="notification-filter">
			<ul class="notification-tab">
				<li 
					class="notification-tab-item"
					data-eit-me="4"
				>
					<a 
						@click="tab = 1"
						href="javascript:"
						class="notification-tab-item-link"
						:class="tab === 1 ? 'active' : '' "
					>
						Inbox
						<span 
							v-if="counter.inbox > 99"
							class="notification-tab-item-link-pill">
							+99
						</span>
						<span 
							v-if="counter.inbox < 100"
							class="notification-tab-item-link-pill">
							{{ counter.inbox }}
						</span>
					</a>
				</li>
				<li 
					class="notification-tab-item"
					data-eit-me="4"
				>
					<a 
						@click="tab = 2"
						href="javascript:"
						class="notification-tab-item-link"
						:class="tab === 2 ? 'active' : '' "
					>
						No leído
						<span 
							v-if="props.counter.noread > 99"
							class="notification-tab-item-link-pill">
							+99
						</span>
						<span 
							v-if="props.counter.noread < 100"
							class="notification-tab-item-link-pill"
						>
							{{ props.counter.noread }}
						</span>
					</a>
				</li>
				<li class="notification-tab-item">
					<a 
						@click="tab = 3"
						href="javascript:"
						class="notification-tab-item-link"
						:class="tab === 3 ? 'active' : '' "
					>
						Archivado
					</a>
				</li>
			</ul>
		</div>
		<div class="notification-body">
			<ul 
				class="notification-list"
				data-eit-my="3"
			>
				<li 
					v-for="item in props.notifications" :key="item.id"
					class="notification-list-item"
					data-eit-display="flex"
					data-eit-align="center"
					>
					<div data-eit-flex-grow='1'>
						<a 
							class="notification-list-item-link"
							data-eit-display="flex"
							href="javascript:"
						>
							<div data-eit-flex-shrink='0'>
								<span v-if="item.read">
									<font-awesome-icon 
										:icon="item.notification.icon" 
										data-eit-color="text-soft"
										data-eit-font-size="x5"
									/>
								</span>
								<span v-if="!item.read"> 
									<font-awesome-icon 
										:icon="item.notification.icon" 
										:class="item.notification.color"
										data-eit-font-size="x5"
									/>
								</span>
							</div>
							<div 
								data-eit-flex-grow="1"
								data-eit-ms="3"
							>
								<h6 
									data-eit-mt="0"
									data-eit-mb="1"
									data-eit-font-size="x3"
									data-eit-font-weight="500"
									:data-eit-color="item.read ? 'text-soft' : 'text'"
								> 
									{{ item.module.record_name }} 
								</h6>
								<p 
									data-eit-font-size="x2"
									data-eit-color="text-soft"
									data-eit-my="0"
								>
									{{ formatDateAgo(item.date) }} • {{ item.module.name }}
								</p>
							</div>
						</a>
					</div>
					<div 
						data-eit-display='flex'
						data-eit-flex-shrink='0'
						data-eit-align="center"
						data-eit-ms="3"
					>
						<span
							v-if="!item.read"
							data-eit-shape="circle"
							data-eit-bg="secondary"
							data-eit-shape-size='10'
							data-eit-me="3"
						></span>
						<DropdownComponent 
							position="right"
							btnClass="eit-btn-action notification-list-action"
						>
							<template #button>
								<font-awesome-icon 
									icon="fa-solid fa-ellipsis"
								/>
							</template>
							<template #list>
								<div data-eit-mx='2'>
									<a 
										@click="handleMarkAsRead(item, $event)"
										class="eit-dropdown__item" 
										href="javascript:"
									>
										<font-awesome-icon 
											icon="fa-regular fa-circle-check" 
											data-eit-me="1"
										/>
										Marcar como leído
									</a>
									<a 
										@click="handleMarkAsNotRead(item, $event)"
										class="eit-dropdown__item" 
										href="javascript:"
									>
										<font-awesome-icon 
											icon="fa-regular fa-circle" 
											data-eit-me="1"
										/>
										Marcar como no leído
									</a>
									<a 
										@click="handleArchiveNotification(item, $event)"
										class="eit-dropdown__item" 
										href="javascript:"
									>
										<font-awesome-icon 
											icon="fa-solid fa-box-archive" 
											data-eit-me="1"
										/>
										Archivar
									</a>
								</div>
							</template>
						</DropdownComponent>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>
<style>

	.notification {
		position: fixed;
		border: 1px solid;
		z-index: 1;
		border-color: var(--eit-color-bg-mute);
		background-color: var(--eit-color-bg-soft);
	}

	.notification-float {
		visibility: hidden;
		opacity: 0;
		transition: bottom 0.2s ease-in-out, opacity 0.2s ease-in-out;
	}

	@media (max-width: 767px) {
		.notification-float {
			left: 0;
			margin: 0 4%;
			bottom: -10px;
			height: 80%;
			width: 92%;
			border-radius: 20px 20px 0 0;
		}

		.notification-float-show {
			bottom: 0;
		}
	}

	@media (min-width: 768px) {
		.notification-float {
			right: 20px;
			top: 90px;
			width: 550px;
			height: calc(100vh - 200px);
			border-radius: 10px;
			transition: top 0.2s ease-in-out, opacity 0.2s ease-in-out;
		}

		.notification-float-show {
			top: 80px;
		}
	}

	.notification-float-show {
		visibility: visible;
		opacity: 1;
	}

	.notification-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
	}

	.notification-filter {
		padding: 0 20px;
		border-bottom: 2px solid;
		border-color: var(--eit-color-bg-mute);
	}

	.notification-tab {
		list-style: none;
		padding: 0;
		margin: 0 0 -2px 0;
	}

	.notification-tab-item {
		display: inline-block;
	}

	.notification-tab-item-link {
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		padding: 0;
		color: var(--eit-color-text-soft);
		border-color: var(--eit-color-bg-mute);
		text-decoration: none;
		transition: color 0.2s ease-in;
	}

	.notification-tab-item-link:hover {
		color: var(--eit-color-text);
	}

	.notification-tab-item-link.active {
		color: var(--eit-color-secondary);
		border-bottom: 2px solid var(--eit-color-secondary);
	}

	.notification-tab-item-link.active .notification-tab-item-link-pill {
		color: var(--eit-color-white);
		background-color: var(--eit-color-secondary);
	}

	.notification-tab-item-link-pill {
		margin-left: 10px;
		padding: 0 5px;
		text-align: center;
		min-width: 22px;
		font-size: 12px;
		font-weight: 700;
		color: var(--eit-color-text-soft);
		background-color: var(--eit-color-bg-mute);
		opacity: 0.5;
		border-radius: 3px;
	}

	.notification-body {
		padding: 0 20px;
		height: calc(100vh - 320px);
		overflow-y: auto;
	}

	.notification-list {
		list-style: none;
		padding: 0;
	}

	.notification-list-item {
		padding: 10px;
		border-radius: 10px;
		transition: background-color 0.2s ease-in;
	}

	.notification-list-item:hover {
		background-color: var(--eit-color-bg-mute);
	}

	.notification-list-item:hover .notification-list-action {
		visibility: visible !important;
	}

	.notification-list-item:hover .notification-list-action:hover {
		background-color: var(--eit-color-bg-soft);
	}

	.notification-list-item-link {
		text-decoration: none;
	}

	.notification-list-action {
		visibility: hidden !important;
	}

</style>
