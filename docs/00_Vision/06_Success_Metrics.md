# Success Metrics

## Purpose

This document defines how DOYA OS should evaluate whether the platform is succeeding.

Success metrics translate the mission into observable outcomes. They help contributors distinguish product progress from activity.

## Problem

Restaurant software can appear successful while failing to improve operations.

Common misleading indicators include:

- More dashboards.
- More AI responses.
- More notifications.
- More tracked tasks.
- More integrations.
- More data volume.

These may be useful inputs, but they do not prove that the platform improves restaurant execution, decision quality, or operating consistency.

## Solution

DOYA OS should measure success through operational outcomes, workflow reliability, AI reviewability, and contributor clarity.

### Operating metrics

These metrics evaluate whether restaurant work improves:

| Metric | Meaning |
| --- | --- |
| Exception resolution time | Time between detected issue and reviewed action. |
| Close accuracy | Percentage of closing workflows completed with required checks. |
| Inventory variance visibility | Percentage of material inventory variance with documented cause or review state. |
| Decision traceability | Percentage of important operational decisions with owner, reason, and outcome. |
| Standard execution rate | Percentage of recurring workflows completed according to documented standard. |

### AI metrics

These metrics evaluate whether AI assistance is useful and safe:

| Metric | Meaning |
| --- | --- |
| Recommendation acceptance rate | Percentage of AI recommendations approved without material correction. |
| Correction rate | Percentage of AI outputs edited, rejected, or escalated. |
| Evidence completeness | Percentage of AI recommendations that include required input context. |
| Human review coverage | Percentage of material AI-assisted actions reviewed by the correct role. |
| Escalation accuracy | Percentage of low-confidence or high-risk cases routed to human review. |

### Product metrics

These metrics evaluate whether the platform is used as an operating system:

| Metric | Meaning |
| --- | --- |
| Daily active operating workflows | Number of core workflows completed in DOYA OS per business date. |
| Workflow completion rate | Percentage of required workflows completed by responsible role. |
| Repeat usage by role | Continued use by owners, managers, and operators for recurring work. |
| Cross-domain linkage | Percentage of workflows connected to data, AI, ownership, and outcomes. |

### Documentation metrics

These metrics evaluate whether documentation remains useful:

| Metric | Meaning |
| --- | --- |
| Documentation coverage | Major product, AI, API, data, and workflow changes include documentation. |
| Decision record coverage | Major tradeoffs are recorded in `docs/decisions/`. |
| Agent readiness | AI coding agents can use docs to implement without undocumented assumptions. |

## User

Success metrics are for:

- Owners evaluating whether DOYA OS improves business operations.
- Managers evaluating daily workflow usefulness.
- Product managers prioritizing roadmap work.
- Engineers validating system behavior.
- AI contributors evaluating recommendation quality.
- Reviewers checking whether changes preserve platform intent.

## Flow

Use success metrics during planning and review:

1. Identify which product goal the work supports.
2. Select the operating, AI, product, or documentation metric affected.
3. Define how the metric can be observed.
4. Define what change would count as improvement.
5. Add tests, logs, or review flows needed to measure it.
6. Revisit the metric after real usage or review.

Do not add metrics that cannot affect product or operating decisions.

## Architecture

Success metrics create requirements for platform observability.

The architecture should support:

- Event history for workflow state changes.
- Ownership metadata for decisions and approvals.
- AI recommendation records with input evidence and review outcome.
- Business-date and location-aware reporting.
- Operational exception tracking.
- Documentation and decision record review during pull requests.

Metrics should be designed as part of the operating system, not added later as detached analytics.

## Future Extension

Future metrics may include forecasting accuracy, food cost variance reduction, labor planning accuracy, supplier reliability, customer recovery response time, and multi-location standardization.

New metrics should be added only when they are tied to documented product goals and can change a decision.

## Related Documents

- [Vision Bible](./README.md)
- [Mission](./01_Mission.md)
- [Vision](./02_Vision.md)
- [Core Principles](./04_Core_Principles.md)
- [Product Goals](./05_Product_Goals.md)
- [Non-Goals](./07_Non_Goals.md)
- [Roadmap](./08_Roadmap.md)
- [Documentation Style Guide](../STYLE_GUIDE.md)
