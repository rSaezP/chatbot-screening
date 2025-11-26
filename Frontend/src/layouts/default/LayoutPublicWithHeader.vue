<script setup lang="ts">
  import { useStoreAuth, useStoreTheme } from '@/stores'
  import { composables } from 'uikit-3it-vue'

  // Stores
  const storeAuth = useStoreAuth()
  const storeTheme = useStoreTheme()

  // Composables
  const { logotipo } = composables.useLogos(storeAuth, storeTheme)
</script>

<template>
  <main id="layout-public-with-header" class="layout-public-with-header">
    <!-- Simple header with 3IT logo aligned left -->
    <header
      data-eit-border="bottom"
      data-eit-border-color="default"
      data-eit-px="5"
      data-eit-py="4"
      data-eit-bg="color"
      style="position: sticky; top: 0; z-index: 100;"
    >
      <div data-eit-display="flex" data-eit-align="center" data-eit-gap="3">
        <!-- 3IT Logo -->
        <img
          :src="logotipo"
          alt="3IT Logo"
          style="height: 40px; object-fit: contain;"
        />
        <!-- Title next to logo -->
        <h2
          data-eit-color="text"
          data-eit-font-size="x4"
          data-eit-font-weight="500"
          data-eit-m="0"
        >
          Sistema de Chatbot
        </h2>
      </div>
    </header>

    <!-- Main content - full width -->
    <section class="eit-container">
      <RouterView />
    </section>
  </main>
</template>

<style scoped>
.layout-public-with-header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.eit-container {
  flex: 1;
}
</style>
