<script setup lang="ts">
/**
 * @file app/components/base/ReiIconButton.vue
 * @description Material Icon Button 封装组件
 */

interface Props {
  variant?: 'standard' | 'filled' | 'filled-tonal' | 'outlined';
}

withDefaults(defineProps<Props>(), {
  variant: 'standard',
});
</script>

<template>
  <md-icon-button v-if="variant === 'standard'" v-bind="$attrs">
    <slot />
  </md-icon-button>
  <md-filled-icon-button v-else-if="variant === 'filled'" v-bind="$attrs">
    <slot />
  </md-filled-icon-button>
  <md-filled-tonal-icon-button v-else-if="variant === 'filled-tonal'" v-bind="$attrs">
    <slot />
  </md-filled-tonal-icon-button>
  <md-outlined-icon-button v-else-if="variant === 'outlined'" v-bind="$attrs">
    <slot />
  </md-outlined-icon-button>
</template>
