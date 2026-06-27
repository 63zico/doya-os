# Roadmap

## Purpose

This document defines the high-level roadmap for DOYA OS.

The roadmap sequences platform development without prescribing application code. It helps contributors understand what must be documented, designed, and validated before implementation expands.

## Problem

Without a roadmap, contributors may build visible features before the operating foundation exists.

Risks include:

- AI workflows without structured context.
- Dashboards before data meaning is defined.
- Frontend screens before roles and flows are documented.
- Backend services before domain boundaries are clear.
- Metrics before success is defined.
- Integrations before ownership and review behavior exist.

DOYA OS needs sequencing that protects the platform architecture.

## Solution

The roadmap is organized into phases.

### Phase 0: Documentation foundation

Define the source-of-truth documentation system.

Required outcomes:

- Documentation style guide.
- Vision Bible.
- Product domain structure.
- Decision record process.
- Initial documentation checklist for pull requests.

### Phase 1: Operating model

Define the restaurant operating model before implementation.

Required outcomes:

- User roles and permissions.
- Core operating workflows.
- Business date and location concepts.
- Daily review and exception model.
- Human ownership and approval rules.

### Phase 2: Data foundation

Define the data model required to support restaurant workflows.

Required outcomes:

- Core entities.
- Data lifecycle.
- Source-system assumptions.
- Audit and correction requirements.
- Reporting and operational state definitions.

### Phase 3: AI operating layer

Define how AI assists restaurant operations.

Required outcomes:

- AI agent roles.
- Prompt standards.
- Recommendation evidence requirements.
- Human review boundaries.
- Evaluation scenarios.
- Escalation and correction behavior.

### Phase 4: Product workflows

Design the first complete operating workflows.

Candidate workflows:

- Daily manager review.
- Opening checklist.
- Closing checklist.
- Inventory exception review.
- Sales and service summary.
- Operational decision log.

Each workflow must include user, flow, architecture, AI behavior, data requirements, and tests before application code.

### Phase 5: Platform implementation

Implement the documented operating system foundation.

Required outcomes:

- Backend services aligned to documented domains.
- Frontend surfaces aligned to role-based workflows.
- Database schema aligned to the operating model.
- AI services aligned to documented guardrails.
- Tests aligned to success metrics.

### Phase 6: Multi-location extension

Extend the platform from single-location reliability to multi-location coordination.

Required outcomes:

- Location comparison model.
- Cross-location exception review.
- Role and permission inheritance.
- Standardization workflows.
- Location-specific overrides.

## User

The roadmap is for:

- Product managers planning sequence and scope.
- Engineers avoiding premature implementation.
- AI coding agents selecting the right documentation context.
- Operators validating whether phases match restaurant reality.
- Reviewers checking whether pull requests are sequenced correctly.

## Flow

Use the roadmap during planning:

1. Identify the requested work.
2. Locate the roadmap phase it belongs to.
3. Confirm earlier phase documentation exists.
4. Create or update source-of-truth documents before implementation.
5. Define success metrics and non-goal boundaries.
6. Implement only after the relevant documentation is reviewable.
7. Record major deviations in `docs/decisions/`.

## Architecture

The roadmap creates architectural sequencing.

It expects:

- Vision to precede product requirements.
- Operating workflows to precede application code.
- Data meaning to precede schema implementation.
- AI guardrails to precede AI automation.
- Test strategy to precede broad feature expansion.
- Multi-location architecture to build on stable single-location workflows.

This sequencing keeps DOYA OS from becoming a collection of disconnected features.

## Future Extension

The roadmap should evolve as documents become source-of-truth artifacts and implementation begins.

Future roadmap updates may add:

- Finance operations.
- Supplier workflows.
- Staff training and knowledge workflows.
- Customer feedback operations.
- Franchise governance.
- Advanced forecasting.

Each addition must connect to the mission, product goals, and success metrics before it becomes implementation scope.

## Related Documents

- [Vision Bible](./README.md)
- [Mission](./01_Mission.md)
- [Vision](./02_Vision.md)
- [Core Principles](./04_Core_Principles.md)
- [Product Goals](./05_Product_Goals.md)
- [Success Metrics](./06_Success_Metrics.md)
- [Non-Goals](./07_Non_Goals.md)
- [Documentation Style Guide](../STYLE_GUIDE.md)
