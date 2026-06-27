# Screen Map

## Purpose

This document defines the required screen hierarchy for DOYA OS v1.0.

It gives designers, engineers, and AI coding agents a stable map of the product surface before visual design or implementation begins.

## Problem

If screens are added without hierarchy, DOYA OS can become difficult to navigate during service.

Staff need short paths to required tasks. Managers need review queues. Owners need decision surfaces. The screen map must support those role needs without exposing excluded modules.

## Solution

Required v1.0 screen map:

```text
Dashboard
├── AI Manager
│   ├── Daily Report
│   ├── Alerts
│   └── Recommendations
├── AI Closing
│   ├── Kitchen Closing
│   │   ├── Floor / Drain
│   │   ├── Refrigerator
│   │   └── Stove Grease
│   ├── Hall Closing
│   │   ├── Tables / Chairs
│   │   ├── Floor
│   │   └── Counter / POS
│   ├── Human Review
│   └── Closing History
├── Inventory
│   ├── Items
│   ├── Inbound Stock
│   ├── Daily Weight
│   ├── Waste Log
│   ├── Burn Rate
│   └── Reorder Alerts
├── Bonus
│   ├── Store Level
│   ├── Cooperation Score
│   ├── My Share
│   └── Bonus Rules
├── SOP Library
│   ├── Opening SOP
│   ├── Closing SOP
│   ├── Cleaning SOP
│   └── Inventory SOP
└── Settings
    ├── Staff
    ├── Store
    ├── Roles
    ├── Bonus Rules
    ├── Inventory Items
    └── Localization
```

Role exposure:

| Screen area | Owner | Manager | Kitchen | Hall |
| --- | --- | --- | --- | --- |
| Dashboard | Full | Operations | Task status | Task status |
| AI Manager | Full | Review and action | Hidden | Hidden |
| AI Closing | History and risk | Full review | Kitchen submit | Hall submit |
| Inventory | Risk and summary | Manage entries | Kitchen entries | Hidden |
| Bonus | Unlock and rules | Store progress | My share | My share |
| SOP Library | Read | Manage and read | Today only | Today only |
| Settings | Full | Limited | Hidden | Hidden |

### SOP Library contract

SOP Library is a v1.0 module, but it does not have a separate document in this file set. Its screen contract is defined here.

Purpose:

- Present operating standards as role-specific daily tasks.
- Keep staff focused on today's SOP, not the full operating manual.
- Give managers enough access to confirm which SOPs are active for the business date.

Primary users:

- Manager.
- Kitchen.
- Hall.

Screen layout:

- Opening SOP.
- Closing SOP.
- Cleaning SOP.
- Inventory SOP.
- Today’s assigned SOP tasks.

Required data:

- SOP title.
- SOP category.
- Role assignment.
- Store assignment.
- Business date applicability.
- Required task steps.
- Completion status.
- Version or updated timestamp.

Required API endpoints:

- `GET /sop-library/today`
- `GET /sop-library/categories`
- `GET /sop-library/sops/{id}`
- `POST /sop-library/tasks/{id}/complete`
- `POST /sop-library/tasks/{id}/confirm`

Related database entities:

- SOP
- SOPCategory
- SOPTask
- SOPAssignment
- TaskCompletion
- Store
- Role
- BusinessDate
- AuditEvent

## User

The screen map is for:

- UX designers defining navigation and page inventory.
- Frontend engineers defining routes and layouts.
- Backend engineers inferring authorization and data boundaries.
- AI agents understanding which workflows are visible to each role.

## Flow

The default entry is Dashboard. Every role lands on the Dashboard and sees a filtered version:

1. Owner enters a decision dashboard.
2. Manager enters today's operations dashboard.
3. Kitchen enters today's kitchen SOP and task status.
4. Hall enters today's hall SOP, review target, and task status.

Screens should be reachable only when the role has a clear operating reason to use them.

## Architecture

The screen map implies role-scoped routing and permissions:

- Routes must resolve against tenant, store, role, and business date.
- Hidden screens must also be unavailable through direct URL access.
- Screen data must be filtered at the API layer.
- Staff screens must return only task and status data needed for execution.
- Manager and owner screens may return review evidence, history, alerts, and recommendations.

## Future Extension

Future screen maps may add multi-store owner dashboards, supplier workflows, payroll review, attendance, POS integration, accounting exports, and delivery platform monitoring.

Those screens are excluded from v1.0.

## Related Documents

- [UX Architecture Bible](./README.md)
- [Product Map](./01_Product_Map.md)
- [Navigation Model](./03_Navigation_Model.md)
- [Dashboard](./08_Dashboard.md)
- [MVP Scope](./14_MVP_Scope.md)
