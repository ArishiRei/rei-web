import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
import type { BlogPost, BlogPostSummary, ContentTree } from '~/types/blog'
import { parseBlogPostJSON } from './blog-validation'

/**
 * Read a single blog post from the filesystem
 */
export async function readBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const jsonPath = resolve(process.cwd(), `public/_content/blog/${slug}.json`)
    const jsonContent = await fs.readFile(jsonPath, 'utf-8')
    return parseBlogPostJSON(jsonContent)
  } catch (error) {
    console.warn(`[blog-utils] Failed to read blog post: ${slug}`, error)
    return null
  }
}

/**
 * Read all blog posts from the content tree
 */
export async function readBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const treePath = resolve(process.cwd(), 'public/_content/_rei_tree.json')
    const treeContent = await fs.readFile(treePath, 'utf-8')
    const tree = JSON.parse(treeContent) as ContentTree
    
    const blogDir = tree.tree.children?.find(
      (item) => item.type === 'dir' && item.name === 'blog'
    )
    
    if (!blogDir || !blogDir.children) {
      return []
    }
    
    const posts: BlogPostSummary[] = blogDir.children
      .filter((item) => item.type === 'md')
      .map((item) => ({
        slug: item.name!.replace(/\.md$/, ''),
        title: item.meta?.title || '',
        date: item.meta?.date || '',
        description: item.meta?.description || '',
        tags: item.meta?.tags || [],
        cover: item.meta?.cover,
        to: `/blog/${item.name!.replace(/\.md$/, '')}`
      }))
      // Sort by date descending (newest first)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    
    return posts
  } catch (error) {
    console.warn('[blog-utils] Failed to read blog posts:', error)
    return []
  }
}