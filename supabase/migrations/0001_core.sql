-- Vargas Law Group core schema (Supabase Postgres). RLS is the authorization boundary for client data.
create extension if not exists "pgcrypto";
create extension if not exists btree_gist;

create type app_role as enum ('client','paralegal','attorney','office_admin','super_admin');
create type case_stage as enum ('new_inquiry','consultation_scheduled','initial_assessment','engagement_onboarding','document_collection','preparation','filed_submitted','awaiting_decision','completed','closed');
create type gateway_status as enum ('draft','connected_disabled','active','disabled','error');
create type gateway_env as enum ('test','live');
create type txn_status as enum ('pending','succeeded','failed','refunded','partially_refunded','canceled');

create table offices (id uuid primary key default gen_random_uuid(), name text not null, timezone text not null default 'America/New_York', address text, is_confirmed boolean not null default false, created_at timestamptz not null default now());

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, phone text, preferred_language text not null default 'en' check (preferred_language in ('en','es')),
  office_id uuid references offices(id), status text not null default 'active' check (status in ('active','suspended','invited')),
  created_at timestamptz not null default now());

create table user_roles (user_id uuid references profiles(id) on delete cascade, role app_role not null, primary key (user_id, role));
create table role_permissions (role app_role not null, permission text not null, primary key (role, permission));

create or replace function has_role(r app_role) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role = r) $$;
create or replace function is_staff() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles where user_id = auth.uid() and role <> 'client') $$;
create or replace function has_permission(p text) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from user_roles ur join role_permissions rp on rp.role = ur.role where ur.user_id = auth.uid() and rp.permission = p) $$;

create table cases (
  id uuid primary key default gen_random_uuid(), reference text unique not null, category text not null,
  stage case_stage not null default 'new_inquiry', client_id uuid not null references profiles(id),
  attorney_id uuid references profiles(id), paralegal_id uuid references profiles(id), office_id uuid references offices(id),
  priority text not null default 'normal', due_date date, deleted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table case_participants (case_id uuid references cases(id) on delete cascade, user_id uuid references profiles(id), relationship text, can_view_documents boolean not null default false, revoked_at timestamptz, primary key (case_id, user_id));
create table case_status_history (id bigserial primary key, case_id uuid not null references cases(id) on delete cascade, from_stage case_stage, to_stage case_stage not null, changed_by uuid references profiles(id), note text, created_at timestamptz not null default now());
create table case_notes (id uuid primary key default gen_random_uuid(), case_id uuid not null references cases(id) on delete cascade, author_id uuid not null references profiles(id), body text not null, internal boolean not null default true, created_at timestamptz not null default now());

create table documents (id uuid primary key default gen_random_uuid(), case_id uuid not null references cases(id) on delete cascade, category text, review_status text not null default 'pending' check (review_status in ('pending','approved','revision_requested','rejected')), scan_status text not null default 'unscanned', uploaded_by uuid references profiles(id), created_at timestamptz not null default now());
create table document_versions (id uuid primary key default gen_random_uuid(), document_id uuid not null references documents(id) on delete cascade, version int not null, storage_path text not null, mime text, size_bytes bigint, created_at timestamptz not null default now(), unique (document_id, version));

create table conversations (id uuid primary key default gen_random_uuid(), case_id uuid not null references cases(id) on delete cascade, created_at timestamptz not null default now());
create table messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references conversations(id) on delete cascade, sender_id uuid not null references profiles(id), body text not null, internal_note boolean not null default false, read_at timestamptz, created_at timestamptz not null default now());

create table appointment_types (id uuid primary key default gen_random_uuid(), name text not null, duration_min int not null, buffer_min int not null default 0, price_minor int, currency text);
create table appointments (
  id uuid primary key default gen_random_uuid(), type_id uuid references appointment_types(id), case_id uuid references cases(id),
  client_id uuid references profiles(id), attorney_id uuid references profiles(id), office_id uuid references offices(id),
  meeting_mode text not null check (meeting_mode in ('in_person','phone','video')), language text not null default 'en',
  starts_at timestamptz not null, ends_at timestamptz not null, status text not null default 'confirmed',
  contact_name text, contact_email text, created_at timestamptz not null default now(),
  -- server-enforced no double-booking per attorney
  constraint no_overlap exclude using gist (attorney_id with =, tstzrange(starts_at, ends_at) with &&) where (status <> 'canceled'));

create table invoices (id uuid primary key default gen_random_uuid(), case_id uuid references cases(id), client_id uuid not null references profiles(id), number text unique not null, amount_minor bigint not null check (amount_minor > 0), currency text not null default 'USD', due_date date, status text not null default 'open' check (status in ('draft','open','paid','void')), created_at timestamptz not null default now());

create table payment_gateway_configs (
  id uuid primary key default gen_random_uuid(), provider text not null, environment gateway_env not null, status gateway_status not null default 'draft',
  encrypted_credentials jsonb not null default '{}', -- AES-256-GCM blobs only; never returned to the browser
  currencies text[] not null default '{USD}', default_currency text not null default 'USD',
  allow_invoices boolean not null default true, allow_bookings boolean not null default false, allow_plans boolean not null default false, refunds_enabled boolean not null default false,
  last_test_at timestamptz, last_test_ok boolean, last_test_message text,
  created_by uuid references profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (provider, environment));
create unique index one_active_gateway on payment_gateway_configs ((true)) where status = 'active';

create table payment_transactions (id uuid primary key default gen_random_uuid(), invoice_id uuid references invoices(id), appointment_id uuid references appointments(id), config_id uuid references payment_gateway_configs(id) on delete set null, provider text not null, environment gateway_env not null, provider_ref text, amount_minor bigint not null, currency text not null, status txn_status not null default 'pending', failure_reason text, created_at timestamptz not null default now(), completed_at timestamptz);
create table payment_refunds (id uuid primary key default gen_random_uuid(), transaction_id uuid not null references payment_transactions(id), amount_minor bigint not null, reason text, status text not null default 'requested', provider_refund_id text, requested_by uuid references profiles(id), created_at timestamptz not null default now());
create table payment_webhook_events (id uuid primary key default gen_random_uuid(), provider text not null, event_id text not null, event_type text, verified boolean not null, processing_status text not null default 'received', retry_count int not null default 0, error text, received_at timestamptz not null default now(), unique (provider, event_id)); -- unique = idempotency

create table audit_logs (id bigserial primary key, actor_id uuid, action text not null, target_type text, target_id text, metadata jsonb not null default '{}', ip inet, created_at timestamptz not null default now());
revoke update, delete on audit_logs from authenticated, anon;

-- ===== RLS =====
alter table profiles enable row level security; alter table cases enable row level security; alter table case_notes enable row level security;
alter table documents enable row level security; alter table document_versions enable row level security;
alter table conversations enable row level security; alter table messages enable row level security;
alter table appointments enable row level security; alter table invoices enable row level security;
alter table payment_gateway_configs enable row level security; alter table payment_transactions enable row level security;
alter table payment_refunds enable row level security; alter table payment_webhook_events enable row level security;
alter table audit_logs enable row level security; alter table user_roles enable row level security; alter table role_permissions enable row level security;

create or replace function can_access_case(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from cases c where c.id = cid and c.deleted_at is null and (
    c.client_id = auth.uid() or c.attorney_id = auth.uid() or c.paralegal_id = auth.uid()
    or has_permission('case.view_all')
    or exists (select 1 from case_participants p where p.case_id = c.id and p.user_id = auth.uid() and p.revoked_at is null))) $$;

create policy profiles_self on profiles for select using (id = auth.uid() or is_staff());
create policy roles_self on user_roles for select using (user_id = auth.uid() or has_permission('user.manage'));
create policy cases_read on cases for select using (can_access_case(id));
create policy cases_staff_write on cases for update using (is_staff() and can_access_case(id) and has_permission('case.edit'));
-- Internal notes: staff only
create policy notes_staff on case_notes for all using (is_staff() and can_access_case(case_id));
create policy docs_read on documents for select using (can_access_case(case_id));
create policy docs_insert on documents for insert with check (can_access_case(case_id) and has_permission('document.upload'));
create policy docs_review on documents for update using (is_staff() and has_permission('document.review') and can_access_case(case_id));
create policy dv_read on document_versions for select using (exists (select 1 from documents d where d.id = document_id and can_access_case(d.case_id)));
create policy conv_read on conversations for select using (can_access_case(case_id));
-- Clients never see internal notes
create policy msg_read on messages for select using (exists (select 1 from conversations c where c.id = conversation_id and can_access_case(c.case_id)) and (internal_note = false or is_staff()));
create policy msg_insert on messages for insert with check (sender_id = auth.uid() and exists (select 1 from conversations c where c.id = conversation_id and can_access_case(c.case_id)) and (internal_note = false or is_staff()));
create policy appt_read on appointments for select using (client_id = auth.uid() or attorney_id = auth.uid() or has_permission('case.view_all'));
create policy inv_read on invoices for select using (client_id = auth.uid() or has_permission('invoice.manage'));
create policy txn_read on payment_transactions for select using (has_permission('payment_gateway.view_transactions') or exists (select 1 from invoices i where i.id = invoice_id and i.client_id = auth.uid()));
-- Gateway configs and credentials: no browser access at all. Only server routes using the service role touch them.
-- (RLS enabled with no policy = deny for anon/authenticated.)
create policy audit_read on audit_logs for select using (has_permission('audit.view'));

insert into role_permissions (role, permission) values
 ('client','case.view_own'),('client','document.upload'),('client','invoice.view_own'),
 ('paralegal','case.edit'),('paralegal','document.upload'),('paralegal','document.review'),
 ('attorney','case.edit'),('attorney','document.upload'),('attorney','document.review'),('attorney','invoice.manage'),('attorney','payment_gateway.view_transactions'),('attorney','audit.view'),
 ('office_admin','case.view_all'),('office_admin','case.edit'),('office_admin','case.assign'),('office_admin','document.upload'),('office_admin','document.review'),('office_admin','invoice.manage'),('office_admin','user.manage'),('office_admin','cms.edit'),('office_admin','audit.view'),
 ('super_admin','case.view_all'),('super_admin','case.edit'),('super_admin','case.assign'),('super_admin','document.upload'),('super_admin','document.review'),('super_admin','invoice.manage'),('super_admin','user.manage'),('super_admin','cms.edit'),('super_admin','audit.view'),
 ('super_admin','payment_gateway.view'),('super_admin','payment_gateway.create'),('super_admin','payment_gateway.edit'),('super_admin','payment_gateway.test'),('super_admin','payment_gateway.activate'),('super_admin','payment_gateway.disable'),('super_admin','payment_gateway.rotate_credentials'),('super_admin','payment_gateway.manage_webhooks'),('super_admin','payment_gateway.view_transactions'),('super_admin','payment_gateway.refund'),('super_admin','payment_gateway.export');
