insert into public.users (
  name,
  email,
  password,
  role,
  hostel_block,
  room_number,
  assigned_categories
)
values (
  'System Admin',
  'admin@hcms.com',
  '$2a$10$Xn9NZdNXmLvBraH790YdqO6hd8qmH7mTNFMzWUhHk6lDqd07F4XEW',
  'admin',
  null,
  null,
  null
)
on conflict (email) do update
set
  name = excluded.name,
  password = excluded.password,
  role = excluded.role,
  hostel_block = excluded.hostel_block,
  room_number = excluded.room_number,
  assigned_categories = excluded.assigned_categories,
  updated_at = now();
