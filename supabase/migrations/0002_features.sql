create extension if not exists pgcrypto;
alter table appointments add column if not exists manage_token text not null default encode(gen_random_bytes(12),'hex');
alter table appointments add column if not exists contact_phone text, add column if not exists notes text, add column if not exists type_label text;
create unique index if not exists appt_slot_unique on appointments(starts_at) where status in ('requested','confirmed') and attorney_id is null;

create table contact_inquiries(id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, category text, preferred_contact text, language text, message text not null, status text not null default 'new', created_at timestamptz not null default now());
create table tasks(id uuid primary key default gen_random_uuid(), case_id uuid references cases(id) on delete cascade, title text not null, assignee_id uuid references profiles(id), priority text not null default 'normal', due_date date, status text not null default 'open', created_at timestamptz not null default now());
create table notifications(id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles(id) on delete cascade, title text not null, body text, read_at timestamptz, created_at timestamptz not null default now());
create table forms(id uuid primary key default gen_random_uuid(), title text not null, description text, fields jsonb not null default '[]');
create table form_assignments(id uuid primary key default gen_random_uuid(), form_id uuid not null references forms(id), case_id uuid references cases(id), client_id uuid not null references profiles(id), status text not null default 'assigned', answers jsonb not null default '{}', submitted_at timestamptz, created_at timestamptz not null default now());
create table faqs(id uuid primary key default gen_random_uuid(), question text not null, answer text not null, category text, published boolean not null default false, sort int not null default 0);
create table team_profiles(id uuid primary key default gen_random_uuid(), name text not null, title text, bio text, languages text, bar_admissions text, education text, published boolean not null default false, sort int not null default 0);

alter table contact_inquiries enable row level security; alter table tasks enable row level security; alter table notifications enable row level security;
alter table forms enable row level security; alter table form_assignments enable row level security; alter table faqs enable row level security; alter table team_profiles enable row level security;
create policy tasks_staff on tasks for select using (is_staff());
create policy notif_own on notifications for select using (user_id = auth.uid());
create policy notif_mark on notifications for update using (user_id = auth.uid());
create policy forms_read on forms for select using (auth.uid() is not null);
create policy fa_read on form_assignments for select using (client_id = auth.uid() or is_staff());
create policy faq_public on faqs for select using (published);
create policy team_public on team_profiles for select using (published);
-- contact_inquiries: no policy (service role only)

insert into storage.buckets (id, name, public) values ('documents','documents',false) on conflict do nothing;

-- Security hardening: tables from 0001 that lacked RLS
alter table offices enable row level security; alter table case_participants enable row level security; alter table case_status_history enable row level security; alter table appointment_types enable row level security;
create policy offices_read on offices for select using (true);
create policy types_read on appointment_types for select using (true);
create policy hist_read on case_status_history for select using (can_access_case(case_id));
create policy part_read on case_participants for select using (user_id = auth.uid() or is_staff());
create policy profiles_case_team on profiles for select using (exists (select 1 from cases c where (c.attorney_id = profiles.id or c.paralegal_id = profiles.id) and can_access_case(c.id)));
