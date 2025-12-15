import type { AxiosError } from 'axios'
import type { ErrorBack } from 'uikit-3it-vue'

interface StatusEnableDisable {
  status: boolean
}

export interface RecordEnableDisable {
  recordStatus: StatusEnableDisable
  [key: string]: unknown
}

export interface StoreEnableDisable {
  loadingDialog: boolean
  loadingBtnDialog: boolean
  disabledSubmit: boolean
  messageDialogAlert: {
    icon?: string
    variant: string
    message: string
    iconClass?: string
  }
  errorBack: AxiosError<ErrorBack> | null
}

export interface CustomRecordEnableDisable {
  icon?: string
  title?: string
  subtitle?: string
}