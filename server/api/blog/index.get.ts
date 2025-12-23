import { readBlogPosts } from '../../utils/blog'
import type { BlogPostSummary } from '~/types/blog'

export default defineEventHandler(async (_event): Promise<BlogPostSummary[]> => {
  try {
    const posts = await readBlogPosts()
    return posts
  } catch (error) {
    console.error('[blog-api] Failed to fetch blog posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog posts'
    })
  }
})