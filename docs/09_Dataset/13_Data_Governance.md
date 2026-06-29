# Data Governance

## Purpose

This document defines governance for the DOYA Restaurant Dataset Platform.

Governance assigns ownership, approval authority, review responsibilities, and change control for datasets used by AI systems.

## Problem

Datasets influence product behavior.

If anyone can add labels, change benchmarks, or promote training candidates without review, DOYA OS can ship unsafe AI changes. Multi-brand datasets also require clear tenant, brand, and store boundaries.

## Solution

Use explicit governance roles and approval gates.

Governance must cover:

- Dataset ownership.
- Label reviewer access.
- Privacy review.
- Dataset release approval.
- Benchmark change control.
- Training candidate approval.
- Brand and store access boundaries.
- Audit history for changes.

## User

This document is for dataset owners, AI leads, privacy reviewers, engineering leads, product managers, and restaurant administrators.

## Flow

1. Contributor proposes dataset change.
2. Automated checks validate structure and metadata.
3. Human reviewers verify labels.
4. Privacy reviewer clears retention.
5. Dataset owner approves release.
6. Benchmark owner approves release-gate changes.
7. Audit record stores the decision.

## Architecture

### Governance roles

| Role | Responsibility |
| --- | --- |
| Dataset owner | Owns dataset versions, manifests, and release readiness. |
| Label reviewer | Labels images according to guidelines. |
| Adjudicator | Resolves label disagreement. |
| Privacy reviewer | Approves retention and privacy status. |
| Benchmark owner | Protects benchmark stability and release gates. |
| AI lead | Approves prompt, model, and calibration changes using benchmark results. |
| Brand administrator | Confirms brand-specific data permissions. |

### Approval gates

| Change | Required approval |
| --- | --- |
| New dataset version | Dataset owner and privacy reviewer. |
| Benchmark split change | Benchmark owner and AI lead. |
| Label policy change | Dataset owner and product owner. |
| Training candidate release | Dataset owner, privacy reviewer, and AI lead. |
| Retention policy change | Privacy owner and engineering lead. |

### Multi-brand governance

- Brand data must remain scoped to authorized users.
- Cross-brand benchmarks require explicit approval.
- Brand-specific fixtures must identify brand and store metadata.
- Shared benchmark reports must avoid exposing private brand details unless authorized.

## Future Extension

Future governance may include dataset access control, signed approvals, audit-log exports, data processing agreements, and tenant-specific dataset policies.

## Related Documents

- [Privacy and Retention](./12_Privacy_And_Retention.md)
- [Dataset Versioning](./11_Dataset_Versioning.md)
- [Metadata Schema](./05_Metadata_Schema.md)
