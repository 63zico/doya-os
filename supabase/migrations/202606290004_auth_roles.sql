insert into public.permissions (key, description)
values
  ('organization.read', 'Read organization context.'),
  ('organization.manage', 'Manage organization settings.'),
  ('brand.manage', 'Manage brand settings.'),
  ('store.read', 'Read assigned store context.'),
  ('store.manage', 'Manage assigned store settings.'),
  ('staff.manage', 'Manage staff and assignments.'),
  ('roles.manage', 'Manage roles and permissions.'),
  ('dashboard.read', 'Read role-scoped dashboard.'),
  ('ai_closing.submit_kitchen', 'Submit kitchen closing evidence.'),
  ('ai_closing.submit_hall', 'Submit hall closing evidence.'),
  ('ai_closing.review', 'Review AI Closing failures and exceptions.'),
  ('ai_closing.history', 'Read closing history.'),
  ('inventory.read', 'Read inventory records.'),
  ('inventory.write', 'Create inventory entries.'),
  ('inventory.manage', 'Manage inventory items and corrections.'),
  ('bonus.read', 'Read bonus progress.'),
  ('bonus.manage', 'Manage bonus rules and periods.'),
  ('sop.read', 'Read SOP tasks.'),
  ('sop.execute', 'Execute assigned SOP tasks.'),
  ('sop.manage', 'Manage SOP definitions.'),
  ('notifications.read', 'Read notifications.'),
  ('audit.read', 'Read audit logs.')
on conflict (key) do update
set description = excluded.description;

create or replace function public.provision_default_roles(target_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_role_id uuid;
  manager_role_id uuid;
  kitchen_role_id uuid;
  hall_role_id uuid;
begin
  insert into public.roles (organization_id, key, name, scope)
  values
    (target_organization_id, 'OWNER', 'Owner', 'organization'),
    (target_organization_id, 'MANAGER', 'Manager', 'store'),
    (target_organization_id, 'KITCHEN', 'Kitchen', 'store'),
    (target_organization_id, 'HALL', 'Hall', 'store')
  on conflict (organization_id, key) do update
  set name = excluded.name,
      scope = excluded.scope;

  select id into owner_role_id from public.roles where organization_id = target_organization_id and key = 'OWNER';
  select id into manager_role_id from public.roles where organization_id = target_organization_id and key = 'MANAGER';
  select id into kitchen_role_id from public.roles where organization_id = target_organization_id and key = 'KITCHEN';
  select id into hall_role_id from public.roles where organization_id = target_organization_id and key = 'HALL';

  insert into public.role_permissions (role_id, permission_id)
  select owner_role_id, id from public.permissions
  on conflict do nothing;

  insert into public.role_permissions (role_id, permission_id)
  select manager_role_id, id
  from public.permissions
  where key in (
    'store.read',
    'dashboard.read',
    'ai_closing.review',
    'ai_closing.history',
    'inventory.read',
    'inventory.write',
    'inventory.manage',
    'bonus.read',
    'sop.read',
    'sop.execute',
    'sop.manage',
    'notifications.read',
    'audit.read'
  )
  on conflict do nothing;

  insert into public.role_permissions (role_id, permission_id)
  select kitchen_role_id, id
  from public.permissions
  where key in (
    'store.read',
    'dashboard.read',
    'ai_closing.submit_kitchen',
    'inventory.read',
    'inventory.write',
    'sop.read',
    'sop.execute',
    'notifications.read'
  )
  on conflict do nothing;

  insert into public.role_permissions (role_id, permission_id)
  select hall_role_id, id
  from public.permissions
  where key in (
    'store.read',
    'dashboard.read',
    'ai_closing.submit_hall',
    'bonus.read',
    'sop.read',
    'sop.execute',
    'notifications.read'
  )
  on conflict do nothing;
end;
$$;
