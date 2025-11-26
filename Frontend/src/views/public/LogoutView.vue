<script setup lang="ts">
	import { useStoreAuth } from '@/stores'

	const storeAuth = useStoreAuth()

	storeAuth.logout()

</script>

<template>
	<div></div>
</template>