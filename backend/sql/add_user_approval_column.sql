alter table public.users
add column if not exists is_approved boolean not null default true;

update public.users
set is_approved = false
where role = 'guard' and is_approved is distinct from false;
