# Development Protocol

This directory contains the core development protocol for the Nuxt 4 project, extracted and modularized from the original `docs/prompt.md` file. The protocol is organized into focused, maintainable documents that define the standards, principles, and workflows for the project.

## Protocol Structure

### Core Documents

- **[Principles](./principles.md)** - Fundamental development principles and architectural philosophy
- **[Architecture](./architecture.md)** - Architectural standards and directory structure guidelines  
- **[Coding Standards](./coding-standards.md)** - Code style, quality requirements, and linting rules
- **[Workflow](./workflow.md)** - Development processes, Git workflow, and commit standards
- **[Validation](./validation.md)** - Quality gates, DoD checklists, and validation criteria

## Navigation Guide

### For New Developers
1. Start with [Principles](./principles.md) to understand the project philosophy
2. Review [Architecture](./architecture.md) to understand the project structure
3. Study [Coding Standards](./coding-standards.md) for implementation guidelines
4. Follow [Workflow](./workflow.md) for development processes
5. Use [Validation](./validation.md) to ensure quality before completion

### For Experienced Team Members
- **Quick Reference**: Jump directly to specific sections using the cross-references below
- **Updates**: When modifying standards, update the relevant protocol document and maintain cross-references
- **New Patterns**: Document new architectural patterns in the appropriate protocol section

## Cross-Reference System

### Architecture → Coding Standards
- Directory structure guidelines in [Architecture](./architecture.md) are enforced by linting rules in [Coding Standards](./coding-standards.md)
- Component organization patterns reference both documents

### Workflow → Validation  
- Git commit standards in [Workflow](./workflow.md) are validated by checklists in [Validation](./validation.md)
- Build processes reference quality gates from both documents

### Principles → All Documents
- Core principles in [Principles](./principles.md) are implemented across all other protocol documents
- Each document section should align with the fundamental principles

## Protocol Maintenance

### Updating Protocol Documents
1. Identify which protocol document needs modification
2. Update the specific document while maintaining cross-references
3. Verify that changes don't conflict with other protocol sections
4. Update this README if new cross-references are needed

### Adding New Standards
1. Determine the appropriate protocol document for new content
2. Add the new standard following the document's existing structure
3. Create cross-references to related sections in other documents
4. Update validation criteria if the new standard requires enforcement

## Integration with Project Documentation

This protocol integrates with other project documentation:

- **[Implementation Guides](../guide/)** - Detailed implementation instructions that follow these protocols
- **[Architecture Documentation](../architecture/)** - Technical architecture details that implement these standards
- **[API Documentation](../api/)** - API conventions that follow these protocols
- **[Component Documentation](../components/)** - Component usage that follows these standards

## Version History

- **v2.0** - Modularized protocol from original `docs/prompt.md`
- **v1.0** - Original monolithic protocol in `docs/prompt.md`

---

*This protocol is a living document that evolves with the project. All team members are responsible for keeping it current and accurate.*