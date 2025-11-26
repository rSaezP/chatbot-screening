import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

import type { CounterNotification, NotificationBase } from '@/interfaces'

export const useStoreNotification = defineStore('notification', () => {
  //State
  const counter = ref<CounterNotification>({ inbox: 0, noread: 0 })
  const notifications = ref<NotificationBase[]>([])
  const tab = ref<number>(1)
  const errorBack = ref<unknown | null>(null)

  // Actions
  const getNotifications = async () => {
    try {
      const response = await fetch(`/db/notification/notification.json`)
      const data = await response.json()
      counter.value = data.counter
      notifications.value = data.notifications
    } catch (error) {
      errorBack.value = error
    }
  }

  const captureTab = (newTab: number) => {
    tab.value = newTab
  }

  const mutationMarkAllAsRead = () => {
    notifications.value.forEach(obj => {
      obj.read = true
    })
  }

  const mutationArchiveAll = () => {
    notifications.value.forEach(obj => {
      obj.read = true
      obj.inbox = false
    })
  }

  const mutationArchiveNotification = (payload: NotificationBase) => {
    payload.read = true
    payload.inbox = false
  }

  const mutationMarkAsRead = (payload: NotificationBase) => {
    payload.read = true
  }

  const mutationMarkAsNotRead = (payload: NotificationBase) => {
    payload.read = false
    payload.inbox = true
  }

  const filterNotifications = computed(() => {
    if (tab.value === 1) {
      return notifications.value.filter(item => item.inbox)
    }
    if (tab.value === 2) {
      return notifications.value.filter(item => !item.read && item.inbox)
    }
    if (tab.value === 3) {
      return notifications.value.filter(item => !item.inbox)
    }
    return notifications.value
  })

  return {
    //state
    counter,
    notifications,
    tab,

    //actions
    getNotifications,
    captureTab,
    mutationMarkAllAsRead,
    mutationArchiveAll,
    mutationArchiveNotification,
    mutationMarkAsRead,
    mutationMarkAsNotRead,

    //computed
    filterNotifications,
  }
})
