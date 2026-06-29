create or replace function public.current_staff_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select s.id
  from public.staff s
  where s.auth_user_id = auth.uid()
    and s.status = 'active'
    and s.deleted_at is null
  limit 1
$$;

create or replace function public.has_org_role(target_organization_id uuid, role_keys text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff s
    join public.staff_role_assignments sra on sra.staff_id = s.id
    join public.roles r on r.id = sra.role_id
    where s.auth_user_id = auth.uid()
      and s.status = 'active'
      and s.deleted_at is null
      and s.organization_id = target_organization_id
      and sra.organization_id = target_organization_id
      and sra.status = 'active'
      and r.key = any(role_keys)
  )
$$;

create or replace function public.has_store_role(target_store_id uuid, role_keys text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff s
    join public.stores st on st.organization_id = s.organization_id
    join public.staff_role_assignments sra on sra.staff_id = s.id
    join public.roles r on r.id = sra.role_id
    where s.auth_user_id = auth.uid()
      and s.status = 'active'
      and s.deleted_at is null
      and st.id = target_store_id
      and sra.status = 'active'
      and r.key = any(role_keys)
      and (sra.store_id = target_store_id or r.scope = 'organization')
  )
$$;

create or replace function public.can_access_org(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_org_role(target_organization_id, array['OWNER'])
    or exists (
      select 1
      from public.staff s
      where s.auth_user_id = auth.uid()
        and s.status = 'active'
        and s.deleted_at is null
        and s.organization_id = target_organization_id
    )
$$;

create or replace function public.can_access_store(target_store_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_store_role(target_store_id, array['OWNER', 'MANAGER'])
    or exists (
      select 1
      from public.staff s
      join public.staff_store_assignments ssa on ssa.staff_id = s.id
      where s.auth_user_id = auth.uid()
        and s.status = 'active'
        and s.deleted_at is null
        and ssa.store_id = target_store_id
        and ssa.status = 'active'
    )
$$;

create or replace function public.can_manage_store(target_store_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_store_role(target_store_id, array['OWNER', 'MANAGER'])
$$;

create or replace function public.can_submit_closing(target_store_id uuid, target_area text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.can_manage_store(target_store_id)
    or (target_area = 'kitchen' and public.has_store_role(target_store_id, array['KITCHEN']))
    or (target_area = 'hall' and public.has_store_role(target_store_id, array['HALL']))
$$;

create or replace function public.can_staff_see(target_staff_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_staff_id = public.current_staff_id()
    or exists (
      select 1
      from public.staff target_staff
      where target_staff.id = target_staff_id
        and public.has_org_role(target_staff.organization_id, array['OWNER'])
    )
    or exists (
      select 1
      from public.staff_store_assignments target_assignment
      where target_assignment.staff_id = target_staff_id
        and target_assignment.status = 'active'
        and public.can_manage_store(target_assignment.store_id)
    )
$$;

alter table public.organizations enable row level security;
alter table public.brands enable row level security;
alter table public.stores enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.staff enable row level security;
alter table public.staff_store_assignments enable row level security;
alter table public.staff_role_assignments enable row level security;
alter table public.sop_tasks enable row level security;
alter table public.sop_task_instances enable row level security;
alter table public.closing_sessions enable row level security;
alter table public.closing_photo_submissions enable row level security;
alter table public.vision_reviews enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_inbound_batches enable row level security;
alter table public.inventory_daily_weights enable row level security;
alter table public.inventory_waste_logs enable row level security;
alter table public.inventory_predictions enable row level security;
alter table public.bonus_periods enable row level security;
alter table public.bonus_rules enable row level security;
alter table public.bonus_pool_snapshots enable row level security;
alter table public.personal_kpi_snapshots enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "organizations_select_scoped" on public.organizations for select to authenticated using (public.can_access_org(id));
create policy "organizations_owner_update" on public.organizations for update to authenticated using (public.has_org_role(id, array['OWNER'])) with check (public.has_org_role(id, array['OWNER']));

create policy "brands_select_scoped" on public.brands for select to authenticated using (public.can_access_org(organization_id));
create policy "brands_owner_write" on public.brands for all to authenticated using (public.has_org_role(organization_id, array['OWNER'])) with check (public.has_org_role(organization_id, array['OWNER']));

create policy "stores_select_scoped" on public.stores for select to authenticated using (public.can_access_store(id));
create policy "stores_owner_write" on public.stores for all to authenticated using (public.has_org_role(organization_id, array['OWNER'])) with check (public.has_org_role(organization_id, array['OWNER']));

create policy "roles_select_scoped" on public.roles for select to authenticated using (organization_id is null or public.can_access_org(organization_id));
create policy "roles_owner_write" on public.roles for all to authenticated using (organization_id is not null and public.has_org_role(organization_id, array['OWNER'])) with check (organization_id is not null and public.has_org_role(organization_id, array['OWNER']));

create policy "permissions_select_authenticated" on public.permissions for select to authenticated using (true);
create policy "role_permissions_select_scoped" on public.role_permissions for select to authenticated using (
  exists (
    select 1 from public.roles r
    where r.id = role_id
      and (r.organization_id is null or public.can_access_org(r.organization_id))
  )
);
create policy "role_permissions_owner_write" on public.role_permissions for all to authenticated using (
  exists (
    select 1 from public.roles r
    where r.id = role_id
      and r.organization_id is not null
      and public.has_org_role(r.organization_id, array['OWNER'])
  )
) with check (
  exists (
    select 1 from public.roles r
    where r.id = role_id
      and r.organization_id is not null
      and public.has_org_role(r.organization_id, array['OWNER'])
  )
);

create policy "staff_select_visible" on public.staff for select to authenticated using (public.can_staff_see(id));
create policy "staff_owner_manager_write" on public.staff for all to authenticated using (
  public.has_org_role(organization_id, array['OWNER'])
) with check (
  public.has_org_role(organization_id, array['OWNER'])
);

create policy "staff_store_assignments_select_scoped" on public.staff_store_assignments for select to authenticated using (
  staff_id = public.current_staff_id()
  or public.can_manage_store(store_id)
);
create policy "staff_store_assignments_owner_write" on public.staff_store_assignments for all to authenticated using (
  public.has_org_role(organization_id, array['OWNER'])
) with check (
  public.has_org_role(organization_id, array['OWNER'])
);

create policy "staff_role_assignments_select_scoped" on public.staff_role_assignments for select to authenticated using (
  staff_id = public.current_staff_id()
  or public.has_org_role(organization_id, array['OWNER'])
  or (store_id is not null and public.can_manage_store(store_id))
);
create policy "staff_role_assignments_owner_write" on public.staff_role_assignments for all to authenticated using (
  public.has_org_role(organization_id, array['OWNER'])
) with check (
  public.has_org_role(organization_id, array['OWNER'])
);

create policy "sop_tasks_select_scoped" on public.sop_tasks for select to authenticated using (
  (store_id is not null and public.can_access_store(store_id))
  or (store_id is null and public.can_access_org(organization_id))
);
create policy "sop_tasks_manager_write" on public.sop_tasks for all to authenticated using (
  public.has_org_role(organization_id, array['OWNER'])
  or (store_id is not null and public.can_manage_store(store_id))
) with check (
  public.has_org_role(organization_id, array['OWNER'])
  or (store_id is not null and public.can_manage_store(store_id))
);

create policy "sop_task_instances_select_scoped" on public.sop_task_instances for select to authenticated using (public.can_access_store(store_id));
create policy "sop_task_instances_role_update" on public.sop_task_instances for update to authenticated using (
  public.can_manage_store(store_id)
  or assigned_staff_id = public.current_staff_id()
) with check (
  public.can_manage_store(store_id)
  or assigned_staff_id = public.current_staff_id()
);

create policy "closing_sessions_select_scoped" on public.closing_sessions for select to authenticated using (public.can_access_store(store_id));
create policy "closing_sessions_manager_write" on public.closing_sessions for all to authenticated using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

create policy "closing_submissions_select_scoped" on public.closing_photo_submissions for select to authenticated using (
  public.can_manage_store(store_id)
  or submitted_by = public.current_staff_id()
  or public.can_submit_closing(store_id, area)
);
create policy "closing_submissions_staff_insert" on public.closing_photo_submissions for insert to authenticated with check (
  public.can_submit_closing(store_id, area)
  and (submitted_by is null or submitted_by = public.current_staff_id())
);
create policy "closing_submissions_manager_update" on public.closing_photo_submissions for update to authenticated using (
  public.can_manage_store(store_id)
  or submitted_by = public.current_staff_id()
) with check (
  public.can_manage_store(store_id)
  or submitted_by = public.current_staff_id()
);

create policy "vision_reviews_select_scoped" on public.vision_reviews for select to authenticated using (
  public.can_manage_store(store_id)
  or exists (
    select 1
    from public.closing_photo_submissions cps
    where cps.id = closing_photo_submission_id
      and cps.submitted_by = public.current_staff_id()
  )
);
create policy "vision_reviews_manager_update" on public.vision_reviews for update to authenticated using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

create policy "inventory_items_select_scoped" on public.inventory_items for select to authenticated using (public.can_access_store(store_id));
create policy "inventory_items_manager_write" on public.inventory_items for all to authenticated using (public.can_manage_store(store_id)) with check (public.can_manage_store(store_id));

create policy "inventory_inbound_select_scoped" on public.inventory_inbound_batches for select to authenticated using (public.can_access_store(store_id));
create policy "inventory_inbound_write_scoped" on public.inventory_inbound_batches for all to authenticated using (public.can_manage_store(store_id) or public.has_store_role(store_id, array['KITCHEN'])) with check (public.can_manage_store(store_id) or public.has_store_role(store_id, array['KITCHEN']));

create policy "inventory_weights_select_scoped" on public.inventory_daily_weights for select to authenticated using (public.can_access_store(store_id));
create policy "inventory_weights_write_scoped" on public.inventory_daily_weights for all to authenticated using (public.can_manage_store(store_id) or public.has_store_role(store_id, array['KITCHEN'])) with check (public.can_manage_store(store_id) or public.has_store_role(store_id, array['KITCHEN']));

create policy "inventory_waste_select_scoped" on public.inventory_waste_logs for select to authenticated using (public.can_access_store(store_id));
create policy "inventory_waste_write_scoped" on public.inventory_waste_logs for all to authenticated using (public.can_manage_store(store_id) or public.has_store_role(store_id, array['KITCHEN'])) with check (public.can_manage_store(store_id) or public.has_store_role(store_id, array['KITCHEN']));

create policy "inventory_predictions_select_manager_owner" on public.inventory_predictions for select to authenticated using (public.can_manage_store(store_id));

create policy "bonus_periods_select_scoped" on public.bonus_periods for select to authenticated using (public.can_access_store(store_id));
create policy "bonus_periods_owner_write" on public.bonus_periods for all to authenticated using (public.has_org_role(organization_id, array['OWNER'])) with check (public.has_org_role(organization_id, array['OWNER']));

create policy "bonus_rules_select_manager_owner" on public.bonus_rules for select to authenticated using (
  public.has_org_role(organization_id, array['OWNER'])
  or (store_id is not null and public.can_manage_store(store_id))
);
create policy "bonus_rules_owner_write" on public.bonus_rules for all to authenticated using (public.has_org_role(organization_id, array['OWNER'])) with check (public.has_org_role(organization_id, array['OWNER']));

create policy "bonus_pool_select_scoped" on public.bonus_pool_snapshots for select to authenticated using (public.can_access_store(store_id));

create policy "personal_kpi_select_own_or_manager" on public.personal_kpi_snapshots for select to authenticated using (
  staff_id = public.current_staff_id()
  or public.can_manage_store(store_id)
);

create policy "notifications_select_recipient_or_manager" on public.notifications for select to authenticated using (
  recipient_staff_id = public.current_staff_id()
  or (store_id is not null and public.can_manage_store(store_id))
  or public.has_org_role(organization_id, array['OWNER'])
);
create policy "notifications_update_recipient" on public.notifications for update to authenticated using (
  recipient_staff_id = public.current_staff_id()
  or (store_id is not null and public.can_manage_store(store_id))
) with check (
  recipient_staff_id = public.current_staff_id()
  or (store_id is not null and public.can_manage_store(store_id))
);

create policy "audit_logs_select_owner_manager" on public.audit_logs for select to authenticated using (
  public.has_org_role(organization_id, array['OWNER'])
  or (store_id is not null and public.can_manage_store(store_id))
);
