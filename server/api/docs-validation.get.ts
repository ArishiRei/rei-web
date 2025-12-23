/**
 * Documentation Validation API Endpoint
 * 
 * Provides real-time documentation validation during development.
 * This endpoint validates cross-references and documentation consistency.
 */

import { CrossReferenceValidator } from '../../utils/cross-reference-validator';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const docsRoot = 'docs';
    
    // Initialize validator
    const validator = new CrossReferenceValidator(docsRoot);
    
    // Perform validation
    const result = await validator.validate();
    
    // Format response based on query parameters
    if (query.format === 'summary') {
      return {
        success: result.success,
        summary: {
          filesChecked: result.filesChecked,
          linksValidated: result.linksValidated,
          errorCount: result.errors.length,
          warningCount: result.warnings.length
        }
      };
    }
    
    if (query.format === 'errors-only') {
      return {
        success: result.success,
        errors: result.errors,
        summary: {
          filesChecked: result.filesChecked,
          linksValidated: result.linksValidated,
          errorCount: result.errors.length
        }
      };
    }
    
    // Full validation result
    return {
      success: result.success,
      validation: {
        filesChecked: result.filesChecked,
        linksValidated: result.linksValidated,
        errors: result.errors,
        warnings: result.warnings
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Documentation validation failed',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});