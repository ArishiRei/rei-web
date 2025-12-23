/**
 * Core blog post interface representing the complete blog post data
 * This matches the JSON structure stored in public/_content/blog/*.json
 */
export interface BlogPost {
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
  content: string
}

/**
 * Blog post summary interface for listing pages
 * Contains essential metadata without the full content
 */
export interface BlogPostSummary {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
  to: string
}

/**
 * Blog route information interface for static generation
 * Contains routing and metadata information for build-time route discovery
 */
export interface BlogRouteInfo {
  slug: string
  jsonPath: string
  urlPath: string
  metadata: {
    title?: string
    date?: string
    description?: string
    tags?: string[]
    cover?: string
  }
}

/**
 * Content tree node types from the existing content system
 * Represents the structure of nodes in the _rei_tree.json file
 */
export interface ContentTreeNode {
  type: 'dir' | 'md' | 'file'
  name?: string
  path: string
  children?: ContentTreeNode[]
  sourcePath?: string
  outputPath?: string
  urlPath?: string
  meta?: {
    title?: string
    date?: string
    description?: string
    tags?: string[]
    cover?: string
  }
}

/**
 * Content tree structure interface
 * Represents the complete _rei_tree.json structure
 */
export interface ContentTree {
  prefix: string
  routeBase: string
  sourceDir: string
  outputDir: string
  generatedAt: string
  treeUrlPath: string
  tree: ContentTreeNode
}

/**
 * Blog route generator interface for static generation
 * Defines the contract for route discovery and registration
 */
export interface BlogRouteGenerator {
  discoverRoutes(): Promise<string[]>
  registerRoutes(routes: string[]): void
}

/**
 * Static generation configuration interface
 * Configuration options for static site generation
 */
export interface StaticGenerationConfig {
  routes: string[]
  fallback: boolean
  crawler: boolean
}

/**
 * Blog route discovery options interface
 * Configuration options for route discovery process
 */
export interface BlogRouteDiscoveryOptions {
  cwd?: string
  treeFilePath?: string
  sortByDate?: boolean
}

/**
 * Blog route discovery error types
 */
export class BlogRouteDiscoveryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly filePath?: string
  ) {
    super(message)
    this.name = 'BlogRouteDiscoveryError'
  }
}

/**
 * Blog route discovery error codes
 */
export const BlogRouteDiscoveryErrorCodes = {
  TREE_FILE_NOT_FOUND: 'TREE_FILE_NOT_FOUND',
  TREE_FILE_INVALID: 'TREE_FILE_INVALID',
  BLOG_DIR_NOT_FOUND: 'BLOG_DIR_NOT_FOUND',
  INVALID_CONTENT_STRUCTURE: 'INVALID_CONTENT_STRUCTURE'
} as const

export type BlogRouteDiscoveryErrorCode = typeof BlogRouteDiscoveryErrorCodes[keyof typeof BlogRouteDiscoveryErrorCodes]

/**
 * Blog content validation result interface
 * Result of validating blog content structure
 */
export interface BlogContentValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * API response wrapper interface
 * Generic wrapper for API responses
 */
export interface APIResponse<T> {
  data: T
  status: number
  message: string
}
