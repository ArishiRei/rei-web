#!/usr/bin/env node

/**
 * Git Hooks Setup Script
 * 
 * This script sets up git hooks for documentation validation and other
 * quality checks. It creates or updates the pre-commit hook to include
 * documentation validation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GitHooksSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.hooksDir = path.join(this.projectRoot, '.git', 'hooks');
    this.preCommitPath = path.join(this.hooksDir, 'pre-commit');
  }

  async setup() {
    console.log('🔧 Setting up Git hooks...');

    // Check if .git directory exists
    if (!fs.existsSync(path.join(this.projectRoot, '.git'))) {
      console.log('⚠️  No .git directory found. Make sure you\'re in a Git repository.');
      return false;
    }

    // Ensure hooks directory exists
    if (!fs.existsSync(this.hooksDir)) {
      fs.mkdirSync(this.hooksDir, { recursive: true });
    }

    await this.setupPreCommitHook();
    
    console.log('✅ Git hooks setup completed!');
    return true;
  }

  async setupPreCommitHook() {
    const hookContent = this.generatePreCommitHook();
    
    // Check if pre-commit hook already exists
    if (fs.existsSync(this.preCommitPath)) {
      const existingContent = fs.readFileSync(this.preCommitPath, 'utf-8');
      
      // Check if our documentation validation is already included
      if (existingContent.includes('validate-cross-references.js')) {
        console.log('📝 Pre-commit hook already includes documentation validation');
        return;
      }
      
      // Backup existing hook
      const backupPath = `${this.preCommitPath}.backup`;
      fs.writeFileSync(backupPath, existingContent);
      console.log(`📋 Backed up existing pre-commit hook to ${backupPath}`);
    }

    // Write new pre-commit hook
    fs.writeFileSync(this.preCommitPath, hookContent);
    
    // Make it executable (Unix systems)
    if (process.platform !== 'win32') {
      fs.chmodSync(this.preCommitPath, 0o755);
    }

    console.log('📝 Pre-commit hook created with documentation validation');
  }

  generatePreCommitHook() {
    return `#!/bin/bash

# Pre-commit hook for REI Blog project
# This hook runs various quality checks before allowing commits

set -e

echo "🔍 Running pre-commit checks..."

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory"
    exit 1
fi

# Run linting
echo "📝 Running linting checks..."
if ! npm run lint; then
    echo "❌ Linting failed! Please fix the issues before committing."
    exit 1
fi

# Run documentation validation
echo "📚 Validating documentation..."
if ! node scripts/validate-cross-references.js; then
    echo "❌ Documentation validation failed!"
    echo "Please fix the documentation issues before committing."
    echo "Run 'npm run validate:docs' to see detailed errors."
    exit 1
fi

# Run structure validation
echo "🏗️  Validating project structure..."
if ! node scripts/validate-structure.js; then
    echo "❌ Project structure validation failed!"
    echo "Please fix the structure issues before committing."
    exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
`;
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('setup-git-hooks.js')) {
  const setup = new GitHooksSetup();
  
  setup.setup()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Git hooks setup failed:', error);
      process.exit(1);
    });
}

export { GitHooksSetup };