/**
 * Cross-Reference Validation Module
 * 
 * TypeScript module for validating documentation cross-references.
 * This module provides utilities for checking internal links and maintaining
 * documentation consistency across the project.
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface ValidationError {
  file: string;
  line?: number;
  type: 'broken_link' | 'broken_anchor' | 'file_read_error' | 'invalid_format';
  message: string;
  link?: string;
  linkText?: string;
  availableAnchors?: string[];
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  filesChecked: number;
  linksValidated: number;
}

export interface DocumentInfo {
  content: string;
  headings: HeadingInfo[];
  relativePath: string;
}

export interface HeadingInfo {
  level: number;
  text: string;
  anchor: string;
}

export interface LinkInfo {
  text: string;
  url: string;
  line: number;
  isExternal: boolean;
  hasAnchor: boolean;
  filePart?: string;
  anchor?: string;
}

export class CrossReferenceValidator {
  private docsRoot: string;
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];
  private documentCache = new Map<string, DocumentInfo>();
  private linksValidated = 0;

  constructor(docsRoot: string = 'docs') {
    this.docsRoot = path.resolve(docsRoot);
  }

  /**
   * Validate all cross-references in the documentation
   */
  async validate(): Promise<ValidationResult> {
    this.reset();
    
    const markdownFiles = await this.findMarkdownFiles(this.docsRoot);
    await this.cacheDocuments(markdownFiles);

    for (const filePath of markdownFiles) {
      await this.validateFile(filePath);
    }

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      filesChecked: markdownFiles.length,
      linksValidated: this.linksValidated
    };
  }

  /**
   * Validate cross-references in a specific file
   */
  async validateSingleFile(filePath: string): Promise<ValidationResult> {
    this.reset();
    
    const absolutePath = path.resolve(filePath);
    await this.cacheDocuments([absolutePath]);
    await this.validateFile(absolutePath);

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      filesChecked: 1,
      linksValidated: this.linksValidated
    };
  }

  /**
   * Extract all links from a markdown file
   */
  async extractLinks(filePath: string): Promise<LinkInfo[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    return this.parseLinks(content);
  }

  /**
   * Check if a specific link is valid
   */
  async validateLink(sourceFile: string, linkUrl: string): Promise<boolean> {
    const sourceDir = path.dirname(sourceFile);
    
    // Skip external links
    if (this.isExternalLink(linkUrl)) {
      return true;
    }

    const [filePart, anchor] = linkUrl.split('#');
    
    if (!filePart) {
      // Anchor-only link - validate against source file
      const document = this.documentCache.get(sourceFile);
      if (!document) {
        await this.cacheDocuments([sourceFile]);
      }
      return anchor ? this.isValidAnchor(sourceFile, anchor) : true;
    }

    // Check if target file exists
    const targetPath = path.resolve(sourceDir, filePart);
    if (!await this.fileExists(targetPath)) {
      return false;
    }

    // Validate anchor if present
    if (anchor) {
      if (!this.documentCache.has(targetPath)) {
        await this.cacheDocuments([targetPath]);
      }
      return this.isValidAnchor(targetPath, anchor);
    }

    return true;
  }

  private reset(): void {
    this.errors = [];
    this.warnings = [];
    this.documentCache.clear();
    this.linksValidated = 0;
  }

  private async findMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const scan = async (currentDir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          
          if (entry.isDirectory()) {
            // Skip build and system directories
            const skipDirs = ['node_modules', '.git', '.nuxt', 'dist', '.output', '.next'];
            if (!skipDirs.includes(entry.name)) {
              await scan(fullPath);
            }
          } else if (entry.name.endsWith('.md')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        this.warnings.push({
          file: currentDir,
          type: 'file_read_error',
          message: `Cannot read directory: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };

    await scan(dir);
    return files;
  }

  private async cacheDocuments(files: string[]): Promise<void> {
    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const headings = this.extractHeadings(content);
        
        this.documentCache.set(filePath, {
          content,
          headings,
          relativePath: path.relative(this.docsRoot, filePath)
        });
      } catch (error) {
        this.errors.push({
          file: path.relative(this.docsRoot, filePath),
          type: 'file_read_error',
          message: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
  }

  private extractHeadings(content: string): HeadingInfo[] {
    const headings: HeadingInfo[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Handle both Unix and Windows line endings
      const cleanLine = line.replace(/\r$/, '');
      const match = cleanLine.match(/^(#{1,6})\s+(.+)$/);
      if (match && match[1] && match[2]) {
        const level = match[1].length;
        const text = match[2].trim();
        const anchor = this.textToAnchor(text);
        headings.push({ level, text, anchor });
      }
    }
    
    return headings;
  }

  private textToAnchor(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Collapse multiple hyphens
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  }

  private parseLinks(content: string): LinkInfo[] {
    const links: LinkInfo[] = [];
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const [, linkText, linkUrl] = match;
      if (!linkText || !linkUrl) continue;
      
      const lineNumber = this.getLineNumber(content, match.index);
      const isExternal = this.isExternalLink(linkUrl);
      const [filePart, anchor] = linkUrl.split('#');
      
      links.push({
        text: linkText,
        url: linkUrl,
        line: lineNumber,
        isExternal,
        hasAnchor: !!anchor,
        filePart: filePart || undefined,
        anchor: anchor || undefined
      });
    }

    return links;
  }

  private async validateFile(filePath: string): Promise<void> {
    const document = this.documentCache.get(filePath);
    if (!document) return;

    const { content, relativePath } = document;
    const links = this.parseLinks(content);

    for (const link of links) {
      this.linksValidated++;
      await this.validateSingleLink(filePath, relativePath, link);
    }
  }

  private async validateSingleLink(
    sourceFile: string, 
    sourceRelativePath: string, 
    link: LinkInfo
  ): Promise<void> {
    // Skip external links
    if (link.isExternal) {
      return;
    }

    if (!link.filePart) {
      // Anchor-only link (same file)
      if (link.anchor) {
        this.validateAnchorInFile(sourceFile, sourceRelativePath, link.anchor, link.text, link.line);
      }
      return;
    }

    // Resolve the target file path
    const sourceDir = path.dirname(sourceFile);
    const targetPath = path.resolve(sourceDir, link.filePart);
    
    // Check if target file exists
    if (!await this.fileExists(targetPath)) {
      this.errors.push({
        file: sourceRelativePath,
        line: link.line,
        type: 'broken_link',
        message: `Broken link to "${link.filePart}": file does not exist`,
        link: link.url,
        linkText: link.text
      });
      return;
    }

    // Validate anchor if present
    if (link.anchor) {
      const targetRelativePath = path.relative(this.docsRoot, targetPath);
      this.validateAnchorInFile(targetPath, targetRelativePath, link.anchor, link.text, link.line, sourceRelativePath);
    }
  }

  private validateAnchorInFile(
    targetFile: string, 
    targetRelativePath: string, 
    anchor: string, 
    linkText: string, 
    lineNumber: number, 
    sourceFile?: string
  ): void {
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

  private isValidAnchor(filePath: string, anchor: string): boolean {
    const document = this.documentCache.get(filePath);
    if (!document) return false;

    const validAnchors = document.headings.map(h => h.anchor);
    return validAnchors.includes(anchor);
  }

  private isExternalLink(url: string): boolean {
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('mailto:') ||
           url.startsWith('tel:');
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private getLineNumber(content: string, position: number): number {
    return content.substring(0, position).split('\n').length;
  }
}

/**
 * Convenience function to validate all documentation cross-references
 */
export async function validateDocumentationLinks(docsRoot: string = 'docs'): Promise<ValidationResult> {
  const validator = new CrossReferenceValidator(docsRoot);
  return await validator.validate();
}

/**
 * Convenience function to validate a single file
 */
export async function validateFileLinks(filePath: string): Promise<ValidationResult> {
  const validator = new CrossReferenceValidator();
  return await validator.validateSingleFile(filePath);
}