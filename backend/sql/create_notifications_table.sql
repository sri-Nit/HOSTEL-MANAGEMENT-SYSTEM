create extension if not exists pgcrypto;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  message text not null,
  type text not null check (
    type in (
      'complaint_submitted',
      'complaint_approved',
      'complaint_rejected',
      'complaint_assigned',
      'complaint_in_progress',
      'complaint_resolved',
      'complaint_escalated'
    )
  ),
  complaint_id uuid,
  "read" boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_complaint_id_idx on public.notifications (complaint_id);
create index if not exists notifications_read_idx on public.notifications ("read");
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);

create or replace function public.set_notifications_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notifications_updated_at on public.notifications;

create trigger trg_notifications_updated_at
before update on public.notifications
for each row
execute function public.set_notifications_updated_at();
