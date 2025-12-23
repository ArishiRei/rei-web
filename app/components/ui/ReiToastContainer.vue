<script setup lang="ts">
import { useToastStore } from '~/stores/toast'

const store = useToastStore()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        class="toast-item"
        :class="`type-${toast.type}`"
      >
        {{ toast.text }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
  pointer-events: none;
}

.toast-item {
  padding: 12px 24px;
  border-radius: 8px;
  background-color: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
  box-shadow: var(--md-sys-elevation-level3);
  pointer-events: auto;
  min-width: 300px;
  text-align: center;
}

.type-error {
  background-color: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
}

.type-success {
  background-color: var(--md-sys-color-tertiary); /* MD3 doesn't have explicit success token, using tertiary */
  color: var(--md-sys-color-on-tertiary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
