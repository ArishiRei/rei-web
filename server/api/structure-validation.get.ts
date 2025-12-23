// Dynamic import to avoid build issues
// import { StructureValidator } from '../../scripts/validate-structure.js'

export default defineEventHandler(async (_event) => {
  try {
    // Dynamic import to avoid build issues
    const { StructureValidator } = await import('../../scripts/validate-structure.js')
    const validator = new StructureValidator()
    const result = await validator.validate()
    
    return {
      success: result.success,
      timestamp: new Date().toISOString(),
      summary: {
        errors: result.errors.length,
        warnings: result.warnings.length,
        passed: result.info.length
      },
      details: {
        errors: result.errors,
        warnings: result.warnings,
        info: result.info
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Structure validation failed',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})