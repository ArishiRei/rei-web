#!/usr/bin/env node

/**
 * Documentation Cross-Reference Validation System
 * 
 * This script validates internal links between documentation files to ensure
 * all cross-references are valid and maintain documentation consistency.
 * 
 * Features:
 * - Validates markdown links to other documentation files
 * - Checks for broken internal references
 * - Validates anchor links to sections within documents
 * - Reports missing files and invalid section references
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CrossReferenceValidator {
  constructor(docsRoot = 'docs') {
    this.docsRoot = path.resolve(__dirname, '..', docsRoot);
    this.errors = [];
    this.warnings = [];
    this.documentCache = new Map();
  }

  /**
   * Main validation entry point
   */
  async validate() {
    console.log('🔍 Starting cross-reference validation...');
    console.log(`📁 Scanning documentation in: ${this.docsRoot}`);
    
    const markdownFiles = await this.findMarkdownFiles(this.docsRoot);
    console.log(`📄 Found ${markdownFiles.length} markdown files`);

    // Cache all documents for reference lookup
    await this.cacheDocuments(markdownFiles);

    // Validate cross-references in each file
    for (const filePath of markdownFiles) {
      await this.validateFile(filePath);
    }

    this.reportResults();
    return this.errors.length === 0;
  }

  /**
   * Find all markdown files recursively
   */
  async findMarkdownFiles(dir) {
    const files = [];
    
    const scan = async (currentDir) => {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and other build directories
          if (!['node_modules', '.git', '.nuxt', 'dist', '.output'].includes(entry.name)) {
            await scan(fullPath);
          }
        } else if (entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };

    await scan(dir);
    return files;
  }

  /**
   * Cache document content and extract headings for anchor validation
   */
  async cacheDocuments(files) {
    for (const filePath of files) {
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const headings = this.extractHeadings(content);
        
        this.documentCache.set(filePath, {
          content,
          headings,
          relativePath: path.relative(this.docsRoot, filePath)
        });
      } catch (error) {
        this.errors.push({
          file: filePath,
          type: 'file_read_error',
          message: `Failed to read file: ${error.message}`
        });
      }
    }
  }

  /**
   * Extract headings from markdown content for anchor validation
   */
  extractHeadings(content) {
    const headings = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Handle both Unix and Windows line endings
      const cleanLine = line.replace(/\r$/, '');
      const match = cleanLine.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const anchor = this.textToAnchor(text);
        headings.push({ level, text, anchor });
      }
    }
    
    return headings;
  }

  /**
   * Convert heading text to anchor format (GitHub-style)
   */
  textToAnchor(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Collapse multiple hyphens
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  }

  /**
   * Validate cross-references in a single file
   */
  async validateFile(filePath) {
    const document = this.documentCache.get(filePath);
    if (!document) return;

    const { content, relativePath } = document;
    
    // Find all markdown links
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const [, linkText, linkUrl] = match;
      const lineNumber = this.getLineNumber(content, match.index);
      
      await this.validateLink(filePath, relativePath, linkUrl, linkText, lineNumber);
    }
  }

  /**
   * Validate a single link
   */
  async validateLink(sourceFile, sourceRelativePath, linkUrl, linkText, lineNumber) {
    // Skip external links (http/https)
    if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      return;
    }

    // Skip email links
    if (linkUrl.startsWith('mailto:')) {
      return;
    }

    // Parse the link URL
    const [filePart, anchor] = linkUrl.split('#');
    
    if (!filePart) {
      // Anchor-only link (same file)
      await this.validateAnchor(sourceFile, sourceRelativePath, anchor, linkText, lineNumber);
      return;
    }

    // Resolve the target file path
    const sourceDir = path.dirname(sourceFile);
    const targetPath = path.resolve(sourceDir, filePart);
    
    // Check if target file exists
    if (!fs.existsSync(targetPath)) {
      this.errors.push({
        file: sourceRelativePath,
        line: lineNumber,
        type: 'broken_link',
        message: `Broken link to "${filePart}": file does not exist`,
        link: linkUrl,
        linkText
      });
      return;
    }

    // Validate anchor if present
    if (anchor) {
      await this.validateAnchor(targetPath, path.relative(this.docsRoot, targetPath), anchor, linkText, lineNumber, sourceRelativePath);
    }
  }

  /**
   * Validate anchor links to document sections
   */
  async validateAnchor(targetFile, targetRelativePath, anchor, linkText, lineNumber, sourceFile = null) {
    const document = this.documentCache.get(targetFile);
    if (!document) return;

    const { headings } = document;
    const validAnchors = headings.map(h => h.anchor);
    
    if (!validAnchors.includes(anchor)) {
      const errorFile = sourceFile || targetRelativePath;
      this.errors.push({
        file: errorFile,
        line: lineNumber,
        type: 'broken_anchor',
        message: `Broken anchor "#${anchor}" in ${targetRelativePath}`,
        link: `${targetRelativePath}#${anchor}`,
        linkText,
        availableAnchors: validAnchors.slice(0, 5) // Show first 5 available anchors
      });
    }
  }

  /**
   * Get line number for a character position in text
   */
  getLineNumber(content, position) {
    return content.substring(0, position).split('\n').length;
  }

  /**
   * Report validation results
   */
  reportResults() {
    console.log('\n📊 Cross-Reference Validation Results');
    console.log('=====================================');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All cross-references are valid!');
      return;
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ Found ${this.errors.length} error(s):`);
      this.errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.type.toUpperCase()}`);
        console.log(`   File: ${error.file}${error.line ? `:${error.line}` : ''}`);
        console.log(`   Message: ${error.message}`);
        if (error.link) console.log(`   Link: ${error.link}`);
        if (error.linkText) console.log(`   Text: "${error.linkText}"`);
        if (error.availableAnchors) {
          console.log(`   Available anchors: ${error.availableAnchors.join(', ')}${error.availableAnchors.length === 5 ? '...' : ''}`);
        }
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Found ${this.warnings.length} warning(s):`);
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.message}`);
        console.log(`   File: ${warning.file}`);
      });
    }

    console.log(`\n📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
  }
}

// CLI execution
const isMainModule = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;

if (isMainModule) {
  console.log('🚀 Starting cross-reference validation CLI...');
  const validator = new CrossReferenceValidator();
  
  validator.validate()
    .then(success => {
      console.log(`✅ Validation completed. Success: ${success}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

export { CrossReferenceValidator };