import type { TableData, TablePaginator, TableSort } from 'uikit-3it-vue'

//Table sort
const initialSort: TableSort = {
  key: '',
  keys: [],
  index: 0,
  asc: false
}
//Table paginator
const initialPaginator: TablePaginator = {
  currentPage: '',
  finalPage: '',
  total: 0
}
//Function
export function createTableData<T>(columns: string[]): TableData<T> {
  return {
    columns,
    data: [],
    actions: [],
    paginator: { ...initialPaginator },
    sort: { ...initialSort }
  }
}
