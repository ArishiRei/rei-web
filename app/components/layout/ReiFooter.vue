<template>
  <footer class="rei-footer">
    <div class="footer-content">
      <div class="copyright">
        &copy; {{ new Date().getFullYear() }} Rei Nuxt Scaffold. All rights reserved.
      </div>
      <div class="links">
        <!-- Hook for Footer Links -->
        <slot name="links" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.rei-footer {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface-variant);
  padding: 32px 16px;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@media (width >= 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
