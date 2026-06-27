# Non-Goals

## Purpose

This document defines what DOYA OS is not trying to become.

Non-goals protect the platform from scope drift and help contributors reject work that may be useful but does not fit the operating system.

## Problem

AI Restaurant Operating System is a broad category. Without explicit boundaries, DOYA OS could expand into every adjacent restaurant technology problem.

This creates risk:

- The platform becomes a collection of tools instead of an operating system.
- Product work loses focus.
- AI agents generate features that sound plausible but are outside scope.
- Engineering resources are spent on replacement systems before core workflows are stable.
- Documentation becomes inconsistent because the product category is unclear.

## Solution

The following are non-goals for DOYA OS.

### 1. DOYA OS is not a KPI app

The platform may contain metrics, but metrics are not the product.

DOYA OS should connect metrics to workflows, decisions, owners, and outcomes. A dashboard without operating behavior is insufficient.

### 2. DOYA OS is not a generic chatbot

The platform may include conversational interfaces, but chat is not the system boundary.

AI behavior must be grounded in restaurant context, documented workflows, permissions, evidence, and review paths.

### 3. DOYA OS is not a POS replacement

The platform may integrate with point-of-sale systems, but replacing POS is not a core goal.

POS systems are transaction sources. DOYA OS is the operating layer that interprets, routes, and acts on operational context.

### 4. DOYA OS is not a spreadsheet clone

The platform may import, export, or display tabular data, but spreadsheets are not the operating model.

Structured workflows, ownership, review, and auditability are required.

### 5. DOYA OS is not automation without accountability

The platform should not apply material operational changes without clear authority, review, and correction paths.

Automation should reduce repetitive work while preserving accountability.

### 6. DOYA OS is not a marketing platform

Customer communication and feedback may become relevant, but marketing campaign management is not a primary platform goal.

Customer-facing work should connect to restaurant operations before it becomes product scope.

### 7. DOYA OS is not implementation-first software

The platform should not add application code before the relevant behavior, workflow, or architecture is documented.

Documentation remains the source of truth.

### 8. DOYA OS is not an autonomous restaurant operator

The platform should not become the hidden authority for pricing, staffing, purchasing, disciplinary, supplier, or financial decisions.

AI may assist these domains only when the workflow defines evidence, permission, review, and accountability.

### 9. DOYA OS is not a generic SaaS admin template

The platform needs identity, tenant, role, billing-ready ownership, and administration concepts, but those concepts must serve restaurant operations.

Generic account management is not enough if it does not protect location scope, operating authority, and auditability.

### 10. DOYA OS is not a raw data lake

The platform may collect data from many systems, but raw storage is not the goal.

Data must be structured into operating concepts that support decisions, workflows, review, and AI assistance.

## User

Non-goals are for:

- Product managers evaluating scope.
- Engineers deciding what not to build.
- AI coding agents avoiding plausible but incorrect generation.
- Reviewers checking whether pull requests match the platform intent.
- Operators clarifying what the system should and should not replace.

## Flow

Use non-goals during scope review:

1. Describe the requested feature or behavior.
2. Identify the operating workflow it supports.
3. Compare it against product goals and non-goals.
4. If it matches a non-goal, reject it or narrow the scope.
5. If it is a justified exception, record the decision in `docs/decisions/`.
6. Update related documentation before implementation.

## Architecture

Non-goals prevent premature architecture commitments.

They imply:

- POS integrations should be treated as data sources, not platform replacement scope.
- Chat interfaces should be grounded in documented AI workflows.
- Dashboards should be connected to operational actions.
- Automation should include ownership, review, and audit architecture.
- Marketing, finance, and external communication systems should not become core architecture without documented product decisions.
- Autonomous AI actions require explicit permission and review architecture before they can exist.
- SaaS administration should model restaurant ownership, location scope, and role authority.
- Data ingestion should produce operational meaning, not only centralized storage.

## Future Extension

Some non-goals may become goals later if the platform strategy changes.

For example, deeper supplier workflows or customer feedback workflows may become relevant after core operating workflows are stable. Any change from non-goal to goal requires a decision record and updates to product, architecture, and test documentation.

## Related Documents

- [Vision Bible](./README.md)
- [Mission](./01_Mission.md)
- [Vision](./02_Vision.md)
- [Philosophy](./03_Philosophy.md)
- [Core Principles](./04_Core_Principles.md)
- [Product Goals](./05_Product_Goals.md)
- [Roadmap](./08_Roadmap.md)
- [Documentation Style Guide](../STYLE_GUIDE.md)
