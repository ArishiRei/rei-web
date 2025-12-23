<script setup lang="ts">
/**
 * @file app/components/base/ReiTextField.vue
 * @description Material Text Field 封装组件
 */

interface Props {
  variant?: 'filled' | 'outlined';
}

withDefaults(defineProps<Props>(), {
  variant: 'outlined',
});
</script>

<template>
  <md-outlined-text-field v-if="variant === 'outlined'" v-bind="$attrs">
    <slot />
  </md-outlined-text-field>
  <md-filled-text-field v-else v-bind="$attrs">
    <slot />
  </md-filled-text-field>
</template>
