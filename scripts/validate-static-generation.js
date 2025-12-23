#!/usr/bin/env node

/**
 * Static Generation Validation Script
 * 
 * This script validates the quality of the generated static site,
 * checking for completeness, SEO metadata, and accessibility.
 */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { JSDOM } from 'jsdom'

const OUTPUT_DIR = '.output/public'
const BLOG_DIR = join(OUTPUT_DIR, 'blog')

/**
 * Validation results structure
 */
class ValidationResults {
  constructor() {
    this.passed = 0
    this.failed = 0
    this.warnings = 0
    this.errors = []
    this.warnings_list = []
  }

  pass(message) {
    this.passed++
    console.log(`✅ ${message}`)
  }

  fail(message) {
    this.failed++
    this.errors.push(message)
    console.error(`❌ ${message}`)
  }

  warn(message) {
    this.warnings++
    this.warnings_list.push(message)
    console.warn(`⚠️  ${message}`)
  }

  summary() {
    console.log('\n' + '='.repeat(60))
    console.log('STATIC GENERATION VALIDATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Passed: ${this.passed}`)
    console.log(`❌ Failed: ${this.failed}`)
    console.log(`⚠️  Warnings: ${this.warnings}`)
    
    if (this.errors.length > 0) {
      console.log('\nErrors:')
      this.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    if (this.warnings_list.length > 0) {
      console.log('\nWarnings:')
      this.warnings_list.forEach(warning => console.log(`  - ${warning}`))
    }
    
    console.log('='.repeat(60))
    return this.failed === 0
  }
}

/**
 * Check if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Read and parse HTML file
 */
async function readHtmlFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return new JSDOM(content)
  } catch (error) {
    throw new Error(`Failed to read HTML file ${filePath}: ${error.message}`)
  }
}

/**
 * Validate basic file structure
 */
async function validateFileStructure(results) {
  console.log('\n📁 Validating file structure...')
  
  // Check if output directory exists
  if (await fileExists(OUTPUT_DIR)) {
    results.pass('Output directory exists')
  } else {
    results.fail('Output directory not found')
    return
  }
  
  // Check if blog directory exists
  if (await fileExists(BLOG_DIR)) {
    results.pass('Blog directory exists')
  } else {
    results.fail('Blog directory not found')
    return
  }
  
  // Check for blog index page
  const blogIndexPath = join(BLOG_DIR, 'index.html')
  if (await fileExists(blogIndexPath)) {
    results.pass('Blog index page exists')
  } else {
    results.fail('Blog index page not found')
  }
  
  // Check for individual blog posts
  const blogEntries = await fs.readdir(BLOG_DIR, { withFileTypes: true })
  const blogPosts = blogEntries.filter(entry => entry.isDirectory())
  
  if (blogPosts.length > 0) {
    results.pass(`Found ${blogPosts.length} blog post directories`)
    
    // Validate each blog post has an index.html
    for (const post of blogPosts) {
      const postIndexPath = join(BLOG_DIR, post.name, 'index.html')
      if (await fileExists(postIndexPath)) {
        results.pass(`Blog post ${post.name} has index.html`)
      } else {
        results.fail(`Blog post ${post.name} missing index.html`)
      }
    }
  } else {
    results.warn('No blog post directories found')
  }
}

/**
 * Validate SEO metadata in HTML
 */
function validateSeoMetadata(dom, pageName, results) {
  const document = dom.window.document
  
  // Check for title
  const title = document.querySelector('title')
  if (title && title.textContent.trim()) {
    results.pass(`${pageName}: Has title tag`)
  } else {
    results.fail(`${pageName}: Missing or empty title tag`)
  }
  
  // Check for meta description
  const description = document.querySelector('meta[name="description"]')
  if (description && description.getAttribute('content')) {
    results.pass(`${pageName}: Has meta description`)
  } else {
    results.fail(`${pageName}: Missing meta description`)
  }
  
  // Check for Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')
  const ogType = document.querySelector('meta[property="og:type"]')
  const ogUrl = document.querySelector('meta[property="og:url"]')
  
  if (ogTitle && ogDescription && ogType && ogUrl) {
    results.pass(`${pageName}: Has complete Open Graph metadata`)
  } else {
    results.fail(`${pageName}: Incomplete Open Graph metadata`)
  }
  
  // Check for Twitter Card tags
  const twitterCard = document.querySelector('meta[name="twitter:card"]')
  const twitterTitle = document.querySelector('meta[name="twitter:title"]')
  const twitterDescription = document.querySelector('meta[name="twitter:description"]')
  
  if (twitterCard && twitterTitle && twitterDescription) {
    results.pass(`${pageName}: Has Twitter Card metadata`)
  } else {
    results.fail(`${pageName}: Missing Twitter Card metadata`)
  }
  
  // Check for structured data (JSON-LD)
  const jsonLd = document.querySelector('script[type="application/ld+json"]')
  if (jsonLd) {
    try {
      JSON.parse(jsonLd.textContent)
      results.pass(`${pageName}: Has valid structured data`)
    } catch {
      results.fail(`${pageName}: Invalid structured data JSON`)
    }
  } else {
    results.fail(`${pageName}: Missing structured data`)
  }
  
  // Check for canonical URL
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical && canonical.getAttribute('href')) {
    results.pass(`${pageName}: Has canonical URL`)
  } else {
    results.fail(`${pageName}: Missing canonical URL`)
  }
}

/**
 * Validate content completeness
 */
function validateContentCompleteness(dom, pageName, results) {
  const document = dom.window.document
  
  // Check for main content
  const mainContent = document.querySelector('main')
  if (mainContent && mainContent.textContent.trim()) {
    results.pass(`${pageName}: Has main content`)
  } else {
    results.fail(`${pageName}: Missing or empty main content`)
  }
  
  // Check for proper heading structure
  const h1 = document.querySelector('h1')
  if (h1 && h1.textContent.trim()) {
    results.pass(`${pageName}: Has H1 heading`)
  } else {
    results.fail(`${pageName}: Missing H1 heading`)
  }
  
  // Check for navigation
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]')
  if (nav) {
    results.pass(`${pageName}: Has navigation`)
  } else {
    results.warn(`${pageName}: No navigation found`)
  }
}

/**
 * Validate accessibility basics
 */
function validateAccessibility(dom, pageName, results) {
  const document = dom.window.document
  
  // Check for lang attribute
  const html = document.querySelector('html')
  if (html && html.getAttribute('lang')) {
    results.pass(`${pageName}: Has lang attribute`)
  } else {
    results.fail(`${pageName}: Missing lang attribute`)
  }
  
  // Check for viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    results.pass(`${pageName}: Has viewport meta tag`)
  } else {
    results.fail(`${pageName}: Missing viewport meta tag`)
  }
  
  // Check for skip links or proper heading structure
  const skipLink = document.querySelector('a[href^="#"]')
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  if (skipLink || headings.length > 0) {
    results.pass(`${pageName}: Has accessibility navigation aids`)
  } else {
    results.warn(`${pageName}: Consider adding skip links or proper heading structure`)
  }
}

/**
 * Validate blog pages
 */
async function validateBlogPages(results) {
  console.log('\n📝 Validating blog pages...')
  
  // Validate blog index page
  const blogIndexPath = join(BLOG_DIR, 'index.html')
  if (await fileExists(blogIndexPath)) {
    try {
      const dom = await readHtmlFile(blogIndexPath)
      validateSeoMetadata(dom, 'Blog Index', results)
      validateContentCompleteness(dom, 'Blog Index', results)
      validateAccessibility(dom, 'Blog Index', results)
    } catch (error) {
      results.fail(`Blog Index: ${error.message}`)
    }
  }
  
  // Validate individual blog posts
  const blogEntries = await fs.readdir(BLOG_DIR, { withFileTypes: true })
  const blogPosts = blogEntries.filter(entry => entry.isDirectory())
  
  for (const post of blogPosts) {
    const postIndexPath = join(BLOG_DIR, post.name, 'index.html')
    if (await fileExists(postIndexPath)) {
      try {
        const dom = await readHtmlFile(postIndexPath)
        const pageName = `Blog Post: ${post.name}`
        
        validateSeoMetadata(dom, pageName, results)
        validateContentCompleteness(dom, pageName, results)
        validateAccessibility(dom, pageName, results)
        
        // Additional blog post specific checks
        const document = dom.window.document
        
        // Check for article tag
        const article = document.querySelector('article')
        if (article) {
          results.pass(`${pageName}: Uses semantic article tag`)
        } else {
          results.warn(`${pageName}: Consider using article tag for blog content`)
        }
        
        // Check for publication date
        const pubDate = document.querySelector('meta[property="article:published_time"]')
        if (pubDate) {
          results.pass(`${pageName}: Has publication date`)
        } else {
          results.warn(`${pageName}: Missing publication date metadata`)
        }
        
      } catch (error) {
        results.fail(`${post.name}: ${error.message}`)
      }
    }
  }
}

/**
 * Validate performance aspects
 */
async function validatePerformance(results) {
  console.log('\n⚡ Validating performance aspects...')
  
  // Check for CSS files
  const nuxtDir = join(OUTPUT_DIR, '_nuxt')
  if (await fileExists(nuxtDir)) {
    const nuxtFiles = await fs.readdir(nuxtDir)
    const cssFiles = nuxtFiles.filter(file => file.endsWith('.css'))
    const jsFiles = nuxtFiles.filter(file => file.endsWith('.js'))
    
    if (cssFiles.length > 0) {
      results.pass(`Found ${cssFiles.length} CSS files`)
    } else {
      results.warn('No CSS files found in _nuxt directory')
    }
    
    if (jsFiles.length > 0) {
      results.pass(`Found ${jsFiles.length} JavaScript files`)
    } else {
      results.warn('No JavaScript files found in _nuxt directory')
    }
    
    // Check for large files (> 1MB)
    for (const file of [...cssFiles, ...jsFiles]) {
      const filePath = join(nuxtDir, file)
      const stats = await fs.stat(filePath)
      const sizeInMB = stats.size / (1024 * 1024)
      
      if (sizeInMB > 1) {
        results.warn(`Large file detected: ${file} (${sizeInMB.toFixed(2)}MB)`)
      }
    }
  } else {
    results.fail('_nuxt directory not found')
  }
}

/**
 * Main validation function
 */
async function validateStaticGeneration() {
  const results = new ValidationResults()
  
  console.log('🔍 Starting static generation validation...')
  
  try {
    await validateFileStructure(results)
    await validateBlogPages(results)
    await validatePerformance(results)
    
    const success = results.summary()
    process.exit(success ? 0 : 1)
    
  } catch (error) {
    console.error('❌ Validation failed with error:', error.message)
    process.exit(1)
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('validate-static-generation.js')) {
  validateStaticGeneration()
}

export { validateStaticGeneration }