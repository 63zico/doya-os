# Prompt Dataset

## Purpose

This document defines prompt datasets for DOYA OS AI workflows.

Prompt datasets are curated examples used to design, test, and compare prompts without leaking benchmark-only examples into prompt tuning.

## Problem

Prompts can overfit to a small set of examples.

If prompt examples are mixed with benchmark examples, evaluation becomes unreliable. If prompt examples do not include multilingual and brand-specific context, prompts may fail when deployed across stores.

## Solution

Maintain prompt datasets separately from benchmark and training candidate datasets.

Prompt examples should include:

- Representative pass cases.
- Representative fail cases.
- Human review cases.
- Multilingual label notes.
- Zone-specific criteria.
- Acceptable explanation style.
- Forbidden wording examples.
- Safety examples for ambiguous evidence.

## User

This document is for AI engineers, prompt engineers, product managers, QA reviewers, and AI coding agents.

## Flow

1. Select reviewed examples eligible for prompt design.
2. Exclude benchmark-only examples.
3. Attach expected structured output.
4. Attach explanation quality notes.
5. Version the prompt dataset with the prompt version.
6. Run prompt comparisons before release.

## Architecture

### Prompt dataset record

Each prompt example should include:

| Field | Meaning |
| --- | --- |
| `example_id` | Stable example identifier. |
| `image_id` | Source image metadata ID. |
| `zone` | AI Closing zone. |
| `input_context` | Zone criteria and relevant metadata. |
| `expected_output` | Expected structured response. |
| `language_notes` | Local-language and English notes when available. |
| `do_not_use_for_benchmark` | Boolean preventing benchmark leakage. |
| `prompt_version` | Prompt version that used the example. |

### Separation rules

- Prompt datasets may use training candidates only when they are not benchmark examples.
- Benchmark examples must not be copied into prompt examples.
- Hard examples may be used for prompt design only if separate hard-example benchmark coverage remains.
- Prompt examples must preserve human review behavior for ambiguous evidence.

## Future Extension

Future prompt datasets may include multi-turn AI Manager examples, inventory reasoning examples, SOP interpretation examples, and multilingual prompt variants.

## Related Documents

- [Prompt Design](../07_AI/07_Prompt_Design.md)
- [Model Benchmark](./10_Model_Benchmark.md)
- [Training Data](./09_Training_Data.md)
