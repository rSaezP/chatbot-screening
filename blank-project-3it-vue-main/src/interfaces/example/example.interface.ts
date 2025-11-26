import type { AlertsCore, SelectFilter } from 'uikit-3it-vue'
import type { UserForm } from '@/interfaces'

export interface ExampleFormDialogProps {
  form: UserForm
  selectors?: SelectFilter
  errorForm?: boolean
  submittedForm?: boolean
  alertMessage?: AlertsCore
}