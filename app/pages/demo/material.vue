<script setup lang="ts">
/**
 * @file app/pages/demo/material.vue
 * @description Material Web Components 演示页面
 * @author ArishiRei
 */

// Note: Material Web Components are loaded via plugins/material-web.client.ts
</script>

<template>
  <div class="container">
    <h1 class="md-typescale-display-medium mb-6">Material Web Components Demo</h1>
    
    <ClientOnly>
      <div class="card pa-4 mb-4">
        <h2 class="card-title md-typescale-title-large">Form Controls</h2>
        <div class="card-text">
          <form class="demo-form" @submit.prevent>
            <p class="md-typescale-body-medium">Check out these controls!</p>
            
            <div class="d-flex align-center gap-4 mb-4">
              <md-checkbox touch-target="wrapper" />
              <label>Checkbox</label>
            </div>

            <div class="mb-4">
              <div class="d-flex align-center">
                <md-radio name="group" value="1" touch-target="wrapper" />
                <label>Option 1</label>
              </div>
              <div class="d-flex align-center">
                <md-radio name="group" value="2" touch-target="wrapper" checked />
                <label>Option 2</label>
              </div>
            </div>

            <div class="d-flex flex-column gap-4 mb-4" style="max-width: 300px">
              <md-outlined-text-field 
                label="Favorite color" 
                value="Purple"
              />
              
              <md-filled-text-field 
                label="Email" 
                type="email"
                placeholder="example@email.com"
              />
            </div>

            <div class="d-flex gap-4">
              <md-outlined-button type="reset">Reset</md-outlined-button>
              <md-filled-button>Submit</md-filled-button>
              <md-elevated-button>Elevated</md-elevated-button>
              <md-text-button>Text</md-text-button>
            </div>
          </form>
        </div>
      </div>

      <div class="card pa-4">
        <h2 class="card-title md-typescale-title-large">Icons & FABs</h2>
        <div class="card-text d-flex gap-4 align-center flex-wrap">
          <md-icon-button>
            <md-icon>favorite</md-icon>
          </md-icon-button>
          
          <md-filled-icon-button>
            <md-icon>settings</md-icon>
          </md-filled-icon-button>
          
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <md-fab label="Add">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <md-icon slot="icon">add</md-icon>
          </md-fab>

          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <md-fab variant="primary" label="Edit">
            <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
            <md-icon slot="icon">edit</md-icon>
          </md-fab>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  margin-bottom: 16px;
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.align-center {
  align-items: center;
}

.gap-4 {
  gap: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.pa-4 {
  padding: 16px;
}
</style>
