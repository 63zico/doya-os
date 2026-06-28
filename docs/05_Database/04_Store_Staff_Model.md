# Store Staff Model

## Purpose

This document defines the staff and store assignment model for DOYA OS v1.0.

It supports role-aware UX, task assignment, audit attribution, and store-scoped RLS.

## Problem

Restaurant staff may work in specific stores, switch roles, or be deactivated while historical operational records remain.

The schema must preserve staff identity for audit history without exposing inactive staff as active operators.

## Solution

Model staff as organization-owned identities with explicit store assignments and role assignments.

## User

This model affects Owners, Managers, Kitchen staff, Hall staff, and system auditors.

## Entities

- `staff`
- `staff_store_assignments`
- `staff_role_assignments`
- `stores`
- `roles`

## Fields

### `staff`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key. |
| `organization_id` | uuid | References `organizations.id`. |
| `auth_user_id` | uuid | Supabase auth user ID; nullable before invite acceptance. |
| `display_name` | text | Required. |
| `preferred_name` | text | Optional. |
| `phone` | text | Optional. |
| `email` | text | Optional. |
| `status` | text | `invited`, `active`, `inactive`, `archived`. |
| `default_locale` | text | Optional. |
| `created_at` | timestamptz | Required. |
| `updated_at` | timestamptz | Required. |
| `created_by` | uuid | Actor. |
| `deleted_at` | timestamptz | Soft-delete for active lists. |

### `staff_store_assignments`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key. |
| `organization_id` | uuid | RLS boundary. |
| `store_id` | uuid | References `stores.id`. |
| `staff_id` | uuid | References `staff.id`. |
| `status` | text | `active`, `inactive`. |
| `started_at` | timestamptz | Required. |
| `ended_at` | timestamptz | Optional. |
| `created_at` | timestamptz | Required. |
| `created_by` | uuid | Actor. |

## Relationships

- One organization has many staff.
- One store has many staff assignments.
- One staff member may have assignments to multiple stores.
- Staff identity remains referenced by historical operational records.

## Required Indexes

- `staff(organization_id, auth_user_id)` unique where `auth_user_id is not null`.
- `staff(organization_id, status)`.
- `staff_store_assignments(store_id, status)`.
- `staff_store_assignments(staff_id, store_id)` unique for active assignments.

## Constraints

- Active staff must belong to an active organization.
- Active store assignment requires active store and active staff.
- Staff cannot be hard-deleted when referenced by audit or operational records.
- Phone and email uniqueness should be organization-scoped when enforced.

## Audit Requirements

Audit:

- Staff invite.
- Staff activation or deactivation.
- Store assignment creation or removal.
- Contact information updates.
- Role-affecting staff changes.

## RLS Considerations

- Owner can read and manage staff in organization.
- Manager can read staff assigned to the same store.
- Kitchen and Hall can read their own staff record and limited display data for assigned task owners.
- Staff PII should not be exposed broadly through operational queries.

## Future SaaS Extensions

- Multi-store staff scheduling.
- Attendance and payroll identities.
- Regional staff pools.
- External contractor access.
- Staff training records.

## Flow

1. Owner creates or invites staff.
2. Staff receives store assignment.
3. Staff receives role assignment.
4. RLS policies use assignments to scope data.
5. Historical operational records retain staff references after deactivation.

## Architecture

Staff identity is the actor model for operational records. It should be separate from payroll, attendance, and HR systems in v1.0.

## Future Extension

Future attendance or payroll models should reference `staff.id` without changing operational history.

## Related Documents

- [RBAC Model](./03_RBAC_Model.md)
- [Multi-Tenant Model](./02_Multi_Tenant_Model.md)
- [Audit Log Model](./10_Audit_Log_Model.md)
