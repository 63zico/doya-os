create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'suspended', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  slug text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz,
  unique (organization_id, slug)
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid not null references public.brands(id) on delete restrict,
  name text not null,
  code text not null,
  timezone text not null default 'Asia/Bangkok',
  locale text not null default 'en',
  status text not null default 'active' check (status in ('active', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz,
  unique (organization_id, code)
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  key text not null check (key in ('OWNER', 'MANAGER', 'KITCHEN', 'HALL')),
  name text not null,
  scope text not null default 'store' check (scope in ('organization', 'brand', 'store')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, key)
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null,
  email text,
  phone text,
  status text not null default 'active' check (status in ('invited', 'active', 'inactive', 'archived')),
  default_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz
);

create table public.staff_store_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  staff_id uuid not null references public.staff(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (staff_id, store_id)
);

create table public.staff_role_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  staff_id uuid not null references public.staff(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  store_id uuid references public.stores(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (staff_id, role_id, store_id)
);

create table public.sop_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid references public.brands(id) on delete restrict,
  store_id uuid references public.stores(id) on delete restrict,
  title text not null,
  description text,
  area text not null check (area in ('kitchen', 'hall', 'manager', 'all')),
  category text not null,
  schedule_rule jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz
);

create table public.sop_task_instances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  sop_task_id uuid not null references public.sop_tasks(id) on delete restrict,
  business_date date not null,
  assigned_role text not null check (assigned_role in ('OWNER', 'MANAGER', 'KITCHEN', 'HALL')),
  assigned_staff_id uuid references public.staff(id) on delete set null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'submitted', 'complete', 'failed', 'cancelled')),
  completed_at timestamptz,
  completed_by uuid references public.staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (store_id, sop_task_id, business_date)
);

create table public.closing_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  business_date date not null,
  area text not null check (area in ('kitchen', 'hall')),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'review_required', 'complete', 'cancelled')),
  opened_at timestamptz,
  closed_at timestamptz,
  confirmed_by uuid references public.staff(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (store_id, business_date, area)
);

create table public.closing_photo_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  closing_session_id uuid not null references public.closing_sessions(id) on delete cascade,
  business_date date not null,
  area text not null check (area in ('kitchen', 'hall')),
  category text not null,
  status text not null default 'photo_required' check (status in ('not_started', 'photo_required', 'submitted', 'analyzing', 'pass', 'fail', 'human_review', 'cancelled')),
  storage_bucket text not null default 'closing-photos',
  storage_path text not null,
  content_type text not null,
  image_sha256 text,
  submitted_by uuid references public.staff(id),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vision_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  closing_photo_submission_id uuid not null references public.closing_photo_submissions(id) on delete cascade,
  status text not null check (status in ('PASS', 'FAIL', 'HUMAN_REVIEW')),
  score integer not null check (score between 0 and 100),
  confidence integer not null check (confidence between 0 and 100),
  detected_issues text[] not null default '{}',
  explanation text not null,
  recommended_actions text[] not null default '{}',
  model text not null,
  prompt_version text not null,
  raw_response jsonb not null default '{}'::jsonb,
  reviewer_staff_id uuid references public.staff(id) on delete set null,
  manager_decision text check (manager_decision in ('approved', 'rejected', 'assigned_correction')),
  manager_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  name text not null,
  sku text,
  unit text not null,
  reorder_threshold numeric(12, 3),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz,
  unique (store_id, name)
);

create table public.inventory_inbound_batches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  business_date date not null,
  quantity numeric(12, 3) not null check (quantity >= 0),
  unit_cost numeric(12, 2),
  supplier_name text,
  received_by uuid references public.staff(id),
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_daily_weights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  business_date date not null,
  weight numeric(12, 3) not null check (weight >= 0),
  unit text not null,
  recorded_by uuid references public.staff(id),
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, inventory_item_id, business_date)
);

create table public.inventory_waste_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  business_date date not null,
  quantity numeric(12, 3) not null check (quantity >= 0),
  reason text not null,
  recorded_by uuid references public.staff(id),
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_predictions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  business_date date not null,
  predicted_runout_at timestamptz,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  confidence integer not null check (confidence between 0 and 100),
  input_refs jsonb not null default '{}'::jsonb,
  model_version text,
  created_at timestamptz not null default now(),
  unique (store_id, inventory_item_id, business_date)
);

create table public.bonus_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  period_start date not null,
  period_end date not null,
  status text not null default 'open' check (status in ('open', 'locked', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (store_id, period_start, period_end)
);

create table public.bonus_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid references public.stores(id) on delete restrict,
  name text not null,
  rule_json jsonb not null,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  deleted_at timestamptz
);

create table public.bonus_pool_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  bonus_period_id uuid not null references public.bonus_periods(id) on delete cascade,
  store_level integer not null check (store_level between 0 and 100),
  cooperation_score integer not null check (cooperation_score between 0 and 100),
  pool_amount numeric(12, 2) not null default 0,
  unlock_status text not null check (unlock_status in ('locked', 'unlocked', 'blocked')),
  blockers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.personal_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid not null references public.stores(id) on delete restrict,
  bonus_period_id uuid not null references public.bonus_periods(id) on delete cascade,
  staff_id uuid not null references public.staff(id) on delete cascade,
  share_percentage numeric(5, 2) not null check (share_percentage >= 0),
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bonus_period_id, staff_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid references public.stores(id) on delete cascade,
  recipient_staff_id uuid references public.staff(id) on delete cascade,
  recipient_role_id uuid references public.roles(id) on delete cascade,
  source text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  title text not null,
  body text not null,
  action_url text,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  store_id uuid references public.stores(id) on delete restrict,
  actor_staff_id uuid references public.staff(id) on delete set null,
  actor_auth_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id uuid,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_brands_organization on public.brands(organization_id) where deleted_at is null;
create index idx_stores_organization on public.stores(organization_id) where deleted_at is null;
create index idx_stores_brand on public.stores(brand_id) where deleted_at is null;
create index idx_staff_auth_user on public.staff(auth_user_id) where deleted_at is null;
create index idx_staff_organization on public.staff(organization_id) where deleted_at is null;
create index idx_staff_store_assignments_staff on public.staff_store_assignments(staff_id, store_id, status);
create index idx_staff_role_assignments_staff on public.staff_role_assignments(staff_id, store_id, status);
create index idx_sop_instances_store_date on public.sop_task_instances(store_id, business_date);
create index idx_closing_sessions_store_date on public.closing_sessions(store_id, business_date);
create index idx_closing_submissions_store_date_status on public.closing_photo_submissions(store_id, business_date, status);
create index idx_vision_reviews_submission on public.vision_reviews(closing_photo_submission_id);
create index idx_inventory_items_store on public.inventory_items(store_id) where deleted_at is null;
create index idx_inventory_inbound_store_date on public.inventory_inbound_batches(store_id, business_date);
create index idx_inventory_weights_store_date on public.inventory_daily_weights(store_id, business_date);
create index idx_inventory_waste_store_date on public.inventory_waste_logs(store_id, business_date);
create index idx_inventory_predictions_store_date on public.inventory_predictions(store_id, business_date);
create index idx_bonus_periods_store on public.bonus_periods(store_id, period_start, period_end);
create index idx_notifications_recipient on public.notifications(recipient_staff_id, status, created_at desc);
create index idx_audit_logs_org_created on public.audit_logs(organization_id, created_at desc);
create index idx_audit_logs_store_created on public.audit_logs(store_id, created_at desc);

create trigger set_organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger set_brands_updated_at before update on public.brands for each row execute function public.set_updated_at();
create trigger set_stores_updated_at before update on public.stores for each row execute function public.set_updated_at();
create trigger set_roles_updated_at before update on public.roles for each row execute function public.set_updated_at();
create trigger set_staff_updated_at before update on public.staff for each row execute function public.set_updated_at();
create trigger set_sop_tasks_updated_at before update on public.sop_tasks for each row execute function public.set_updated_at();
create trigger set_sop_task_instances_updated_at before update on public.sop_task_instances for each row execute function public.set_updated_at();
create trigger set_closing_sessions_updated_at before update on public.closing_sessions for each row execute function public.set_updated_at();
create trigger set_closing_photo_submissions_updated_at before update on public.closing_photo_submissions for each row execute function public.set_updated_at();
create trigger set_vision_reviews_updated_at before update on public.vision_reviews for each row execute function public.set_updated_at();
create trigger set_inventory_items_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
create trigger set_inventory_inbound_batches_updated_at before update on public.inventory_inbound_batches for each row execute function public.set_updated_at();
create trigger set_inventory_daily_weights_updated_at before update on public.inventory_daily_weights for each row execute function public.set_updated_at();
create trigger set_inventory_waste_logs_updated_at before update on public.inventory_waste_logs for each row execute function public.set_updated_at();
create trigger set_bonus_periods_updated_at before update on public.bonus_periods for each row execute function public.set_updated_at();
create trigger set_bonus_rules_updated_at before update on public.bonus_rules for each row execute function public.set_updated_at();
