import { readBlogPost } from '../../utils/blog'
import type { BlogPost } from '~/types/blog'

export default defineEventHandler(async (event): Promise<BlogPost> => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug || typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid slug parameter is required'
    })
  }
  
  try {
    const post = await readBlogPost(slug)
    
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Blog post not found'
      })
    }
    
    return post
  } catch (error) {
    // If it's already a createError, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error(`[blog-api] Failed to fetch blog post "${slug}":`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog post'
    })
  }
})