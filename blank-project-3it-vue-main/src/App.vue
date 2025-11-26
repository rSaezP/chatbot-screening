<script setup lang="ts">
  import { useStoreAuth, useStoreTheme } from '@/stores'
  import { watch, computed } from 'vue'
  import { useRoute } from 'vue-router'

  import LayoutPrivateLoader from '@/layouts/default/LayoutPrivateLoader.vue'

  //Stores
  const storeAuth = useStoreAuth()
  const storeTheme = useStoreTheme()

  //Get stores
  storeTheme.getTheme()

  //Change theme
  storeAuth.changeTheme()
  
  watch(storeAuth, () => {
      storeAuth.changeTheme()
  })

  //Layouts
  import {
    LayoutPublicDefault,
    LayoutPrivateDefault
  } from '@/layouts'

  const layoutComponents = {
    LayoutPublicDefault,
    LayoutPrivateDefault,
  };

  const route = useRoute()

  const currentLayout = computed(() => {
    const layoutName = route.meta.layout as keyof typeof layoutComponents
    return layoutComponents[layoutName] || LayoutPublicDefault
  })

</script>
<template>
  <!-- <LayoutPrivateLoader :visible="storeAuth.loadingUser"/> -->
  <component :is="currentLayout" />
</template>
