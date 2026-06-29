# Training Data

## Purpose

This document defines training data boundaries for DOYA OS.

It describes how reviewed restaurant examples become eligible for future model training without defining model training code or ML pipelines.

## Problem

Not every useful image should become training data.

Some examples are benchmark-only, privacy-restricted, low-quality, disputed, or useful only for prompt design. If these examples enter training candidates without governance, model quality, privacy, and evaluation integrity are compromised.

## Solution

Create a training candidate layer separate from raw, reviewed, benchmark, and prompt datasets.

Training candidates must be:

- Human verified.
- Privacy cleared.
- Metadata complete.
- Deduplicated.
- Not part of benchmark-only splits.
- Versioned.
- Approved by a dataset owner.

## User

This document is for AI engineers, data governance owners, privacy reviewers, and future ML platform engineers.

## Flow

1. Reviewed example passes quality control.
2. Privacy reviewer confirms eligible retention.
3. Dataset owner confirms split eligibility.
4. Example is marked as training candidate.
5. Dataset version includes candidate manifest.
6. Future ML workflow may consume the manifest.

## Architecture

### Eligibility rules

| Rule | Requirement |
| --- | --- |
| Label | Final label must be verified. |
| Metadata | Required schema fields must be complete. |
| Privacy | Retention class must allow training candidate use. |
| Split | Example must not be benchmark-only. |
| Duplication | Duplicate and near-duplicate checks must pass. |
| Governance | Dataset owner approval required. |

### Training candidate manifest

A manifest should include:

- Dataset version.
- Image IDs.
- Metadata checksums.
- Label distribution.
- Brand and store distribution.
- Privacy eligibility summary.
- Excluded image count and reasons.
- Benchmark leakage check result.

## Future Extension

Future implementation may add training export jobs, model registry linkage, data lineage tools, and automated dataset cards.

This document intentionally does not define model training code.

## Related Documents

- [Dataset Versioning](./11_Dataset_Versioning.md)
- [Privacy and Retention](./12_Privacy_And_Retention.md)
- [Model Benchmark](./10_Model_Benchmark.md)
