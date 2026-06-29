# Dataset Philosophy

## Purpose

This document defines the principles behind the DOYA Restaurant Dataset Platform.

It explains why DOYA OS needs governed restaurant datasets before AI decisions can become reliable operating behavior.

## Problem

Restaurant AI quality is limited by the quality of the examples used to evaluate and improve it.

If the dataset is biased toward clean photos, one brand, one lighting condition, one store layout, or one language, the evaluator may fail in real operations. If labels are inconsistent, model benchmarks become misleading. If privacy rules are absent, useful data becomes unsafe to keep.

## Solution

Treat datasets as operational infrastructure.

Core principles:

- Real restaurant evidence is more valuable than synthetic perfection.
- False passes are more dangerous than false fails.
- Human verification is required before examples influence benchmarks or model behavior.
- Metadata is part of the dataset, not an optional annotation.
- Dataset versions must be reproducible.
- Privacy and retention are product requirements.
- Multilingual metadata must preserve local operating context.
- Benchmarks must remain stable enough to compare model and prompt changes.
- Hard examples should be intentionally collected, reviewed, and protected from overfitting.

## User

This document is for AI engineers, data architects, product managers, privacy reviewers, and restaurant operators.

It affects staff and managers indirectly because AI behavior trained or calibrated from these datasets will influence closing review, human review routing, and operational trust.

## Flow

Dataset thinking should follow this order:

1. Define the operational decision the dataset supports.
2. Collect representative examples from real workflows.
3. Attach complete metadata.
4. Label with human operating judgment.
5. Verify and resolve disagreements.
6. Promote examples into a versioned dataset.
7. Benchmark model behavior.
8. Use failures to improve prompts, policies, or collection.

## Architecture

The dataset platform supports the AI architecture but does not replace human review.

It connects:

- AI Closing evidence.
- Human review outcomes.
- Prompt datasets.
- Benchmark sets.
- Training candidates.
- Dataset versions.
- Privacy and governance records.

The platform should make every AI quality claim traceable to a dataset version and benchmark run.

## Future Extension

Future dataset philosophy may add non-image datasets for inventory, SOP execution, AI Manager recommendations, review text, voice notes, and multi-modal operational records.

The core principle should remain stable: no AI release should rely on unlabeled, unverified, or unversioned data.

## Related Documents

- [Dataset Platform](./README.md)
- [Quality Control](./06_Quality_Control.md)
- [Model Benchmark](./10_Model_Benchmark.md)
- [Privacy and Retention](./12_Privacy_And_Retention.md)
