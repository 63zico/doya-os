# Open Questions

## Purpose

This document records open UX and product architecture questions for DOYA OS v1.0.

It prevents unresolved decisions from being hidden inside screen documentation.

## Problem

The UX Bible defines enough structure to guide design and implementation, but some decisions require product, operations, backend, AI, or database alignment before code is written.

If these questions are skipped, contributors may make inconsistent assumptions about permissions, evidence, AI review, bonus visibility, and staff task scope.

## Solution

Open questions for v1.0:

| Area | Question | Why it matters |
| --- | --- | --- |
| Roles | Can one person hold multiple roles in the same store? | Affects navigation, permissions, and Dashboard content. |
| Store scope | Does v1.0 support one store per tenant or multiple stores? | Affects owner Dashboard and Settings. |
| Business date | Who can reopen or correct a completed business date? | Affects audit, manager correction, and reporting. |
| AI Closing | What confidence threshold requires Human Review? | Affects pass, fail, and manager workload. |
| Photos | Are closing photos retained permanently or by policy period? | Affects storage, privacy, and audit behavior. |
| Inventory | Which inventory items are required for v1.0 launch? | Affects staff tasks and risk calculations. |
| Waste | Are waste reasons standardized or configurable? | Affects entry UX and reporting consistency. |
| Bonus | Is personal share visible before unlock or only after unlock? | Affects staff motivation and expectation management. |
| SOP Library | Who edits SOP content in v1.0? | Affects Settings, permissions, and audit records. |
| Localization | Which languages are required for the first restaurant team? | Affects content structure and UI labels. |
| Offline | Must staff submit closing photos when network quality is poor? | Affects upload queue and error state design. |
| Notifications | Are alerts shown only in app or also pushed externally? | Affects notification architecture. |

## User

This document is for:

- Product managers resolving scope.
- Designers identifying decisions that affect flows.
- Backend engineers identifying data and permission dependencies.
- AI engineers defining inspection behavior.
- AI coding agents avoiding undocumented assumptions.

## Flow

Use open questions during planning:

1. Identify which screen or flow depends on the question.
2. Resolve the decision with product, operation, engineering, and AI stakeholders.
3. Record major decisions in `docs/decisions/`.
4. Update the affected UX document.
5. Update related database, backend, AI, API, and test documentation when those folders are authored.

## Architecture

The open questions affect:

- Authorization model.
- Store and tenant model.
- AI inspection thresholds.
- Evidence retention.
- Inventory item schema.
- Bonus rule visibility.
- SOP authoring permissions.
- Offline and retry behavior.
- Notification channels.

These questions must be resolved before implementation relies on a specific behavior.

## Future Extension

This document should shrink as decisions are made.

New open questions may be added when they block design, API, database, or AI behavior.

## Related Documents

- [UX Architecture Bible](./README.md)
- [MVP Scope](./14_MVP_Scope.md)
- [Settings](./13_Settings.md)
- [AI Closing](./09_AI_Closing.md)
- [Inventory](./10_Inventory.md)
- [Bonus](./11_Bonus.md)
- [Vision Bible Review Summary](../00_Vision/00_Review_Summary.md)
