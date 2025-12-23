<script setup lang="ts">
const isDrawerOpen = ref(false)
</script>

<template>
  <div class="layout-default">
    <ReiHeader @toggle-drawer="isDrawerOpen = true">
      <template #actions>
        <!-- Global Actions Hook -->
        <div id="header-actions" />
      </template>
    </ReiHeader>

    <ReiDrawer v-model="isDrawerOpen">
      <NuxtLink to="/" class="drawer-link" @click="isDrawerOpen = false">Home</NuxtLink>
      <NuxtLink to="/demo/material" class="drawer-link" @click="isDrawerOpen = false">Demo</NuxtLink>
    </ReiDrawer>

    <main class="main-content">
      <slot />
    </main>

    <ReiFooter />

    <!-- Global Overlay Hooks -->
    <div id="teleport-overlay" />
  </div>
</template>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
}

.drawer-link {
  display: block;
  padding: 12px 16px;
  border-radius: 24px; /* Pill shape */
  text-decoration: none;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
}

.drawer-link:hover, .drawer-link.router-link-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
</style>
