<script setup lang="ts">
import { useDialogStore } from '~/stores/dialog'

const store = useDialogStore()

const handleConfirm = (id: string) => {
  store.close(id, true)
}

const handleCancel = (id: string) => {
  store.close(id, false)
}
</script>

<template>
  <div v-if="store.dialogs.length > 0" class="dialog-overlay">
    <div
      v-for="dialog in store.dialogs"
      :key="dialog.id"
      class="dialog-card"
    >
      <div v-if="dialog.title" class="dialog-title">{{ dialog.title }}</div>
      <div class="dialog-content">{{ dialog.content }}</div>
      <div class="dialog-actions">
        <ReiButton
          v-if="dialog.cancelText !== ''"
          variant="text"
          @click="handleCancel(dialog.id)"
        >
          {{ dialog.cancelText || 'Cancel' }}
        </ReiButton>
        <ReiButton @click="handleConfirm(dialog.id)">
          {{ dialog.confirmText || 'Confirm' }}
        </ReiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.dialog-card {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border-radius: 28px;
  padding: 24px;
  min-width: 280px;
  max-width: 560px;
  box-shadow: var(--md-sys-elevation-level3);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-title {
  font-family: var(--md-sys-typescale-headline-small-font);
  font-size: var(--md-sys-typescale-headline-small-size);
}

.dialog-content {
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
  color: var(--md-sys-color-on-surface-variant);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
