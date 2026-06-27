# Inventory Intelligence

## Purpose

This document defines the Inventory Intelligence screen contract for DOYA OS v1.0.

Inventory Intelligence records operational stock signals and surfaces risk without becoming accounting or ERP.

## Problem

Restaurants often track inventory through manual notes, memory, or spreadsheets.

Without structured daily entries, managers cannot identify waste, abnormal burn rate, or reorder risk. Staff still need a simple input surface; owners and managers need risk interpretation.

## Solution

### Primary User

Primary users: Manager and Kitchen.

Owner reviews inventory risk. Hall has no v1.0 inventory surface.

### Entry Point

- Kitchen enters from Dashboard tasks.
- Manager enters from Dashboard or Inventory navigation.
- Owner enters from Dashboard inventory risk card.

### Screen Layout

- Items: list of tracked ingredients.
- Inbound Stock: receiving entry form.
- Daily Weight: daily ingredient weight entry.
- Waste Log: waste entry and reason.
- Burn Rate: manager and owner view.
- Reorder Alerts: manager and owner view.

### Cards

- Today’s Required Entries.
- Inbound Stock.
- Daily Weight.
- Waste Log.
- Burn Rate Risk.
- Reorder Alerts.
- Missing Entries.

### Buttons

- Add Weight.
- Add Inbound Stock.
- Add Waste.
- Confirm Entry.
- Flag Exception.
- Review Risk.
- Mark Resolved.

### User Actions

- Kitchen records daily ingredient weights.
- Kitchen records inbound stock.
- Kitchen records waste.
- Manager confirms exceptions.
- Owner reviews inventory risk.

### Empty State

Show no inventory tasks when no items are assigned for the user role and business date.

Owner and manager empty states should state that no inventory risk is currently detected.

### Error State

Handle invalid quantity, missing unit, duplicate entry, stale item list, failed save, and permission failure.

Staff errors should explain the required correction in plain operating terms.

### Required Data

- Inventory item list.
- Unit of measure.
- Required entry schedule.
- Daily weights.
- Inbound stock records.
- Waste records.
- Burn rate calculations.
- Reorder thresholds.
- Exception status.

### Required API Endpoints

- `GET /inventory/items`
- `POST /inventory/inbound-stock`
- `POST /inventory/daily-weight`
- `POST /inventory/waste-log`
- `GET /inventory/burn-rate`
- `GET /inventory/reorder-alerts`
- `POST /inventory/exceptions/{id}/confirm`

### Related Database Entities

- InventoryItem
- InventoryUnit
- InboundStock
- DailyWeight
- WasteLog
- BurnRate
- ReorderAlert
- InventoryException
- Store
- BusinessDate
- User
- AuditEvent

### Future Extensions

Future versions may add supplier ordering, cost tracking, recipe-level consumption, forecasted prep, and POS-linked depletion.

POS integration and accounting are excluded from v1.0.

## User

Inventory has two UX modes:

- Staff input mode for kitchen.
- Risk review mode for manager and owner.

## Flow

1. Kitchen records required stock signals.
2. System stores entries by business date.
3. System identifies missing entries, waste, burn rate, and reorder risk.
4. Manager confirms or corrects exceptions.
5. Owner reviews risk when decision is required.

## Architecture

Inventory requires structured entities, unit consistency, role-scoped entry permissions, risk calculation services, and audit events for corrections.

## Future Extension

Inventory can later connect to supplier, accounting, or POS systems, but v1.0 must work without those integrations.

## Related Documents

- [Kitchen User Flow](./06_Kitchen_User_Flow.md)
- [Manager User Flow](./05_Manager_User_Flow.md)
- [Owner User Flow](./04_Owner_User_Flow.md)
- [Dashboard](./08_Dashboard.md)
- [MVP Scope](./14_MVP_Scope.md)
