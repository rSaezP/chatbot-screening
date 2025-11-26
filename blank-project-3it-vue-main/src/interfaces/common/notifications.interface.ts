export interface CounterNotification {
  inbox: number
	noread: number
}

export interface ModuleNotification {
  name: string
	record_name: string
}

export interface MakeNotification {
  first_name: string
	last_name: string
	profile_name: string
}

export interface NotificationType {
  type: string
	name: string
	icon: string
	color: string
}

export interface NotificationBase {
  id: number
	date: string
	url: string
  read: boolean
  inbox: boolean
	notification: NotificationType
	module: ModuleNotification
	maker: MakeNotification
}