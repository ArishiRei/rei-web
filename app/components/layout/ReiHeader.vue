<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'toggle-drawer'): void
}>()
</script>

<template>
  <header class="rei-header">
    <div class="header-container">
      <div class="left-section">
        <ReiIconButton class="d-md-none" @click="emit('toggle-drawer')">
          <Bars3Icon class="icon-size" />
        </ReiIconButton>
        <NuxtLink to="/" class="logo">REI BLOG</NuxtLink>
      </div>

      <div class="center-section d-none d-md-flex">
        <!-- Hook for Navigation -->
        <slot name="navigation">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/demo/material" class="nav-link">Demo</NuxtLink>
          <NuxtLink to="/blog" class="nav-link">Blog</NuxtLink>
        </slot>
      </div>

      <div class="right-section">
        <!-- Hook for Actions -->
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.rei-header {
  height: 64px;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.left-section, .right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  font-family: var(--md-sys-typescale-title-large-font);
  font-size: var(--md-sys-typescale-title-large-size);
  font-weight: var(--md-sys-typescale-title-large-weight);
  text-decoration: none;
  color: inherit;
  margin-left: 8px;
}

.nav-link {
  margin: 0 16px;
  text-decoration: none;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--md-sys-color-primary);
}

.icon-size {
  width: 24px;
  height: 24px;
}

/* Utilities placeholders (assuming global.css handles d-none etc, but adding here for safety) */
@media (width >= 768px) {
  .d-md-none { display: none; }
  .d-md-flex { display: flex; }
}

@media (width <= 767px) {
  .d-none { display: none; }
}
</style>
