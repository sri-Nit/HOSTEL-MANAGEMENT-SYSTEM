create extension if not exists pgcrypto;

create table if not exists public.escalations (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null unique,
  escalated_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'resolved_by_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists escalations_status_idx on public.escalations (status);
create index if not exists escalations_complaint_id_idx on public.escalations (complaint_id);

create or replace function public.set_escalations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_escalations_updated_at on public.escalations;

create trigger trg_escalations_updated_at
before update on public.escalations
for each row
execute function public.set_escalations_updated_at();
