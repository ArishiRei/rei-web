/**
 * ESLint Plugin for Documentation Validation
 * 
 * This plugin provides ESLint rules for validating documentation consistency
 * and cross-references within the project.
 */

import type { ESLint, Rule } from 'eslint';
import { CrossReferenceValidator } from './cross-reference-validator';

interface DocsValidationOptions {
  docsRoot?: string;
  failOnBrokenLinks?: boolean;
  excludePatterns?: string[];
}

const docsValidationRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate documentation cross-references and consistency',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: undefined,
    schema: [
      {
        type: 'object',
        properties: {
          docsRoot: {
            type: 'string',
            default: 'docs'
          },
          failOnBrokenLinks: {
            type: 'boolean',
            default: true
          },
          excludePatterns: {
            type: 'array',
            items: {
              type: 'string'
            },
            default: []
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      brokenLink: 'Broken documentation link: {{link}}',
      brokenAnchor: 'Broken anchor reference: {{anchor}} in {{file}}',
      validationError: 'Documentation validation error: {{message}}'
    }
  },

  create(context) {
    const options: DocsValidationOptions = context.options[0] || {};
    const docsRoot = options.docsRoot || 'docs';
    const failOnBrokenLinks = options.failOnBrokenLinks !== false;
    
    // Only run on markdown files
    const filename = context.getFilename();
    if (!filename.endsWith('.md')) {
      return {};
    }

    // Skip if file is in exclude patterns
    if (options.excludePatterns?.some(pattern => filename.includes(pattern))) {
      return {};
    }

    let validationPromise: Promise<void> | null = null;

    return {
      Program(node) {
        // Run validation asynchronously
        validationPromise = (async () => {
          try {
            const validator = new CrossReferenceValidator(docsRoot);
            const result = await validator.validateSingleFile(filename);

            if (!result.success && failOnBrokenLinks) {
              for (const error of result.errors) {
                const line = error.line || 1;
                const column = 0;

                context.report({
                  node,
                  loc: { line, column },
                  messageId: error.type === 'broken_anchor' ? 'brokenAnchor' : 
                           error.type === 'broken_link' ? 'brokenLink' : 'validationError',
                  data: {
                    link: error.link || error.message,
                    anchor: error.link?.split('#')[1] || '',
                    file: error.file,
                    message: error.message
                  }
                });
              }
            }
          } catch (error) {
            context.report({
              node,
              messageId: 'validationError',
              data: {
                message: error instanceof Error ? error.message : 'Unknown validation error'
              }
            });
          }
        })();
      },

      'Program:exit'() {
        // Ensure validation completes before ESLint finishes
        if (validationPromise) {
          return validationPromise;
        }
      }
    };
  }
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'eslint-plugin-docs',
    version: '1.0.0'
  },
  rules: {
    'validate-cross-references': docsValidationRule
  }
};

export default plugin;