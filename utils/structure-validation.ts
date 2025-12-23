import { defineNuxtModule } from '@nuxt/kit'
// Import only when needed to avoid build issues
// import { StructureValidator } from '../scripts/validate-structure.js'

export default defineNuxtModule({
  meta: {
    name: 'structure-validation',
    configKey: 'structureValidation'
  },
  defaults: {
    enabled: true,
    failOnError: false,
    runOnBuild: false
  },
  setup(options, nuxt) {
    // Only run in development or when explicitly enabled
    if (!options.enabled) return
    
    // Run validation on build if enabled
    if (options.runOnBuild) {
      nuxt.hook('build:before', async () => {
        console.log('🔍 Running project structure validation...')
        
        // Dynamic import to avoid build issues
        const { StructureValidator } = await import('../scripts/validate-structure.js')
        const validator = new StructureValidator()
        const result = await validator.validate()
        
        if (!result.success && options.failOnError) {
          throw new Error('Project structure validation failed. Please fix the errors before building.')
        }
      })
    }
    
    // Add validation command to dev tools
    nuxt.hook('devtools:customTabs', (tabs) => {
      tabs.push({
        name: 'structure-validation',
        title: 'Structure Validation',
        icon: 'carbon:folder-details',
        view: {
          type: 'iframe',
          src: '/api/structure-validation'
        }
      })
    })
  }
})