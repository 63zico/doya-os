# Component Library

## Purpose

This document defines the core DOYA OS component library.

It describes reusable UI components as design contracts, not implementation code.

## Problem

DOYA OS workflows repeat the same interface needs across modules: tasks, status, review, evidence, forms, tables, notifications, and decisions.

If every screen invents these components independently, role boundaries and state language will drift.

## Solution

Use a shared component library with role-aware variants.

Every component must define:

- Purpose.
- States.
- Variants.
- Spacing.
- Typography.
- Interaction.
- Accessibility.
- Future extensions.

## User

This document is for product designers, frontend engineers, QA reviewers, and AI coding agents.

## Flow

1. Identify the user role.
2. Identify the workflow state.
3. Select the component.
4. Apply the correct variant and status.
5. Validate accessibility and mobile behavior.

## Architecture

### Core components

| Component | Purpose | States | Variants | Spacing | Typography | Interaction | Accessibility | Future extensions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| App Shell | Provides role-aware navigation and content frame. | Loading, ready, permission denied, offline. | Owner, Manager, Staff. | 16 desktop, 12 mobile content gutters. | Navigation uses `text.bodySmall`; page title uses `text.title`. | Navigation changes by role and permission. | Landmarks must expose navigation and main content. | Multi-store owner shell. |
| Navigation Item | Opens primary product modules. | Default, active, hover, disabled, alert. | Icon only, icon with label, compact staff. | 8 horizontal gap, 8 vertical padding. | `text.bodySmall`, medium weight. | Active route is visible and keyboard reachable. | Active state must not rely on color alone. | Notification-count grouping. |
| Status Badge | Communicates workflow state. | Pass, fail, pending, review, blocked, complete. | Solid, subtle, outline. | 4 vertical, 8 horizontal. | `text.caption`, semibold. | Non-clickable unless paired with filter control. | Include label and icon where needed. | Custom rule states. |
| Task Row | Shows one operational task. | Assigned, in progress, submitted, failed, complete, disabled. | Staff, manager, dense. | 12 to 16 padding. | Title `text.body`; metadata `text.caption`. | Staff rows open task action; manager rows open review detail. | Touch target at least 44px. | Drag-free reorder for SOP planning. |
| Review Queue Item | Shows item needing manager or owner action. | New, in review, overdue, resolved. | Closing, inventory, bonus, AI alert. | 12 padding, 8 internal gap. | `text.bodySmall` with semibold title. | Opens detail panel. | Severity must include text and icon. | Queue grouping and saved filters. |
| Evidence Viewer | Shows photo or source record for review. | Loading, available, unavailable, restricted. | Photo, record, side-by-side. | 16 panel padding. | Caption `text.caption`. | Zoom, compare, open source metadata. | Images require descriptive alt text. | Video and annotation tools. |
| Empty State | Explains no current work. | Empty, filtered empty, permission empty. | Staff, manager, owner. | 24 vertical, 16 horizontal. | Title `text.cardTitle`, body `text.bodySmall`. | May include one allowed action. | Must not hide errors as empty state. | Illustration only after design QA. |
| Error State | Shows recoverable failure. | Inline, page, blocking, retrying. | Staff, manager, owner. | 16 padding. | Title `text.cardTitle`; detail `text.bodySmall`. | Retry, back, contact manager, resubmit. | Clear language and focus management. | Support diagnostic copy. |
| Notification Item | Shows role-scoped alert. | Unread, read, escalated, archived. | Task, closing fail, inventory risk, bonus blocker. | 12 padding. | Title `text.bodySmall`, body `text.caption`. | Mark read, archive, open source. | Announce unread state to assistive tech. | Push notification preview. |
| Data Table | Shows dense manager or owner data. | Loading, empty, sorted, filtered, selected. | Standard, compact, review. | 12 cell padding standard, 8 compact. | Header `text.caption`; cell `text.bodySmall`. | Sort, filter, row open, pagination. | Keyboard navigation and row labels required. | Column pinning. |
| Detail Drawer | Shows contextual detail without losing queue. | Closed, opening, open, dirty, saving. | Evidence, settings, audit, recommendation. | 20 desktop, 16 mobile. | Section `text.section`, body `text.bodySmall`. | Close, save, discard, approve. | Focus trapped while modal-like. | Split-screen desktop variant. |

## Future Extension

Future component documentation may add implementation-ready Figma specs, component anatomy diagrams, responsive examples, and localization stress cases.

## Related Documents

- [Design Principles](./01_Design_Principles.md)
- [Card System](./06_Card_System.md)
- [Form System](./07_Form_System.md)
- [Button System](./08_Button_System.md)
- [Accessibility](./14_Accessibility.md)
