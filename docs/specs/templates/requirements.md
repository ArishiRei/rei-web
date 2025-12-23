# Requirements Document

## Introduction

[Provide a clear summary of the feature or system being specified. Explain the purpose, scope, and high-level goals. Keep this section concise but comprehensive enough for stakeholders to understand the feature's value and context.]

## Glossary

[Define all system names, technical terms, and domain-specific vocabulary used throughout this document. Every term that appears in requirements must be defined here.]

- **System_Name**: [Definition of the primary system being developed]
- **Technical_Term**: [Definition of any technical concepts]
- **Domain_Concept**: [Definition of business or domain-specific terms]

## Requirements

### Requirement 1

**User Story:** As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria

[Each acceptance criterion must follow exactly one of the six EARS patterns. Use the system names defined in the glossary.]

1. THE [System_Name] SHALL [response]
2. WHEN [trigger], THE [System_Name] SHALL [response]
3. WHILE [condition], THE [System_Name] SHALL [response]
4. IF [condition], THEN THE [System_Name] SHALL [response]
5. WHERE [option], THE [System_Name] SHALL [response]

### Requirement 2

**User Story:** As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria

1. [EARS-compliant requirement]
2. [EARS-compliant requirement]
3. [EARS-compliant requirement]

[Continue with additional requirements as needed...]

---

## Template Guidelines

### EARS Patterns Reference

Use exactly one of these six patterns for each acceptance criterion:

1. **Ubiquitous**: THE [system] SHALL [response]
2. **Event-driven**: WHEN [trigger], THE [system] SHALL [response]
3. **State-driven**: WHILE [condition], THE [system] SHALL [response]
4. **Unwanted event**: IF [condition], THEN THE [system] SHALL [response]
5. **Optional feature**: WHERE [option], THE [system] SHALL [response]
6. **Complex**: [WHERE] [WHILE] [WHEN/IF] THE [system] SHALL [response] (in this order)

### INCOSE Quality Rules

Every requirement must comply with:
- **Active voice**: Clearly state who does what
- **No vague terms**: Avoid "quickly", "adequate", "reasonable"
- **No escape clauses**: Avoid "where possible", "if feasible"
- **No negative statements**: Use positive statements instead of "SHALL not..."
- **One thought per requirement**: Each requirement addresses a single concern
- **Explicit conditions**: All conditions and criteria must be measurable
- **Consistent terminology**: Use terms exactly as defined in the glossary
- **No pronouns**: Avoid "it", "them", "they" - use specific system names
- **No absolutes**: Avoid "never", "always", "100%" unless truly absolute
- **Solution-free**: Focus on what the system should do, not how

### Common Correctness Patterns

Consider these patterns when writing acceptance criteria:

- **Invariants**: Properties that remain constant (e.g., "collection size after map")
- **Round Trip Properties**: Operations with inverses (e.g., "decode(encode(x)) == x")
- **Idempotence**: Operations where doing twice = doing once
- **Metamorphic Properties**: Relationships between components
- **Error Conditions**: Proper handling of invalid inputs

### Parser/Serializer Requirements

If your feature involves parsing or serialization:
- **Always include a pretty printer requirement** for round-trip testing
- **Always include round-trip acceptance criteria** (parse then print should equal original)
- **Reference the specific grammar** being parsed
- **Include error handling** for malformed input

### Requirements Traceability

Each requirement will be referenced in:
- Design document correctness properties
- Implementation tasks
- Test cases and validation procedures

Ensure requirements are:
- **Numbered consistently** (1.1, 1.2, 2.1, etc.)
- **Traceable** to business needs
- **Testable** through acceptance criteria
- **Complete** covering all necessary functionality