#!/bin/bash

# Pre-commit hook for documentation validation
# This script validates documentation consistency before allowing commits

echo "🔍 Running documentation validation..."

# Run cross-reference validation
if ! node scripts/validate-cross-references.js; then
    echo "❌ Documentation validation failed!"
    echo "Please fix the documentation issues before committing."
    echo "Run 'pnpm validate:docs' to see detailed errors."
    exit 1
fi

echo "✅ Documentation validation passed!"
exit 0