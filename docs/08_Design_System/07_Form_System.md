# Form System

## Purpose

This document defines forms for DOYA OS.

Forms support staff entry, manager correction, owner decisions, and settings changes.

## Problem

Restaurant forms are often used in fast, noisy, mobile environments. If inputs are unclear or validation appears late, staff may submit bad data and managers must correct it later.

Settings forms also affect roles, rules, inventory items, and audit-sensitive configuration.

## Solution

Use explicit, validated, role-aware forms.

Forms must:

- Show only fields required for the current role and workflow.
- Validate before submission where possible.
- Preserve correction history for sensitive changes.
- Use clear states for saving, error, and success.
- Avoid long forms for staff workflows.

## User

This document is for designers, frontend engineers, QA reviewers, and AI coding agents.

## Flow

1. User opens form from task, review, or settings surface.
2. Form loads current context.
3. User enters required values.
4. Inline validation runs.
5. User submits.
6. System shows saved, failed, or correction state.

## Architecture

### Form components

| Component | Purpose | States | Variants | Spacing | Typography | Interaction | Accessibility | Future extensions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Text Field | Captures short text. | Empty, focused, filled, error, disabled, read-only. | Standard, compact, search. | 8 vertical gap to label; 12 control padding. | Label `text.caption`; value `text.body`. | Focus ring, clear action for search. | Label must be programmatically associated. | Masked input variants. |
| Number Field | Captures quantity, score, or threshold. | Empty, focused, filled, error, disabled. | Quantity, percentage, currency-excluded. | 12 control padding. | Use tabular numbers. | Stepper optional for small increments. | Unit must be announced with value. | Unit conversion helper. |
| Select | Chooses from constrained options. | Closed, open, selected, error, disabled. | Standard, searchable, role-limited. | 12 padding; menu max height by viewport. | `text.bodySmall`. | Keyboard selection required. | Must expose selected value and option count. | Multi-select if role design requires. |
| Checkbox | Confirms binary option. | Unchecked, checked, indeterminate, disabled. | Standard, table row. | 8 gap between box and label. | `text.bodySmall`. | Row click only when unambiguous. | Label required. | Bulk operations. |
| Photo Upload Field | Captures closing evidence. | Empty, uploading, uploaded, failed, pending inspection. | Camera, upload, resubmit. | 16 mobile padding. | Instruction `text.body`; helper `text.caption`. | Camera first on staff mobile. | Button and status must be screen-reader readable. | Offline upload queue. |
| Correction Reason | Captures manager rejection or override reason. | Empty, focused, error, submitted. | Re-cleaning, inventory correction, owner override. | 12 padding. | `text.body`. | Required before rejection or override. | Error text must identify missing reason. | Structured reason codes. |

### Validation rules

- Staff forms should validate before final submission.
- Manager correction forms require a reason.
- Owner override forms require a reason and clear consequence.
- Quantity fields must show units.
- Required fields must be visually and textually identified.

## Future Extension

Future form work may add localization, offline draft recovery, barcode entry, guided inventory entry, and form analytics for error rates.

## Related Documents

- [Button System](./08_Button_System.md)
- [Mobile First](./10_Mobile_First.md)
- [Accessibility](./14_Accessibility.md)
- [Inventory API](../06_API/08_Inventory_API.md)
