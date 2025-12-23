<script setup lang="ts">
/**
 * @file app/components/base/ReiButton.vue
 * @description Material Button 封装组件
 */

interface Props {
  variant?: 'filled' | 'outlined' | 'elevated' | 'text';
}

withDefaults(defineProps<Props>(), {
  variant: 'filled',
});
</script>

<template>
  <md-filled-button v-if="variant === 'filled'" v-bind="$attrs">
    <slot />
  </md-filled-button>
  <md-outlined-button v-else-if="variant === 'outlined'" v-bind="$attrs">
    <slot />
  </md-outlined-button>
  <md-elevated-button v-else-if="variant === 'elevated'" v-bind="$attrs">
    <slot />
  </md-elevated-button>
  <md-text-button v-else-if="variant === 'text'" v-bind="$attrs">
    <slot />
  </md-text-button>
</template>
