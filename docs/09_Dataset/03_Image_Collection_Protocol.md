# Image Collection Protocol

## Purpose

This document defines how DOYA OS should collect restaurant images for AI dataset development.

It focuses on operational evidence collection for AI Closing and future restaurant computer-vision workflows.

## Problem

Uncontrolled image collection creates biased and unusable datasets.

If all images come from one store, one device, one lighting condition, one angle, or only clean examples, model evaluation will not represent real operations. If privacy-sensitive content is collected without filtering, the dataset becomes unsafe to retain.

## Solution

Collect images using a protocol that balances realism, coverage, safety, and label quality.

Collection goals:

- Cover every restaurant brand, store, zone, and workflow in scope.
- Include clean, dirty, and ambiguous examples.
- Include multiple devices, staff heights, angles, shifts, and lighting conditions.
- Exclude private or irrelevant content.
- Preserve original evidence when allowed.
- Attach metadata immediately after collection.

## User

This document is for restaurant managers, operations leads, AI engineers, data reviewers, and privacy reviewers.

Kitchen and hall staff may capture images, but managers or reviewers must verify whether images are acceptable for dataset use.

## Flow

1. Define the collection scope.
2. Select brands, stores, zones, dates, and shifts.
3. Brief staff on required angles and privacy constraints.
4. Capture images during real closing or controlled test conditions.
5. Remove images with faces, customers, payment screens, receipts, or private data.
6. Attach metadata.
7. Submit images for labeling.
8. Promote verified examples into reviewed datasets.

## Architecture

### Minimum collection targets

For each brand and store type:

| Category | Minimum per zone | Purpose |
| --- | ---: | --- |
| Clean examples | 50 | Learn valid pass conditions. |
| Dirty examples | 50 | Detect correctable issues. |
| Ambiguous examples | 20 | Calibrate human review routing. |
| Hard examples | 10 | Stress lighting, angle, reflection, and clutter. |

For six AI Closing zones, one store should contribute at least 780 labeled candidates before broad calibration.

For multi-brand readiness, collect from at least:

- 3 stores per brand when available.
- 3 devices per store when available.
- 3 common angles per zone.
- 2 lighting conditions per zone.

### Required AI Closing zones

| Zone | Required images |
| --- | --- |
| Kitchen Floor / Drain | Wide floor view, drain close view, low-light edge case. |
| Refrigerator | Open-door front view, lower shelf view, spill edge case. |
| Stove Grease | Stove edge view, grease collection close view, reflection edge case. |
| Hall Tables / Chairs | Wide reset view, side alignment view, messy reset example. |
| Hall Floor | Main walkway wide view, low-angle streak view, debris edge case. |
| Counter / POS | Counter front view, POS angle view, clutter example. |

### Collection constraints

- Do not collect customer faces.
- Do not collect payment screens or receipts.
- Do not collect staff disciplinary evidence.
- Do not stage unrealistic dirt that would not occur in operations.
- Do not use identical burst photos as separate examples.

## Future Extension

Future protocols may cover video clips, inventory shelves, inbound stock, waste evidence, SOP task evidence, and multi-modal records with text or audio notes.

## Related Documents

- [Real-World AI Closing Testing Guide](../07_AI/14_Real_World_Testing_Guide.md)
- [Labeling Guidelines](./04_Labeling_Guidelines.md)
- [Privacy and Retention](./12_Privacy_And_Retention.md)
