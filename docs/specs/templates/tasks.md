# Implementation Plan

[Provide a brief overview of the implementation approach and how tasks are organized]

- [ ] 1. [First major implementation phase]
  - [Brief description of what this phase accomplishes]
  - [Key deliverables and objectives]
  - _Requirements: [X.Y, X.Z]_

- [ ] 1.1 [First specific implementation task]
  - [Detailed description of what needs to be implemented]
  - [Specific files or components to create/modify]
  - [Technical details and implementation notes]
  - _Requirements: [X.Y]_

- [ ]* 1.2 [Property-based test task]
  - **Property [N]: [Property description from design document]**
  - **Validates: Requirements [X.Y]**

- [ ] 1.3 [Next implementation task]
  - [Task details and implementation requirements]
  - _Requirements: [X.Y]_

- [ ]* 1.4 [Unit test task]
  - [Description of unit tests to implement]
  - [Specific test scenarios to cover]
  - _Requirements: [X.Y]_

- [ ] 2. [Second major implementation phase]
  - [Description of this phase]
  - _Requirements: [X.Y, X.Z]_

- [ ] 2.1 [Implementation task]
  - [Task details]
  - _Requirements: [X.Y]_

- [ ]* 2.2 [Property-based test task]
  - **Property [N]: [Property description from design document]**
  - **Validates: Requirements [X.Y]**

- [ ] 3. Checkpoint - Ensure core functionality is working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. [Additional implementation phases as needed]
  - [Continue with additional phases]
  - _Requirements: [X.Y]_

- [ ] N. Final Checkpoint - Complete validation
  - Ensure all tests pass, ask the user if questions arise.

---

## Template Guidelines

### Task Structure Requirements

Each task must include:
- **Clear Objective**: What specific code needs to be written or modified
- **Implementation Details**: Specific files, components, or modules to work on
- **Requirements Traceability**: Reference to specific requirements (e.g., _Requirements: 1.2, 3.1_)
- **Actionable Scope**: Task should be completable by a coding agent

### Task Hierarchy

Use a maximum of two levels:
- **Top-level tasks**: Major implementation phases or epics
- **Sub-tasks**: Specific coding activities (numbered with decimals: 1.1, 1.2, 2.1)

### Optional Tasks

Mark optional tasks with "*" suffix:
- **Testing tasks**: Property-based tests, unit tests, integration tests
- **Documentation tasks**: API docs, code comments (when not core functionality)
- **Enhancement tasks**: Nice-to-have features that aren't core requirements

**Important**: Only sub-tasks can be marked optional, never top-level tasks.

### Property-Based Testing Tasks

For each correctness property from the design document:
- Create a separate sub-task
- Include the exact property description from design
- Reference the requirements being validated
- Place property tests close to related implementation tasks

Format:
```
- [ ]* X.Y Write property test for [functionality]
  - **Property [N]: [Exact property text from design]**
  - **Validates: Requirements [X.Y]**
```

### Checkpoint Tasks

Include checkpoint tasks at logical breaks:
- After core functionality is implemented
- Before major integration points
- At the end of the implementation

Format:
```
- [ ] X. Checkpoint - [Brief description]
  - Ensure all tests pass, ask the user if questions arise.
```

### Task Sequencing

Organize tasks to:
- **Build incrementally**: Each task builds on previous work
- **Validate early**: Include testing tasks near related implementation
- **Minimize dependencies**: Reduce blocking between tasks
- **Enable feedback**: Include checkpoints for validation

### Requirements Traceability

Every task must reference specific requirements:
- Use the format: `_Requirements: [X.Y, X.Z]_`
- Reference granular acceptance criteria, not just user stories
- Ensure all requirements are covered by at least one task
- Group related requirements in logical task clusters

### Coding-Only Focus

Include only tasks that involve:
- Writing new code
- Modifying existing code
- Creating test code
- Setting up development infrastructure

**Exclude** tasks like:
- User acceptance testing
- Production deployment
- Performance metrics gathering
- Business process changes
- Marketing activities

### Implementation-First Approach

Follow this sequence:
1. Implement core functionality
2. Write corresponding tests
3. Validate and iterate
4. Move to next functionality

This ensures working code exists before comprehensive testing.

### Task Completion Criteria

Each task should be:
- **Specific**: Clear about what code to write
- **Measurable**: Obvious when the task is complete
- **Achievable**: Completable by a coding agent
- **Relevant**: Directly supports the requirements
- **Time-bound**: Scoped to reasonable implementation effort

### Integration with Spec System

Tasks should align with:
- **Requirements**: Every task traces to specific acceptance criteria
- **Design**: Implementation follows the documented architecture
- **Properties**: Property-based tests validate design correctness properties
- **Quality Gates**: Checkpoints ensure quality standards are met