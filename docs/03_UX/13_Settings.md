# Settings

## Purpose

This document defines the Settings screen contract for DOYA OS v1.0.

Settings manages the store, staff, roles, bonus rules, inventory items, and localization needed for the operating system.

## Problem

Settings can become a generic SaaS admin area detached from restaurant operations.

DOYA OS settings must expose only the configuration needed to run v1.0 workflows. It must not introduce payroll, attendance, POS, accounting, or delivery platform configuration.

## Solution

### Primary User

Primary users: Owner and Manager.

Kitchen and Hall do not access Settings in v1.0.

### Entry Point

- Main navigation for owner.
- Limited manager navigation when permitted.
- Contextual edit links from Bonus, Inventory, and SOP management.

### Screen Layout

- Staff.
- Store.
- Roles.
- Bonus Rules.
- Inventory Items.
- Localization.

### Cards

- Staff List.
- Store Profile.
- Role Permissions.
- Bonus Rules.
- Inventory Items.
- Language and Locale.

### Buttons

- Add Staff.
- Edit Staff.
- Deactivate Staff.
- Update Store.
- Edit Role.
- Save Bonus Rule.
- Add Inventory Item.
- Update Localization.

### User Actions

- Owner manages staff and store configuration.
- Owner or authorized manager edits inventory items.
- Owner configures bonus rules.
- Owner manages role permissions.
- Manager updates permitted operational settings.

### Empty State

Show no configured staff, inventory items, or bonus rules with a clear setup action for authorized users.

### Error State

Handle permission failure, duplicate staff, invalid role change, missing required store field, invalid inventory unit, and failed save.

### Required Data

- Staff records.
- Store profile.
- Role definitions.
- Permission matrix.
- Bonus rules.
- Inventory items.
- Localization settings.
- Audit history.

### Required API Endpoints

- `GET /settings/staff`
- `POST /settings/staff`
- `PATCH /settings/staff/{id}`
- `GET /settings/store`
- `PATCH /settings/store`
- `GET /settings/roles`
- `PATCH /settings/roles/{id}`
- `GET /settings/bonus-rules`
- `PATCH /settings/bonus-rules/{id}`
- `GET /settings/inventory-items`
- `POST /settings/inventory-items`
- `PATCH /settings/localization`

### Related Database Entities

- Tenant
- Store
- User
- Role
- Permission
- BonusRule
- InventoryItem
- LocalizationSetting
- AuditEvent

### Future Extensions

Future settings may include billing, integrations, POS connection, accounting export, attendance rules, payroll mapping, and delivery platform credentials.

Those are excluded from v1.0.

## User

Settings is for owners and authorized managers only.

## Flow

1. Owner opens Settings.
2. System verifies role permission.
3. Owner selects a settings area.
4. Owner edits configuration.
5. System validates and saves.
6. System records an audit event.

## Architecture

Settings requires strong authorization, audit logging, and validation because configuration changes affect operational workflows.

Staff roles must not have settings access in v1.0.

## Future Extension

Settings should remain modular so excluded domains can be added later without changing staff task UX.

## Related Documents

- [Navigation Model](./03_Navigation_Model.md)
- [Bonus](./11_Bonus.md)
- [Inventory](./10_Inventory.md)
- [MVP Scope](./14_MVP_Scope.md)
