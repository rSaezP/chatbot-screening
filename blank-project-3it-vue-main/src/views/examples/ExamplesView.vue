<script setup lang="ts">
	import { useStoreUsers, useStoreSelect, useStoreFilter } from '@/stores'
  import { useRouter, useRoute } from 'vue-router'
  import { ref, computed, watch, onMounted, nextTick, type ComponentPublicInstance } from 'vue'
  import { composables } from 'uikit-3it-vue'
  import messages from '@/messages/messages'
  import type DialogComponent from 'uikit-3it-vue'
  
  type DialogExposed = {
    showDialog: () => void
    closeDialog: () => void
  }
  type DialogRef = ComponentPublicInstance<DialogExposed>

  //Interface
  import type { FilterElement, SelectedType } from 'uikit-3it-vue'
  //Factory
  import { initialUserForm } from '@/factories'

  const {
    syncFiltersWithRoute,
    mapRouteToFilters,
    mapFiltersToRoute
  } = composables.useFilters()

  //Components
  import {
    ListSearchComponent,
  } from '@/components'

  //Exclusive Components
  import ExampleFormComponent from '@/components/example/ExampleFormComponent.vue'

  //Stores
  const storeUsers = useStoreUsers()
  const storeSelect = useStoreSelect()
  const storeFilter = useStoreFilter()

  //Route
  const router = useRouter()
  const route = useRoute()

  //Params
  const queryParams = ref({ ...storeUsers.queryParams })


  const { 
    messageAlertDialogDefault,
  } = composables.useMessage()

  //** Constants **/

  const tabs = [{ name: 'Primer Tab' }, { name: 'Segundo Tab', number: '100' }]

  const filters = ref({ ...storeUsers.filters })
  const filterElements = ref<FilterElement[]>([])

 //Form
  const errorForm = ref(false)
  const submittedForm = ref(false)

  //Dialog
  const dialog = ref<DialogRef | null>(null)
  const dialogBtnSubmit = ref(true)

  const search = ref('')

  /** Computed **/
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

  //Handles Filters
  const handleSelectorsToFilters = async () => {
    try {
      if(!filterElements.value.length) {
        await Promise.all([
          storeSelect.getSelectStatus(),
          storeSelect.getSelectRoleUser(),
          storeSelect.getSelectCurrency(),
        ])
        filterElements.value.push({
          handle: handleFilterSelectedStatus,
          ...storeSelect.selectStatus,
        })
        filterElements.value.push({
          handle: handleFilterSelectedRoleUser,
          ...storeSelect.selectRoleUser
        })
        filterElements.value.push({
          handle: handleFilterSelectedCurrency,
          ...storeSelect.selectCurrency
        })
        filterElements.value.push({
          ...storeFilter.dateFilter,
            key: 'date',
            placeholder: 'Fecha',
            handle: handleFilterDate
        })
        filterElements.value.push({
          ...storeFilter.rangeFilter,
          start: {
            ...storeFilter.rangeFilter.start,
            key: 'publicationStart',
            placeholder: 'Inicio',
            handle: handleFilterRangeStart
          },
          end: {
            ...storeFilter.rangeFilter.end,
            key: 'publicationEnd',
            placeholder: 'Término',
            handle: handleFilterRangeEnd
          }
        })
        filterElements.value.push({
          ...storeFilter.switchFilter,
          placeholder: 'Switch'
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
  const handleFilterSelectedCurrency = (output: SelectedType) => {
    filterElements.value.some(filter => {
      if(filter.type === 'select' && filter.key === 'currency') filter.selected = output
    })
  }
  const handleFilterDate = (output: string | null) => {
    filterElements.value.some((filter) => {
      if (filter.type === 'date' && filter.key === 'date') filter.input = output
    })
  }
  const handleFilterRangeStart = (output: string | null) => {
    filterElements.value.some((filter) => {
      if (filter.type === 'range' && filter.start.key === 'publicationStart') filter.start.input = output
    })
  }
  const handleFilterRangeEnd = (output: string | null) => {
    console.log(filterElements.value)
    filterElements.value.some((filter) => {
      if (filter.type === 'range' && filter.end.key === 'publicationEnd') filter.end.input = output
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

  const initialConfig = async () => {
    storeUsers.loadingTable = true
    await handleSelectorsToFilters()
    mapRouteToFilters(filterElements.value, filters.value)
    search.value = filters.value.search
    handleFiltersToQueryParams()
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

  const handleShowDialogExample = async () => {
    errorForm.value = false
    submittedForm.value = true
    storeUsers.errorBack = null
    messageAlertDialogDefault(storeUsers, errorForm.value, messages.user)
    try {
      await nextTick()
      storeUsers.loadingDialog = true
      storeUsers.userForm = {...initialUserForm }
      dialog.value?.showDialog()
      submittedForm.value = false
    } catch (error) {
      console.log(error)
    } finally {
      storeUsers.loadingDialog = false
    }
  }

  const submitForm = async () => {
    console.log('submit form')
  }

  /** Watch **/
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
    btnActionText="Nuevo"
    searchPlaceholder="Buscar por nombre"
    :input="search"
    @emitSlideFilter="storeUsers.handleSlideFilter"
    @emitInputSearch="handleInputSearch"
    @emitPressEnter="handlePressEnter"
  />

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
        class="my-0">
        <font-awesome-icon 
          icon="fa-solid fa-sliders"
          class="ms-2 eit-color--tertiary"
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
      <div class="d-flex">
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

  <div 
    data-eit-display="flex"
    data-eit-gap="2"
  >
    <BadgeComponent
      text="Texto de prueba"
      data-eit-variant="secondary" 
      data-eit-font-size="x1"
      data-eit-mb="3"
    />
    <BadgeComponent
      text="Texto de prueba"
      data-eit-font-size="x1"
      data-eit-mb="3"
      data-eit-variant="secondary" 
      data-eit-outline
    />
  </div>

  <div 
    data-eit-display="flex"
    data-eit-gap="2"
  >
    <ButtonComponent
      text="Texto de prueba"
      icon="fa-solid fa-plus"
      data-eit-variant='primary'
      :loading="true"
    />
    <ButtonComponent
      text="Texto de prueba"
      icon="fa-solid fa-plus"
      data-eit-variant='primary'
      :isDisabled="true"
    />
    <ButtonComponent
      text="Texto de prueba"
      icon="fa-solid fa-plus"
      data-eit-variant='primary'
      data-eit-outline
    />
  </div>

  <div data-eit-mt="3">
    <ProgressBarComponent
      data-eit-mb="3"
      type="blue"
      :percentage="10"
      :loading="false"
    />
  </div>

  <div data-eit-mt="mt-3">
    <TabComponent 
      :data="tabs"
    >
      <template #tab-0>
        <div 
          data-eit-border="all"
          data-eit-border-radius="x3"
          data-eit-border-color="default"
          data-eit-mt="3"
          data-eit-p="2"
        >
          <p 
            data-eit-color="text"
            data-eit-m="0"
          >
            <font-awesome-icon :icon="['far', 'image']" />
            Primer tab, con un texto simple.
            </p>
        </div>
      </template>
      <template #tab-1>
        <div 
          data-eit-border="all"
          data-eit-border-radius="x3"
          data-eit-border-color="default"
          data-eit-mt="3"
          data-eit-p="2"
        >
          <p 
            class="eit-color--text m-0"
            data-eit-color="text"
            data-eit-m="0"
          >
            <font-awesome-icon :icon="['far', 'calendar']" />
            Segundo tab, con un texto simple.
            </p>
        </div>
      </template>
    </TabComponent>
  </div>

  <DropdownComponent 
    position="left"
    btnClass="eit-btn-action"
    data-eit-mt="3"
  >
    <template #button>
      <font-awesome-icon icon="fa-solid fa-ellipsis"/>
    </template>
    <template #list>
      <div class="mx-2">
        <a class="eit-dropdown__item" href="#">
          <font-awesome-icon icon="fa-solid fa-gear" class="me-2"/>
          Acción 1
        </a>
      </div>
      <div class="mx-2">
        <a class="eit-dropdown__item" href="#">
          <font-awesome-icon icon="fa-solid fa-gear" class="me-2"/>
          Acción 1
        </a>
      </div>
      <div class="eit-dropdown-divider"></div>
      <div class="mx-2">
        <a class="eit-dropdown__item" href="#">
          <font-awesome-icon icon="fa-solid fa-gear" class="me-2"/>
          Acción 1
        </a>
      </div>
    </template>
  </DropdownComponent>

  <ButtonComponent
    text="Prueba dialog form"
    icon="fa-solid fa-plus"
    data-eit-variant="primary"
    @click="handleShowDialogExample"
  />

  <DialogComponent
    ref="dialog"
    class="eit-dialog--top eit-dialog--large"
    :btnSubmit="dialogBtnSubmit"
    :loading="storeUsers.loadingDialog"
    :loadingSubmit="storeUsers.loadingBtnDialog"
    :disabledSubmit="storeUsers.disabledSubmit"
    @emitSubmit="submitForm"
  >
  <template #head>
    <h3 
      data-eit-font-size="x5"
      data-eit-my="0"
    >
      <font-awesome-icon 
        :icon="['fas', 'circle-user']" 
        data-eit-color="tertiary"
      />
        Prueba Form dialog
    </h3>
  </template>
  <template #content>
    <ExampleFormComponent
      :form="storeUsers.userForm"
      :formError="errorForm"
      :submittedForm="submittedForm"
      :alertMessage="storeUsers.messageDialogAlert"
    />
  </template>
  </DialogComponent>

</template>
