# Dashboard

## Purpose

This document defines the Dashboard screen contract for DOYA OS v1.0.

The Dashboard is the role-specific operating entry point. It is not a generic analytics page.

## Problem

A single dashboard can easily expose too much information to staff and too little decision context to owners.

The Dashboard must adapt by role while preserving one product mental model: show what matters now and where the user must act.

## Solution

### Primary User

Primary users: Owner, Manager, Kitchen, Hall.

### Entry Point

After login, role resolution, store selection, and business date resolution.

### Screen Layout

- Header: store, business date, role, sync state.
- Primary zone: role-specific operating summary.
- Action zone: next required action or review queue.
- Status zone: task completion, AI alerts, inventory risk, bonus progress.

### Cards

- Owner: Store Health, AI Alerts, Inventory Risk, Bonus Unlock, Manager Actions.
- Manager: Today’s Operations, Failed Inspections, Inventory Exceptions, Closing Completion, End Day Summary.
- Kitchen: Today’s Kitchen Tasks, Daily Weight, Kitchen Closing, Task Status, My Share.
- Hall: Today’s Hall Tasks, Review Target, Hall Closing, Task Status, My Share.

### Buttons

- Owner: View AI Report, Review Alerts, View Inventory Risk, View Bonus Status, Record Decision.
- Manager: Review Failed Photos, Assign Re-cleaning, Confirm Inventory, End Day Summary.
- Kitchen: Record Weight, Record Stock, Record Waste, Start Closing, Resubmit.
- Hall: View SOP, Complete Checklist, Start Closing, Resubmit.

### User Actions

- Open role-specific module.
- Review current status.
- Complete required task.
- Confirm or correct exception.
- Record decision when permitted.

### Empty State

Show a role-specific message that no tasks, alerts, or reviews are currently required for the business date.

Staff empty states should include only a finished status and next expected time if known.

### Error State

Show data freshness failure, missing store context, permission failure, or failed task load. Provide retry and contact-manager paths for staff.

### Required Data

- Tenant, store, role, business date.
- Task summary.
- AI alert count.
- Closing status.
- Inventory risk summary.
- Bonus status.
- Sync state and last updated time.

### Required API Endpoints

- `GET /dashboard`
- `GET /tasks/today`
- `GET /ai-manager/alerts/summary`
- `GET /ai-closing/status`
- `GET /inventory/risk/summary`
- `GET /bonus/status`

Endpoint names are product contracts, not implementation code.

### Related Database Entities

- Tenant
- Store
- User
- Role
- BusinessDate
- Task
- SOP
- AIInspection
- Alert
- InventoryRisk
- BonusStatus
- AuditEvent

### Future Extensions

Future dashboard extensions may add multi-store views, notification center, offline task queue, and owner trend summaries.

## User

The Dashboard serves every role, but the visible content must be role-scoped.

## Flow

1. User logs in.
2. System resolves role and store.
3. Dashboard loads business-date operating state.
4. User follows the highest-priority action.
5. Dashboard updates as tasks, inspections, and reviews change.

## Architecture

Dashboard data should be composed by backend role-aware services. The frontend should not fetch all data and hide restricted sections.

## Future Extension

The Dashboard may become the entry point for multi-store owners, but v1.0 should remain simple enough for single-store operations.

## Related Documents

- [Screen Map](./02_Screen_Map.md)
- [Navigation Model](./03_Navigation_Model.md)
- [Owner User Flow](./04_Owner_User_Flow.md)
- [Manager User Flow](./05_Manager_User_Flow.md)
- [Kitchen User Flow](./06_Kitchen_User_Flow.md)
- [Hall User Flow](./07_Hall_User_Flow.md)
