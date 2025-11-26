<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
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

</template>
