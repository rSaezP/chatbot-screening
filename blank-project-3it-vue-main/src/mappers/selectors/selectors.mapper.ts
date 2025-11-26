import { utils } from 'uikit-3it-vue'
import type { SelectOption } from 'uikit-3it-vue'

//Utils
const { formatCapitalize } = utils.useFormat()

export function mapperSelectRoles(result: SelectOption[]) {
  const interfaz = result.filter((item) => {
    if (item.name !== 'Founder') {
      return {
        id: item.id,
        name: formatCapitalize(item.name)
      }
    }
  })
 return interfaz
}