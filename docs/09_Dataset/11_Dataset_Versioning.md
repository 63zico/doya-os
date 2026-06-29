# Dataset Versioning

## Purpose

This document defines versioning for DOYA restaurant datasets.

Dataset versions make AI evaluation, benchmarking, prompt comparison, and future training candidates reproducible.

## Problem

Datasets change continuously.

Images are collected, labels are corrected, privacy status changes, duplicates are removed, and hard examples are added. Without explicit versions, teams cannot reproduce benchmark results or know which data supported a release decision.

## Solution

Use immutable dataset releases.

Version pattern:

```text
dataset-{domain}-v{major}.{minor}.{patch}
```

Example:

```text
dataset-ai-closing-v1.2.0
```

## User

This document is for dataset owners, AI engineers, QA engineers, release managers, and future ML platform engineers.

## Flow

1. Candidate examples pass quality control.
2. Dataset owner proposes release.
3. Manifest is generated.
4. Distribution and privacy checks pass.
5. Version is frozen.
6. Benchmarks run against frozen version.
7. Release notes record changes.

## Architecture

### Version semantics

| Version segment | Meaning |
| --- | --- |
| Major | Split strategy or label policy changes. |
| Minor | New examples or new zones without breaking policy. |
| Patch | Metadata corrections that do not change labels or splits. |

### Manifest fields

Each release manifest should include:

- Dataset version.
- Created timestamp.
- Dataset owner.
- Source organizations, brands, and stores.
- Image count.
- Label distribution.
- Zone distribution.
- Language distribution.
- Hard-example count.
- Benchmark split IDs.
- Prompt dataset IDs.
- Training candidate IDs.
- Privacy summary.
- Hash of metadata manifest.
- Change summary.

### Immutability rules

- Do not edit a frozen dataset version.
- Correct errors in a new patch or minor version.
- Keep benchmark results tied to the exact dataset version.
- Preserve deprecated versions until retention policy allows deletion.

## Future Extension

Future implementation may include signed manifests, artifact storage, dataset cards, automated changelog generation, and integration with model release records.

## Related Documents

- [Model Benchmark](./10_Model_Benchmark.md)
- [Quality Control](./06_Quality_Control.md)
- [Data Governance](./13_Data_Governance.md)
