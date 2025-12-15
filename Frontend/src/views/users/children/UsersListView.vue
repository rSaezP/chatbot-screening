<script setup lang="ts">
  import { useStoreUsers, useStoreSelect } from '@/stores'
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
  import type { User } from '@/interfaces'

  //Factories
  import { defaultCustomRecordEnableDisable } from '@/factories'

  //Exclusive Components
  import UserDetailComponent from '@/components/users/UserDetailComponent.vue'

  //Utils
  const { actionView, actionEdit, actionEnabledDisabled } = utils.useAction<User>()
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
  const storeUsers = useStoreUsers()
  const storeSelect = useStoreSelect()

  //Route
  const router = useRouter()
  const route = useRoute()

  //Params
  const queryParams = ref({ ...storeUsers.queryParams })

  //** Variables **/

  const filters = ref({ ...storeUsers.filters })
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
		return { row: 8, column: storeUsers.users.columns.length }
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
    storeUsers.users.sort.index = newSort.index
    storeUsers.users.sort.asc = newSort.asc
  }

  const handleUpdatePaginator = (page: string) => {
    filters.value.page = page
    storeUsers.users.paginator.currentPage = page
    handleFiltersToQueryParams()
  }
  
  //Handles Filters
  const handleSelectorsToFilters = async () => {
    try {
      if(!filterElements.value.length) {
        await Promise.all([
          storeSelect.getSelectStatus(),
          storeSelect.getSelectRoleUser()
        ])
        filterElements.value.push({
          handle: handleFilterSelectedStatus,
          ...storeSelect.selectStatus,
        })
        filterElements.value.push({
          handle: handleFilterSelectedRoleUser,
          ...storeSelect.selectRoleUser
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
  const handleFilterSelectedRoleUser = (output: SelectedType) => {
    filterElements.value.some(filter => {
      if(filter.type === 'select' && filter.key === 'role') filter.selected = output
    })
  }

  const handleFiltersToQueryParams = async () => {
    queryParams.value.page = Number(filters.value.page) - 1
    queryParams.value.search = filters.value.search
    queryParams.value.status = filters.value.status
    queryParams.value.roleId = filters.value.role
    await storeUsers.getUsers(queryParams.value)
  }

  const handleFilterContent = async () => {
    try {
      delete route.query['detail']
      storeUsers.loadingBtnFilters = true
      mapFiltersToRoute(filterElements.value, filters.value)
      handleFiltersToQueryParams()
    } catch (error) {
      console.log(error)
    } finally {
      storeUsers.loadingBtnFilters = false
    }
  }

  //Actions
  const handleNewRecord = async () => {
    router.push('users/new')
  }
  const handleViewRecord = async (record: User) => {
    router.push(`users?detail=${record.phantomKey.id}`)
  }
  const handleEditRecord = async (record: User) => {
    router.push(`users/edit=${record.phantomKey.id}`)
  }

  const handleDownloadRecords = async () => {
    try {
      console.log('Descargando registros...')
    } catch (error) {
      console.error(error)
    }
  }

  const handleTableActions = () => {
    storeUsers.users.actions = [
      actionView(handleViewRecord, 'Ver usuario'),
      actionEdit(handleEditRecord, 'Editar usuario'),
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
  
  const handleDialogStatus = async (record: User) => {
    try {
      storeUsers.loadingDialog = true
      if (dialogEnableDisable.value) dialogEnableDisable.value.showDialog()
      await storeUsers.getUserById(record.id)
      dialogStatusRecord.value = {
        title: storeUsers.user.name,
        subtitle: storeUsers.user.role?.name,
        icon: 'fa-solid fa-user-circle',
      }
      //Message
      messageAlertEnableDisabled(
        storeUsers, 
        record?.recordStatus?.status,
        messages.user
      )
    } catch (error) {
      console.log(error)
    } finally {
      storeUsers.loadingDialog = false
    }
  }

  const handleEnableDisableRecord = async () => {
    try {
      storeUsers.loadingBtnDialog = true
      storeUsers.disabledSubmit = true
      const data_ = {
        id: JSON.parse(storeUsers.user.id),
        status: !storeUsers.user.phantomKey.status
      }
     await storeUsers.mutationEditUser(data_)
      //Message
      messageToastEnableDisabled(
        storeUsers,
        !storeUsers.user.phantomKey.status,
        toastDelay,
        messages.user
      )

      if (!storeUsers.errorBack) {
        if (dialogEnableDisable.value) dialogEnableDisable.value.closeDialog()
        handleToastShow()
        const index = storeUsers.users.data.findIndex(row => row.id === storeUsers.user.id)
        storeUsers.users.data[index].recordStatus = changeRecordStatus(!storeUsers.users.data[index].recordStatus.status)
        storeUsers.users.data[index].phantomKey.status = storeUsers.users.data[index].recordStatus.status
      } 
    } catch (error) {
      console.error(error)
    }
    finally {
      storeUsers.loadingBtnDialog = false
      storeUsers.disabledSubmit = false
    }
  }

  const initialConfig = async () => {
    storeUsers.loadingTable = true
    await handleSelectorsToFilters()
    mapRouteToFilters(filterElements.value, filters.value)
    search.value = filters.value.search
    handleFiltersToQueryParams()
    handleTableActions()
  }

  const initialDetail = async (payload: string) => {
    try {
      storeUsers.handleSlideDetail()
      await storeUsers.getUserById(payload)

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
    storeUsers.handleCloseSlide()
  },{ once: true, immediate: true })

  watch(() => route.query, async () => {
    await handleQueryParamsDetail()
  })

  watch(() => storeUsers.slideDetail, (value) => {
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
    :btnDownload="{
      loading: storeUsers.loadingBtnDownload,
      isDisabled: storeUsers.disabledDownload,
      active: true
    }"
    @emitNewRecord="handleNewRecord"
    @emitSlideFilter="storeUsers.handleSlideFilter"
    @emitInputSearch="handleInputSearch"
    @emitPressEnter="handlePressEnter"
    @emitDownloadRecords="handleDownloadRecords"
  />

  <TableComponent
    :sort="storeUsers.users.sort"
    :columns="storeUsers.users.columns"
    :data="storeUsers.filterTable"
    :loading="storeUsers.loadingTable"
    :skeleton="controlLoadingTable"
    @updateSort="handleUpdateSort"
    :actions="storeUsers.users.actions"
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
              {{ formatLargeNumber(storeUsers.users.paginator.total) }}
            </strong> Registros
          </p>
        </div>
        <div data-eit-flex="fill">
          <PaginationComponent
            :data="storeUsers.users.paginator"
            @updatePaginator="handleUpdatePaginator"
          />
        </div>
      </div>
    </template>
  </TableComponent>

  <DetailComponent
    :slide="storeUsers.slideFilter"
    :slideSmall="true"
    :loading="storeUsers.loadingFilters"
    @emitslide="storeUsers.handleCloseSlide"
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
          :isDisabled="!controlFilterSelected || storeUsers.loadingBtnFilters"
          :loading="storeUsers.loadingBtnFilters"
        />
      </div>
    </template>
  </DetailComponent>

  <DetailComponent
    detailById
    :slide="storeUsers.slideDetail"
    :record="storeUsers.user"
    :actions="storeUsers.users.actions"
    :loading="storeUsers.loadingDetail"
    @emitslide="storeUsers.handleCloseSlide"
  >
    <template #title>
      <h3 
        data-eit-font="primary" 
        data-eit-font-size="x5" 
        data-eit-color="text" 
        data-eit-font-weight="900"
        class="my-0">
        Detalle del usuario
      </h3>
      <div data-eit-display='flex'>
        <BadgeComponent
          :text="storeUsers.user.recordStatus.name"
          :class="`${storeUsers.user.recordStatus.className} eit-font__size--x2`"
        />
      </div>
    </template>
    <template #component>
      <UserDetailComponent
        :record="storeUsers.user"
      />
    </template>
  </DetailComponent>


  <EnableDisableComponent
    ref="dialogEnableDisable"
    :store="storeUsers"
    :record="storeUsers.user"
    :customRecord="dialogStatusRecord"
    @dialogSubmit="handleEnableDisableRecord"
  />

  <ToastComponent 
    ref="toast"
    :data="storeUsers.messageToast"
    :position="toastPosition"
    :visible="toastDelay"
  />

</template>