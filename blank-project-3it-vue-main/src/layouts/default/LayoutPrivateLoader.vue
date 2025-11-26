<script setup lang="ts">
  import { useStoreAuth } from '@/stores'

  //Stores
  const storeAuth = useStoreAuth()

  const props = defineProps<{
    visible: boolean
  }>()

</script>

<template>
  <main
    v-cloak
    id="layout-private-default"
    class="layout-private-default"
    v-if="props.visible"
    :class="storeAuth.sidebar.toggleCollapse && 'layout-private-default--sidebar-collapsed'"
  >
    <aside id="sidebar" class="eit-sidebar">
      <div
        class="eit-skeleton eit-skeleton__title"
        data-eit-my='2'
        style="width: 80%"
      ></div>
      <div
        class="eit-skeleton eit-skeleton__text"
        data-eit-my='2'
        style="width: 60%"
      ></div>
      <section class="eit-sidebar__menu__main">
        <div
          class="eit-skeleton eit-skeleton__text"
          data-eit-my='2'
          style="width: 70%"
        ></div>
        <div
          class="eit-skeleton eit-skeleton__text"
          data-eit-my='2'
          style="width: 40%"
        ></div>
      </section>
      <section 
        class="eit-sidebar__footer element--display element-collapse"
        data-eit-flex-direction='column'
      >   
        <div class="eit-sidebar__footer__project">
          <div
            class="eit-skeleton eit-skeleton__text"
            data-eit-my='2'
            style="width: 60%"
          ></div>
        </div>  
      </section>
    </aside>
    <section class="eit-wrapper">
      <nav 
        id="navbar" 
        class="eit-navbar"
        data-eit-display="none"
        data-eit-justify="between"
        data-eit-align="center"
        data-eit-display-md="flex"
      >
        <div 
          class="eit-navbar-left"
          data-eit-flex="fill"
        >
          <div
            class="eit-skeleton eit-skeleton__text"
            data-eit-my='2'
            style="width: 50%"
          ></div>
        </div>
        <div 
          class="eit-navbar-right"
          data-eit-display="flex"
        >
          <AvatarComponent
            width="48"
            data-eit-object-fit='contain'
            data-eit-shape='circle'
          />
        </div>
      </nav>
      <section 
        class="eit-container"
        data-eit-pt="0"
      >
        <div data-eit-mb="4">
          <div
            class="eit-skeleton eit-skeleton__title"
            data-eit-my='2'
            style="width: 60%"
          ></div>
          <div
            class="eit-skeleton eit-skeleton__text"
            data-eit-my='2'
            style="width: 30%"
          ></div>
        </div>
        <div data-eit-mb="4">
          <div
            class="eit-skeleton eit-skeleton__text"
            data-eit-my='2'
            style="width: 40%"
          ></div>
          <div
            class="eit-skeleton eit-skeleton__text"
            data-eit-my='2'
            style="width: 20%"
          ></div>
        </div>
      </section>
    </section>
  </main>
</template>