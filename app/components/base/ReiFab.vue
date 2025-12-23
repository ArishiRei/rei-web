<script setup lang="ts">
/**
 * @file app/components/base/ReiFab.vue
 * @description Material FAB 封装组件
 */

interface Props {
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
  size?: 'medium' | 'small' | 'large';
}

withDefaults(defineProps<Props>(), {
  variant: 'surface',
  size: 'medium',
});
</script>

<template>
  <md-fab :variant="variant" :size="size" v-bind="$attrs">
    <slot />
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <slot slot="icon" name="icon" />
  </md-fab>
</template>
