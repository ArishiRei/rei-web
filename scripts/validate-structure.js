#!/usr/bin/env node

/**
 * Project Structure Validation Script
 * 
 * Validates the project structure against documented standards.
 * See: docs/architecture/directory-structure.md
 */

import { existsSync, statSync, readdirSync, readFileSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Configuration
const config = {
  // Required core directories
  requiredDirectories: [
    'app',
    'server', 
    'shared',
    'docs',
    'content',
    'public'
  ],
  
  // Required app subdirectories
  requiredAppDirectories: [
    'app/components',
    'app/composables', 
    'app/pages',
    'app/stores',
    'app/utils'
  ],
  
  // Required server subdirectories
  requiredServerDirectories: [
    'server/api',
    'server/utils'
  ],
  
  // Required shared subdirectories
  requiredSharedDirectories: [
    'shared/types',
    'shared/utils'
  ],
  
  // Component organization structure
  componentDirectories: [
    'app/components/base',
    'app/components/domain', 
    'app/components/layout',
    'app/components/ui'
  ],
  
  // File naming patterns
  namingPatterns: {
    vueComponent: /^[A-Z][a-zA-Z0-9]*\.vue$/,
    composable: /^use[A-Z][a-zA-Z0-9]*\.(ts|js)$/,
    apiRoute: /^[a-zA-Z0-9-]+\.(get|post|put|patch|delete|head|options)\.(ts|js)$/,
    typeFile: /^[A-Z][a-zA-Z0-9]*\.(ts|d\.ts)$/,
    utilFile: /^[a-z][a-zA-Z0-9]*\.(ts|js)$/
  },
  
  // Import dependency rules
  dependencyRules: {
    // app/ cannot import from server/
    'app': { forbidden: ['server'], allowed: ['shared'] },
    // server/ cannot import from app/
    'server': { forbidden: ['app'], allowed: ['shared'] },
    // shared/ cannot import from app/ or server/
    'shared': { forbidden: ['app', 'server'], allowed: [] }
  }
}

class StructureValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.info = []
  }

  log(message, severity = 'info') {
    const entry = { message, severity }
    
    switch (severity) {
      case 'error':
        this.errors.push(entry)
        break
      case 'warning':
        this.warnings.push(entry)
        break
      default:
        this.info.push(entry)
    }
  }

  // Check if required directories exist
  validateRequiredDirectories() {
    console.log('🔍 Checking required directories...')
    
    const allRequired = [
      ...config.requiredDirectories,
      ...config.requiredAppDirectories,
      ...config.requiredServerDirectories,
      ...config.requiredSharedDirectories
    ]
    
    for (const dir of allRequired) {
      const fullPath = join(projectRoot, dir)
      if (!existsSync(fullPath)) {
        this.log(`Missing required directory: ${dir}`, 'error')
      } else if (!statSync(fullPath).isDirectory()) {
        this.log(`Path exists but is not a directory: ${dir}`, 'error')
      } else {
        this.log(`✓ Required directory exists: ${dir}`)
      }
    }
  }

  // Check component organization
  validateComponentOrganization() {
    console.log('🔍 Checking component organization...')
    
    const componentsDir = join(projectRoot, 'app/components')
    if (!existsSync(componentsDir)) {
      this.log('Components directory does not exist', 'error')
      return
    }
    
    // Check if component subdirectories exist
    for (const dir of config.componentDirectories) {
      const fullPath = join(projectRoot, dir)
      if (!existsSync(fullPath)) {
        this.log(`Missing component directory: ${dir}`, 'warning')
      } else {
        this.log(`✓ Component directory exists: ${dir}`)
      }
    }
    
    // Check if Vue components are in correct locations
    this.validateVueComponents(componentsDir)
  }

  // Validate Vue component files
  validateVueComponents(dir, relativePath = '') {
    const items = readdirSync(dir)
    
    for (const item of items) {
      const fullPath = join(dir, item)
      const itemRelativePath = join(relativePath, item)
      
      if (statSync(fullPath).isDirectory()) {
        this.validateVueComponents(fullPath, itemRelativePath)
      } else if (extname(item) === '.vue') {
        // Check naming convention
        if (!config.namingPatterns.vueComponent.test(item)) {
          this.log(`Vue component naming violation: ${itemRelativePath} (should be PascalCase)`, 'warning')
        } else {
          this.log(`✓ Vue component naming correct: ${itemRelativePath}`)
        }
      }
    }
  }

  // Validate file naming conventions
  validateFileNaming() {
    console.log('🔍 Checking file naming conventions...')
    
    // Check composables
    this.validateDirectoryNaming('app/composables', config.namingPatterns.composable, 'Composable')
    
    // Check API routes
    this.validateDirectoryNaming('server/api', config.namingPatterns.apiRoute, 'API route', true)
    
    // Check type files
    this.validateDirectoryNaming('shared/types', config.namingPatterns.typeFile, 'Type file')
  }

  validateDirectoryNaming(dirPath, pattern, fileType, recursive = false) {
    const fullPath = join(projectRoot, dirPath)
    if (!existsSync(fullPath)) return
    
    const items = readdirSync(fullPath)
    
    for (const item of items) {
      const itemPath = join(fullPath, item)
      const relativePath = join(dirPath, item)
      
      if (statSync(itemPath).isDirectory()) {
        if (recursive) {
          this.validateDirectoryNaming(relativePath, pattern, fileType, recursive)
        }
      } else if (['.ts', '.js'].includes(extname(item))) {
        if (!pattern.test(item)) {
          this.log(`${fileType} naming violation: ${relativePath}`, 'warning')
        } else {
          this.log(`✓ ${fileType} naming correct: ${relativePath}`)
        }
      }
    }
  }

  // Validate import dependencies (basic check)
  validateImportDependencies() {
    console.log('🔍 Checking import dependencies...')
    
    // This is a simplified check - in a real implementation, you'd use AST parsing
    const checkDirectory = (dirPath, context) => {
      const fullPath = join(projectRoot, dirPath)
      if (!existsSync(fullPath)) return
      
      const rules = config.dependencyRules[context]
      if (!rules) return
      
      this.scanFilesForImports(fullPath, dirPath, rules)
    }
    
    checkDirectory('app', 'app')
    checkDirectory('server', 'server')
    checkDirectory('shared', 'shared')
  }

  scanFilesForImports(dir, relativePath, rules) {
    const items = readdirSync(dir)
    
    for (const item of items) {
      const fullPath = join(dir, item)
      const itemRelativePath = join(relativePath, item)
      
      if (statSync(fullPath).isDirectory()) {
        this.scanFilesForImports(fullPath, itemRelativePath, rules)
      } else if (['.ts', '.js', '.vue'].includes(extname(item))) {
        try {
          const content = readFileSync(fullPath, 'utf-8')
          this.checkFileImports(content, itemRelativePath, rules)
        } catch {
          this.log(`Could not read file: ${itemRelativePath}`, 'warning')
        }
      }
    }
  }

  checkFileImports(content, filePath, rules) {
    // Simple regex to find import statements
    const importRegex = /import.*from\s+['"`]([^'"`]+)['"`]/g
    let match
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]
      
      // Check for forbidden imports
      for (const forbidden of rules.forbidden) {
        if (importPath.startsWith(`../${forbidden}/`) || importPath.startsWith(forbidden + '/')) {
          this.log(`Forbidden import in ${filePath}: importing from ${forbidden}/`, 'error')
        }
      }
    }
  }

  // Validate file placement
  validateFilePlacement() {
    console.log('🔍 Checking file placement...')
    
    // Check that Vue components are only in app/components/
    this.checkVueComponentPlacement()
    
    // Check that API routes are only in server/api/
    this.checkApiRoutePlacement()
    
    // Check that shared types are only in shared/types/
    this.checkSharedTypePlacement()
  }

  checkVueComponentPlacement() {
    const findVueFiles = (dir, relativePath = '') => {
      if (!existsSync(dir)) return
      
      const items = readdirSync(dir)
      
      for (const item of items) {
        const fullPath = join(dir, item)
        const itemRelativePath = join(relativePath, item).replace(/\\/g, '/')
        
        if (statSync(fullPath).isDirectory()) {
          findVueFiles(fullPath, itemRelativePath)
        } else if (extname(item) === '.vue') {
          // Vue files should only be in app/components/, app/pages/, app/layouts/, or app/error.vue
          const allowedPaths = ['app/components/', 'app/pages/', 'app/layouts/']
          const isAllowed = allowedPaths.some(path => 
            itemRelativePath.startsWith(path)
          ) || itemRelativePath === 'app/error.vue' || itemRelativePath === 'app/app.vue'
          
          if (!isAllowed) {
            this.log(`Vue component in wrong location: ${itemRelativePath}`, 'error')
          } else {
            this.log(`✓ Vue component in correct location: ${itemRelativePath}`)
          }
        }
      }
    }
    
    findVueFiles(join(projectRoot, 'app'), 'app')
  }

  checkApiRoutePlacement() {
    const findApiFiles = (dir, relativePath = '') => {
      if (!existsSync(dir)) return
      
      const items = readdirSync(dir)
      
      for (const item of items) {
        const fullPath = join(dir, item)
        const itemRelativePath = join(relativePath, item).replace(/\\/g, '/')
        
        if (statSync(fullPath).isDirectory()) {
          // Skip node_modules and other non-project directories
          if (item === 'node_modules' || item.startsWith('.')) {
            continue
          }
          findApiFiles(fullPath, itemRelativePath)
        } else if (config.namingPatterns.apiRoute.test(item)) {
          // API routes should only be in server/api/
          if (!itemRelativePath.startsWith('server/api/')) {
            this.log(`API route in wrong location: ${itemRelativePath}`, 'error')
          } else {
            this.log(`✓ API route in correct location: ${itemRelativePath}`)
          }
        }
      }
    }
    
    // Only check server directory for API routes
    findApiFiles(join(projectRoot, 'server'), 'server')
  }

  checkSharedTypePlacement() {
    const findTypeFiles = (dir, relativePath = '') => {
      if (!existsSync(dir)) return
      
      const items = readdirSync(dir)
      
      for (const item of items) {
        const fullPath = join(dir, item)
        const itemRelativePath = join(relativePath, item)
        
        if (statSync(fullPath).isDirectory()) {
          findTypeFiles(fullPath, itemRelativePath)
        } else if (item.endsWith('.d.ts') || (item.endsWith('.ts') && config.namingPatterns.typeFile.test(item))) {
          // Check if it's in a shared context and should be in shared/types/
          if (relativePath.startsWith('shared/') && !relativePath.startsWith('shared/types/') && !relativePath.startsWith('shared/utils/')) {
            this.log(`Type file should be in shared/types/: ${itemRelativePath}`, 'warning')
          }
        }
      }
    }
    
    findTypeFiles(join(projectRoot, 'shared'), 'shared')
  }

  // Run all validations
  async validate() {
    console.log('🚀 Starting project structure validation...\n')
    
    this.validateRequiredDirectories()
    this.validateComponentOrganization()
    this.validateFileNaming()
    this.validateImportDependencies()
    this.validateFilePlacement()
    
    this.printResults()
    
    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info
    }
  }

  printResults() {
    console.log('\n📊 Validation Results:')
    console.log('='.repeat(50))
    
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`)
      this.errors.forEach(error => console.log(`  • ${error.message}`))
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`)
      this.warnings.forEach(warning => console.log(`  • ${warning.message}`))
    }
    
    console.log(`\n✅ Info (${this.info.length} checks passed)`)
    
    if (this.errors.length === 0) {
      console.log('\n🎉 Project structure validation passed!')
    } else {
      console.log('\n💥 Project structure validation failed!')
      console.log('Please fix the errors above before proceeding.')
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const options = {
    path: null,
    report: false,
    fix: false
  }
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--path':
        options.path = args[++i]
        break
      case '--report':
        options.report = true
        break
      case '--fix':
        options.fix = true
        break
      case '--help':
        console.log(`
Project Structure Validator

Usage: node scripts/validate-structure.js [options]

Options:
  --path <path>    Validate specific directory path
  --report         Generate detailed report
  --fix            Attempt to auto-fix issues (not implemented yet)
  --help           Show this help message

Examples:
  node scripts/validate-structure.js
  node scripts/validate-structure.js --path app/components
  node scripts/validate-structure.js --report
        `)
        process.exit(0)
    }
  }
  
  const validator = new StructureValidator()
  
  if (options.path) {
    console.log(`Validating specific path: ${options.path}`)
    // TODO: Implement path-specific validation
  }
  
  const result = await validator.validate()
  
  if (options.report) {
    // TODO: Generate detailed JSON/HTML report
    console.log('\n📄 Detailed report generation not implemented yet')
  }
  
  // Exit with error code if validation failed
  process.exit(result.success ? 0 : 1)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('validate-structure.js')) {
  main().catch(error => {
    console.error('Validation failed:', error)
    process.exit(1)
  })
}

export { StructureValidator }