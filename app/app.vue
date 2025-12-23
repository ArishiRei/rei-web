<script setup lang="ts">
/**
 * @file app/app.vue
 * @description 应用根组件
 */

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Rei Nuxt Scaffold` : 'Rei Nuxt Scaffold'
  }
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global UI Containers -->
    <ClientOnly>
      <ReiToastContainer />
      <ReiDialogContainer />
    </ClientOnly>
  </div>
</template>
