<script setup lang="ts">
  import { useStoreRoles, useStoreSelect } from '@/stores'
  import { useRouter, useRoute } from 'vue-router'
  import { ref, computed, watch, onMounted } from 'vue'
  import { utils, composables } from 'uikit-3it-vue'
  import { useFormatCustom } from '@/utils'
  import messages from '@/messages/messages'
  import useBadge from '@/utils/useBadge'
  
  //Types
  import type { CustomRecordEnableDisable } from '@/interfaces'
  import type { TableSort, ToastExpose, DialogExpose } from 'uikit-3it-vue'

  //Interface
  import type { FilterElement, SelectedType } from 'uikit-3it-vue'
  import type { Role } from '@/interfaces'

  //Factories
  import { defaultCustomRecordEnableDisable } from '@/factories'

  //Exclusive Components
  import RoleDetailComponent from '@/components/roles/RoleDetailComponent.vue'

  //Utils
  const { actionView, actionEdit, actionEnabledDisabled } = utils.useAction<Role>()
  const { formatLargeNumber } = useFormatCustom()

  const { 
    messageToastEnableDisabled,
    messageAlertEnableDisabled
  } = composables.useMessage()
  const { changeRecordStatus } = useBadge()

  const {
    syncFiltersWithRoute,
    mapRouteToFilters,
    mapFiltersToRoute
  } = composables.useFilters()

  //Components
  import {
    ListSearchComponent,
    EnableDisableComponent
  } from '@/components'

  //Stores
  const storeRoles = useStoreRoles()
  const storeSelect = useStoreSelect()

  //Route
  const router = useRouter()
  const route = useRoute()

  //Params
  const queryParams = ref({ ...storeRoles.queryParams })

  //** Variables **/

  const filters = ref({ ...storeRoles.filters })
  const filterElements = ref<FilterElement[]>([])

  //Dialog
  const dialogEnableDisable = ref<DialogExpose | null>(null)
  const dialogStatusRecord = ref<CustomRecordEnableDisable>({ ...defaultCustomRecordEnableDisable })

  //Toast
	const toast = ref<ToastExpose | null>(null)
	const toastDelay = ref(5000)
  const toastPosition = ref('bottom')

  const search = ref('')

  /** Computed **/
	const controlLoadingTable = computed(() => {
		return { row: 8, column: storeRoles.roles.columns.length }
	})
  const controlFilterSelected = computed(() => {
    return filterElements.value.some(filter => {
      if (filter.type === 'select') {
        if (filter.multiple) return !!filter.selected?.length
        else return !!filter.selected
      }
      if (filter.type === 'switch') return filter.input !== null
      if (filter.type === 'date') return !!filter.input
      if (filter.type === 'range') return !!filter.start.input || !!filter.end.input
      return false
    })
  })
  /** Methods **/
    const handleInputSearch = (output: string) => {
    search.value = output
  }
  const handlePressEnter = async () => {
    queryParams.value.page = 0
    filters.value.search = search.value
    handleFiltersToQueryParams()
  }

  //Update sort
  const handleUpdateSort = (newSort: TableSort) => {
    storeRoles.roles.sort.index = newSort.index
    storeRoles.roles.sort.asc = newSort.asc
  }

  const handleUpdatePaginator = (page: string) => {
    filters.value.page = page
    storeRoles.roles.paginator.currentPage = page
    handleFiltersToQueryParams()
  }
  
  //Handles Filters
  const handleSelectorsToFilters = async () => {
    try {
      if(!filterElements.value.length) {
        await Promise.all([
          storeSelect.getSelectStatus(),
          storeSelect.getSelectModule({
            filter: true
          })
        ])
        filterElements.value.push({
          handle: handleFilterSelectedStatus,
          ...storeSelect.selectStatus,
        })
        filterElements.value.push({
          handle: handleFilterSelectedModule,
          ...storeSelect.selectModule
        })
      }
    } catch (error) {
      console.log(error)
    } 
  }
  const handleFilterSelectedStatus = (output: SelectedType) => {
    filterElements.value.some(filter => {
      if (filter.type === 'select' && filter.key === 'status') filter.selected = output
    })
  }
  const handleFilterSelectedModule = (output: SelectedType) => {
    filterElements.value.some(filter => {
      if(filter.type === 'select' && filter.key === 'module') filter.selected = output
    })
  }

  const handleFiltersToQueryParams = async () => {
    queryParams.value.page = Number(filters.value.page) - 1
    queryParams.value.search = filters.value.search
    queryParams.value.status = filters.value.status
    queryParams.value.subModuleId = filters.value.module
    await storeRoles.getRoles(queryParams.value)
  }

  const handleFilterContent = async () => {
    try {
      delete route.query['detail']
      storeRoles.loadingBtnFilters = true
      mapFiltersToRoute(filterElements.value, filters.value)
      handleFiltersToQueryParams()
    } catch (error) {
      console.log(error)
    } finally {
      storeRoles.loadingBtnFilters = false
    }
  }

  //Actions
  const handleNewRecord = async () => {
    router.push('roles/new')
  }
  const handleViewRecord = async (record: Role) => {
    router.push(`roles?detail=${record.phantomKey.id}`)
  }
  const handleEditRecord = async (record: Role) => {
    router.push(`roles/edit=${record.phantomKey.id}`)
  }

  const handleTableActions = () => {
    storeRoles.roles.actions = [
      actionView(handleViewRecord, 'Ver rol'),
      actionEdit(handleEditRecord, 'Editar rol'),
      actionEnabledDisabled(handleDialogStatus),
    ]
  }

  const handleToastShow = async () => {
		toastPosition.value = 'bottom'
    setTimeout(() => {
      if (toast.value) {
        toast.value.handleShowToast()
      }
    }, 100)
	}
  
  const handleDialogStatus = async (record: Role) => {
    try {
      storeRoles.loadingDialog = true
      if (dialogEnableDisable.value) dialogEnableDisable.value.showDialog()
      await storeRoles.getRoleById(record.id)
      dialogStatusRecord.value = {
        title: storeRoles.role.name,
        subtitle: 'texto',
        icon: 'fa-solid fa-user-circle',
      }
      //Message
      messageAlertEnableDisabled(
        storeRoles,
        record?.recordStatus?.status,
        messages.role
      )
    } catch (error) {
      console.log(error)
    } finally {
      storeRoles.loadingDialog = false
    }
  }

  const handleEnableDisableRecord = async () => {
    try {
      storeRoles.loadingBtnDialog = true
      storeRoles.disabledSubmit = true
      const data_ = {
        id: JSON.parse(storeRoles.role.id),
        status: !storeRoles.role.phantomKey.status
      }
     await storeRoles.mutationEditRole(data_)
      //Message
      messageToastEnableDisabled(
        storeRoles,
        !storeRoles.role.phantomKey.status,
        toastDelay,
        messages.role
      )

      if (!storeRoles.errorBack) {
        if (dialogEnableDisable.value) dialogEnableDisable.value.closeDialog()
        handleToastShow()
        const index = storeRoles.roles.data.findIndex(row => row.id === storeRoles.role.id)
        storeRoles.roles.data[index].recordStatus = changeRecordStatus(!storeRoles.roles.data[index].recordStatus.status)
        storeRoles.roles.data[index].phantomKey.status = storeRoles.roles.data[index].recordStatus.status
      } 
    } catch (error) {
      console.error(error)
    }
    finally {
      storeRoles.loadingBtnDialog = false
      storeRoles.disabledSubmit = false
    }
  }

  const initialConfig = async () => {
    storeRoles.loadingTable = true
    await handleSelectorsToFilters()
    mapRouteToFilters(filterElements.value, filters.value)
    search.value = filters.value.search
    handleFiltersToQueryParams()
    handleTableActions()
  }

  const initialDetail = async (payload: string) => {
    try {
      storeRoles.handleSlideDetail()
      await storeRoles.getRoleById(payload)

    } catch (error) {
      console.error(error)
    }
  }

  const handleQueryParamsDetail = async () => {
    const detailParam = route.query.detail
    if (typeof detailParam === 'string') {
      await initialDetail(detailParam)
    }
  }

  watch(route, () => {
    storeRoles.handleCloseSlide()
  },{ once: true, immediate: true })

  watch(() => route.query, async () => {
    await handleQueryParamsDetail()
  })

  watch(() => storeRoles.slideDetail, (value) => {
   if(!value) router.replace({ path: route.path, query: {} })
  })

  watch(() => controlFilterSelected.value, (value) => {
    if(!value) {
      mapFiltersToRoute(filterElements.value, filters.value)
      handleFiltersToQueryParams()
    }
  }, { deep: true })

  onMounted(async () => {
    await initialConfig()
    await handleQueryParamsDetail()
  })

  //Create
  syncFiltersWithRoute(filters.value)

</script>
<template>
  <h1 
    data-eit-font="primary"
    data-eit-font-size="x7"
    data-eit-color="text"
    data-eit-font-weight="900"
    data-eit-mt="0"
    data-eit-mb="2"
  >
    {{ route.meta.title }}
  </h1>

  <ListSearchComponent
    :btnFilter="true"
    btnNewRecord="Nuevo"
    searchPlaceholder="Buscar por nombre"
    :input="search"
    @emitNewRecord="handleNewRecord"
    @emitSlideFilter="storeRoles.handleSlideFilter"
    @emitInputSearch="handleInputSearch"
    @emitPressEnter="handlePressEnter"
  />

  <TableComponent
    :sort="storeRoles.roles.sort"
    :columns="storeRoles.roles.columns"
    :data="storeRoles.roles.data"
    :loading="storeRoles.loadingTable"
    :skeleton="controlLoadingTable"
    @updateSort="handleUpdateSort"
    :actions="storeRoles.roles.actions"
  >
  <template #paginator>
      <div 
        data-eit-display="flex"
        data-eit-align="center"
      >
        <div data-eit-flex="fill">
          <p 
            data-eit-font-size="x2"
            data-eit-color="text-soft"
            data-eit-mb="0"
          >
            <font-awesome-icon 
              :icon="['fas', 'bars']" 
              data-eit-me="1"
            />
            <strong data-eit-color="text">
              {{ formatLargeNumber(storeRoles.roles.paginator.total) }}
            </strong> Registros
          </p>
        </div>
        <div data-eit-flex="fill">
          <PaginationComponent
            :data="storeRoles.roles.paginator"
            @updatePaginator="handleUpdatePaginator"
          />
        </div>
      </div>
    </template>
  </TableComponent>

  <DetailComponent
    :slide="storeRoles.slideFilter"
    :slideSmall="true"
    :loading="storeRoles.loadingFilters"
    @emitslide="storeRoles.handleCloseSlide"
  >
    <template #title>
      <h3
        data-eit-font="primary" 
        data-eit-font-size="x5" 
        data-eit-color="text" 
        data-eit-font-weight="900"
        data-eit-my="0"
      >
        <font-awesome-icon 
          icon="fa-solid fa-sliders"
          data-eit-color="tertiary"
          data-eit-ms="2"
        />
        Filtros
      </h3>
    </template>
    <template #component>
      <FiltersComponent
        :elements="filterElements"
      />
    </template>
    <template #footer>
      <div data-eit-display="flex">
        <ButtonComponent
          data-eit-w="100"
          data-eit-variant="primary"
          text="Filtrar contenido"
          loadingText=""
          @emitEvent="handleFilterContent"
          :isDisabled="!controlFilterSelected || storeRoles.loadingBtnFilters"
          :loading="storeRoles.loadingBtnFilters"
        />
      </div>
    </template>
  </DetailComponent>

  <DetailComponent
    detailById
    :slide="storeRoles.slideDetail"
    :record="storeRoles.role"
    :actions="storeRoles.roles.actions"
    :loading="storeRoles.loadingDetail"
    @emitslide="storeRoles.handleCloseSlide"
  >
    <template #title>
      <h3 
        data-eit-font="primary" 
        data-eit-font-size="x5" 
        data-eit-color="text" 
        data-eit-font-weight="900"
        class="my-0">
        Detalle del rol
      </h3>
      <div data-eit-display='flex'>
        <BadgeComponent
          :text="storeRoles.role.recordStatus.name"
          :class="`${storeRoles.role.recordStatus.className} eit-font__size--x2`"
        />
      </div>
    </template>
    <template #component>
      <RoleDetailComponent
        :record="storeRoles.role"
      />
    </template>
  </DetailComponent>


  <EnableDisableComponent
    ref="dialogEnableDisable"
    :store="storeRoles"
    :record="storeRoles.role"
    :customRecord="dialogStatusRecord"
    @dialogSubmit="handleEnableDisableRecord"
  />

  <ToastComponent 
    ref="toast"
    :data="storeRoles.messageToast"
    :position="toastPosition"
    :visible="toastDelay"
  />

</template>