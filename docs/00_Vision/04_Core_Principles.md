# Core Principles

## Purpose

This document defines the core principles that guide DOYA OS product, engineering, AI, and documentation decisions.

Principles are decision tools. They should be used when contributors need to choose between competing approaches.

## Problem

Without explicit principles, contributors may optimize for different outcomes.

One team may prioritize speed. Another may prioritize automation. Another may prioritize dashboards. An AI coding agent may generate technically valid behavior that does not fit restaurant operations.

DOYA OS needs shared principles that make decisions consistent across domains.

## Solution

DOYA OS uses the following core principles.

### 1. Start from the operating workflow

Every feature must map to a real restaurant workflow, decision, exception, or responsibility.

Do not start from a chart, model, or interface pattern. Start from the work.

### 2. Preserve business meaning

Data must retain its operational meaning.

Examples include business date, location, service period, station, role, source system, approval state, and human owner. Losing this context makes AI assistance and reporting unreliable.

### 3. Make AI reviewable

AI output must expose enough context for a human to review it.

Recommendations should identify relevant inputs, assumptions, uncertainty, and suggested action. Material actions should have approval or correction paths.

### 4. Separate signal from decision

The system may detect a signal automatically. The decision about what to do with that signal may require a human owner.

This distinction protects the platform from premature automation.

### 5. Optimize for daily use

DOYA OS should make repeated daily work faster, clearer, and less error-prone.

Avoid interfaces or workflows that look complete in a demo but add friction during opening, service, close, inventory, purchasing, or reporting.

### 6. Document before implementation

Documentation defines the intended behavior before code makes it concrete.

AI agents and human contributors must use documentation as implementation context, not treat implementation as the only source of truth.

### 7. Prefer durable systems over isolated tools

A feature should contribute to the operating system, not become a disconnected utility.

If a capability cannot share context, ownership, or outcomes with the rest of DOYA OS, it needs stronger justification.

### 8. Design for correction

Restaurant data and AI output will be imperfect.

The platform must support correction, override, rejection, and audit trails. A correctable system is more trustworthy than a system that hides uncertainty.

## User

These principles are for:

- Product managers making scope decisions.
- Engineers designing architecture.
- Designers shaping workflows.
- AI agents generating documentation or code.
- Reviewers evaluating pull requests.
- Operators validating real-world usability.

## Flow

Use the principles as a review sequence:

1. Identify the restaurant workflow.
2. Confirm the operational data retains business meaning.
3. Define the signal, decision, action, and owner.
4. Decide where AI assists and how it remains reviewable.
5. Confirm the workflow supports daily use.
6. Document the behavior before implementation.
7. Verify the feature connects to the broader operating system.
8. Add correction and audit behavior where errors may occur.

## Architecture

These principles create cross-domain requirements:

| Principle | Architectural effect |
| --- | --- |
| Start from workflow | Product and backend services model restaurant processes. |
| Preserve meaning | Database schemas include operational context. |
| Make AI reviewable | AI systems return evidence and review metadata. |
| Separate signal from decision | Workflows distinguish detection, recommendation, approval, and execution. |
| Optimize for daily use | Frontend states support speed, clarity, and recovery. |
| Document first | Documentation becomes required implementation context. |
| Build durable systems | APIs and services share common platform concepts. |
| Design for correction | Audit trails and override paths are first-class behavior. |

## Future Extension

Future principles may be added when the platform enters new domains, such as finance, procurement, franchise governance, or automated supplier coordination.

New principles must resolve a recurring decision problem. They should not duplicate existing principles or describe general preferences.

## Related Documents

- [Vision Bible](./README.md)
- [Mission](./01_Mission.md)
- [Vision](./02_Vision.md)
- [Philosophy](./03_Philosophy.md)
- [Product Goals](./05_Product_Goals.md)
- [Success Metrics](./06_Success_Metrics.md)
- [Documentation Style Guide](../STYLE_GUIDE.md)
