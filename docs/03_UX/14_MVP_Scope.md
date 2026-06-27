# MVP Scope

## Purpose

This document defines the v1.0 MVP UX scope for DOYA OS.

It protects the first release from product drift and gives contributors a clear boundary for implementation.

## Problem

The platform can expand into many adjacent systems before the core operating loop is stable.

If v1.0 includes attendance, payroll, POS integration, accounting, or delivery platform integration, the UX will become too complex for staff and too broad for the first implementation.

## Solution

v1.0 includes:

- Dashboard.
- AI Manager.
- AI Closing.
- Inventory Intelligence.
- Bonus Engine.
- SOP Library.
- Settings.

v1.0 excludes:

- Attendance.
- Payroll.
- POS integration.
- Accounting.
- Delivery platform integration.

MVP UX requirements:

- Staff see only today’s tasks, required actions, pass or fail status, Store Level progress, and personal share percentage if applicable.
- Managers see task state, failed inspections, correction actions, inventory entries, exceptions, and end-day summary.
- Owners see store health, AI Manager report, alerts, inventory risk, bonus unlock status, and final decisions.

## User

This scope is for:

- Product managers defining release boundaries.
- Designers preventing screen creep.
- Engineers sequencing implementation.
- AI coding agents avoiding excluded modules.
- Reviewers checking whether UX changes belong in v1.0.

## Flow

Use this scope during review:

1. Identify the proposed screen or behavior.
2. Map it to a v1.0 module.
3. Confirm the role that needs it.
4. Confirm it supports the product philosophy.
5. Reject or defer excluded modules.
6. Document open questions in [Open Questions](./15_Open_Questions.md).

## Architecture

The MVP requires enough backend and data support for:

- Role-aware dashboard.
- SOP task assignment.
- Closing photo submission and inspection.
- Human review and correction.
- Inventory entries and risk.
- Bonus status and rules.
- AI Manager reports and alerts.
- Settings for staff, store, roles, bonus rules, inventory items, and localization.

Excluded systems should not appear as inactive navigation items.

## Future Extension

After v1.0, excluded modules may be considered only when the operating workflows they support are documented.

## Related Documents

- [UX Architecture Bible](./README.md)
- [Product Map](./01_Product_Map.md)
- [Screen Map](./02_Screen_Map.md)
- [Open Questions](./15_Open_Questions.md)
- [Non-Goals](../00_Vision/07_Non_Goals.md)
