# Hard Examples

## Purpose

This document defines the hard-example strategy for DOYA restaurant datasets.

Hard examples are cases where a model is likely to be uncertain, wrong, or overly confident.

## Problem

Average examples can make a model look reliable while hiding failures.

AI Closing must handle dim refrigerators, reflective stove grease, wet floors, cluttered counters, unusual layouts, cropped photos, and borderline cleanliness. If these cases are not collected intentionally, benchmarks will understate risk.

## Solution

Create a governed hard-example set.

Hard examples should include:

- Low light but still judgeable photos.
- Reflections that resemble spills or grease.
- Clean zones with visual noise.
- Dirty zones with subtle residue.
- Cropped but partially usable evidence.
- Unusual store layouts.
- Ambiguous reset conditions.
- Cases where human reviewers disagree.
- Previous critical false pass cases.
- Previous false fail cases.

## User

This document is for AI engineers, QA reviewers, human labelers, and model release owners.

## Flow

1. Identify a model error or ambiguous case.
2. Add the image to the hard-example candidate queue.
3. Label with two reviewers.
4. Adjudicate disagreement.
5. Tag the hard-example reason.
6. Add to hard-example benchmark split.
7. Re-run after prompt, model, or calibration changes.

## Architecture

### Hard-example tags

| Tag | Meaning |
| --- | --- |
| `low_light` | Dim but not unusable evidence. |
| `reflection` | Reflective surface creates visual ambiguity. |
| `subtle_residue` | Dirt or grease is visible but not obvious. |
| `clean_visual_noise` | Clean zone contains harmless visual clutter. |
| `cropped_zone` | Required area is partly missing. |
| `angle_variation` | Non-standard but realistic camera position. |
| `reviewer_disagreement` | Human reviewers initially disagreed. |
| `critical_false_pass` | Model previously passed a failing example. |
| `false_fail` | Model previously failed a passing example. |

### Hard-example rules

- Hard examples must not dominate the general benchmark.
- Hard examples must be tracked separately from normal distribution metrics.
- Critical false pass examples must remain in regression benchmarks.
- Hard examples should not be overused in prompt examples if they are part of benchmark evaluation.

## Future Extension

Future versions may include active learning that automatically suggests hard-example candidates from production human review queues.

## Related Documents

- [Model Benchmark](./10_Model_Benchmark.md)
- [Continuous Learning](./14_Continuous_Learning.md)
- [Quality Control](./06_Quality_Control.md)
