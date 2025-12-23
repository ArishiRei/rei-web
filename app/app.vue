<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
/**
 * @file app/app.vue
 * @description 应用根组件
 */

// onMounted(() => {
//   // 仅在客户端执行
//   if (import.meta.client) {
//     // 移除 loading，显示应用
//     document.body.classList.add('mounted');
    
//     // 可选：动画结束后移除 DOM 元素
//     const loader = document.getElementById('app-loading');
//     if (loader) {
//       setTimeout(() => {
//         loader.remove();
//       }, 500); // 对应 CSS transition 时间
//     }
//   }
// });
// 使用 Nuxt 的 hook 在挂载后执行逻辑
// const nuxtApp = useNuxtApp()

// // 这里的逻辑只会在客户端执行
// nuxtApp.hook('app:mounted', () => {
//   // 1. 找到 loading 元素
//   const loader = document.getElementById('app-loading')
  
//   // 2. 找到 Nuxt 挂载点
//   // 注意：Nuxt 默认 ID 是 __nuxt，如果你在配置里改了这里也要改
//   const app = document.getElementById('__nuxt')

//   if (loader && app) {
//     // 3. 执行淡出动画（可选，为了体验更丝滑）
//     loader.style.opacity = '0'
    
//     // 4. 动画结束后移除 DOM 并显示应用
//     setTimeout(() => {
//       // 移除 loader
//       loader.remove()
      
//       // 显示应用：移除 display: none
//       app.style.display = 'block' // 或者 'unset' / 'flex' 视你的布局而定
//     }, 500) // 对应 CSS 中的 transition 时间
//   }
// })
</script>
