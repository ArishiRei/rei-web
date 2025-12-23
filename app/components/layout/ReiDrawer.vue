<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => emit('update:modelValue', false)
</script>

<template>
  <div class="drawer-overlay" :class="{ open: modelValue }" @click="close">
    <aside class="drawer-content" :class="{ open: modelValue }" @click.stop>
      <div class="drawer-header">
        <span class="title">Menu</span>
        <ReiIconButton @click="close">
          <XMarkIcon class="icon-size" />
        </ReiIconButton>
      </div>
      <nav class="drawer-nav">
        <slot />
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.drawer-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.drawer-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 51;
}

.drawer-content.open {
  transform: translateX(0);
}

.drawer-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.title {
  font-family: var(--md-sys-typescale-title-medium-font);
  font-size: var(--md-sys-typescale-title-medium-size);
  font-weight: bold;
}

.drawer-nav {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.icon-size {
  width: 24px;
  height: 24px;
}
</style>
