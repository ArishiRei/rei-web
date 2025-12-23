import type { BlogPost, BlogContentValidationResult } from '~/types/blog'

/**
 * Validates a blog post object against the expected schema
 * 
 * @param post - The blog post object to validate
 * @returns Validation result with errors and warnings
 */
export function validateBlogPost(post: unknown): BlogContentValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (!post || typeof post !== 'object') {
    errors.push('Blog post must be an object')
    return { isValid: false, errors, warnings }
  }
  
  const blogPost = post as Record<string, unknown>
  
  // Required fields validation
  if (!blogPost.title || typeof blogPost.title !== 'string') {
    errors.push('Title is required and must be a string')
  }
  
  if (!blogPost.date || typeof blogPost.date !== 'string') {
    errors.push('Date is required and must be a string')
  } else {
    // Validate date format
    const dateObj = new Date(blogPost.date)
    if (isNaN(dateObj.getTime())) {
      errors.push('Date must be a valid date string')
    }
  }
  
  if (!blogPost.description || typeof blogPost.description !== 'string') {
    errors.push('Description is required and must be a string')
  }
  
  if (!blogPost.content || typeof blogPost.content !== 'string') {
    errors.push('Content is required and must be a string')
  }
  
  // Tags validation
  if (!Array.isArray(blogPost.tags)) {
    errors.push('Tags must be an array')
  } else {
    const invalidTags = blogPost.tags.filter(tag => typeof tag !== 'string')
    if (invalidTags.length > 0) {
      errors.push('All tags must be strings')
    }
  }
  
  // Optional fields validation
  if (blogPost.cover !== undefined && typeof blogPost.cover !== 'string') {
    errors.push('Cover must be a string if provided')
  }
  
  // Warnings for best practices
  if (typeof blogPost.title === 'string' && blogPost.title.length > 100) {
    warnings.push('Title is longer than 100 characters, consider shortening for better SEO')
  }
  
  if (typeof blogPost.description === 'string' && blogPost.description.length > 160) {
    warnings.push('Description is longer than 160 characters, consider shortening for better SEO')
  }
  
  if (Array.isArray(blogPost.tags) && blogPost.tags.length === 0) {
    warnings.push('No tags provided, consider adding tags for better categorization')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Type guard to check if an object is a valid BlogPost
 * 
 * @param post - The object to check
 * @returns True if the object is a valid BlogPost
 */
export function isBlogPost(post: unknown): post is BlogPost {
  const validation = validateBlogPost(post)
  return validation.isValid
}

/**
 * Safely parses and validates blog post JSON content
 * 
 * @param jsonContent - The JSON string to parse
 * @returns Parsed and validated blog post or null if invalid
 */
export function parseBlogPostJSON(jsonContent: string): BlogPost | null {
  try {
    const parsed = JSON.parse(jsonContent)
    const validation = validateBlogPost(parsed)
    
    if (!validation.isValid) {
      console.warn('[blog-validation] Invalid blog post structure:', validation.errors)
      return null
    }
    
    if (validation.warnings.length > 0) {
      console.warn('[blog-validation] Blog post warnings:', validation.warnings)
    }
    
    return parsed as BlogPost
  } catch (error) {
    console.error('[blog-validation] Failed to parse blog post JSON:', error)
    return null
  }
}