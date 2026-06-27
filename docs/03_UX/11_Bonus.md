# Bonus Engine

## Purpose

This document defines the Bonus Engine screen contract for DOYA OS v1.0.

The Bonus Engine shows store level progress, cooperation score, unlock state, rules, and personal share percentage when applicable.

## Problem

Bonus systems can create confusion when staff cannot see how operational behavior affects eligibility.

DOYA OS v1.0 should make bonus progress transparent without becoming payroll. It should show status and rules, not calculate payroll disbursement or replace compensation systems.

## Solution

### Primary User

Primary users: Owner, Manager, Kitchen, Hall.

### Entry Point

- Dashboard bonus card.
- Bonus navigation for owner and manager.
- Staff task surface when personal share applies.

### Screen Layout

- Store Level.
- Cooperation Score.
- My Share.
- Bonus Rules.
- Unlock Status.

### Cards

- Store Level Progress.
- Cooperation Score.
- Bonus Unlock Status.
- My Share Percentage.
- Rule Explanation.
- Blocking Issues.

### Buttons

- View Rules.
- Review Blocking Issue.
- Confirm Bonus Rule.
- Update Rule in Settings.
- View My Share.

Staff should not see rule editing buttons.

### User Actions

- Owner reviews unlock status and rules.
- Manager checks cooperation score and blockers.
- Staff view personal share percentage if applicable.
- Owner or manager reviews operational blockers.

### Empty State

Show that no bonus rule is active for the current store or business period.

For staff, hide bonus content if no share applies.

### Error State

Handle missing rules, incomplete task data, unavailable cooperation score, permission failure, and stale calculation state.

### Required Data

- Store level.
- Cooperation score.
- Bonus rule.
- Unlock threshold.
- Blocking issues.
- Personal share percentage.
- Business period.
- Calculation timestamp.

### Required API Endpoints

- `GET /bonus/status`
- `GET /bonus/rules`
- `GET /bonus/my-share`
- `GET /bonus/blockers`
- `POST /bonus/rules/{id}/confirm`

### Related Database Entities

- BonusRule
- BonusStatus
- StoreLevel
- CooperationScore
- BonusShare
- TaskCompletion
- AIInspection
- Store
- User
- Role
- AuditEvent

### Future Extensions

Future versions may connect bonus status to payroll, accounting, or detailed compensation approval.

Payroll is excluded from v1.0.

## User

The Bonus Engine is visible to all roles, but detail level differs:

- Staff see progress and personal share only.
- Managers see blockers and cooperation score.
- Owners see unlock state, rules, and decision context.

## Flow

1. System evaluates operational inputs.
2. Bonus Engine updates store level and cooperation score.
3. Staff see simple progress.
4. Manager reviews blockers.
5. Owner reviews unlock status and final decision context.

## Architecture

Bonus status depends on task completion, AI inspection outcomes, rule configuration, and role-scoped visibility.

The Bonus Engine must not expose payroll amounts or payment processing in v1.0.

## Future Extension

Future versions may add multi-period history, rule simulation, and payroll export after payroll scope is explicitly documented.

## Related Documents

- [Dashboard](./08_Dashboard.md)
- [Settings](./13_Settings.md)
- [Owner User Flow](./04_Owner_User_Flow.md)
- [MVP Scope](./14_MVP_Scope.md)
