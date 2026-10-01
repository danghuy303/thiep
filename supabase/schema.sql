-- Wedding Invitation Platform — PostgreSQL / Supabase schema
-- Enable RLS in production. Never expose the service role key to the frontend.

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists templates (
  id text primary key,
  name text not null
);

create table if not exists themes (
  id text primary key,
  name text not null,
  tokens jsonb not null
);

create table if not exists weddings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id),
  slug text unique not null,
  groom jsonb not null,
  bride jsonb not null,
  wedding_date date not null,
  wedding_time text,
  lunar_date text,
  hero_image text,
  cover_image text,
  description text,
  venue_name text,
  venue_address text,
  google_maps_url text,
  facebook text,
  instagram text,
  template_id text references templates(id),
  theme_id text references themes(id),
  font_preset text default 'serif',
  layout_preset text default 'editorial',
  album_layout text default 'editorial',
  status text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  show_ornaments boolean default true,
  music_url text,
  music_enabled boolean default true,
  music_autoplay boolean default true,
  music_volume numeric default 0.35,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  name text not null,
  display_name text not null,
  slug text not null,
  number_of_guests int default 1,
  relationship text,
  guest_group text,
  status text default 'pending',
  created_at timestamptz default now(),
  unique (wedding_id, slug)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  title text not null,
  date date,
  time text,
  address text,
  description text,
  image text,
  google_maps_url text,
  icon text,
  sort_order int default 0
);

create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  title text,
  layout text
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  album_id uuid references albums(id) on delete set null,
  url text not null,
  alt text,
  width int,
  height int,
  bytes int,
  sort_order int default 0,
  is_cover boolean default false,
  category text default 'album'
);

create table if not exists love_stories (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  year text,
  title text,
  content text,
  image text,
  sort_order int default 0
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  guest_id uuid references guests(id) on delete set null,
  name text not null,
  number_of_guests int default 1,
  attendance text check (attendance in ('yes','no')),
  message text,
  created_at timestamptz default now()
);

create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  name text not null,
  message text not null,
  visibility text default 'visible',
  created_at timestamptz default now()
);

create table if not exists bank_accounts (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  bank_name text,
  account_name text,
  account_number text,
  qr_image text,
  for_person text
);

create table if not exists settings (
  wedding_id uuid primary key references weddings(id) on delete cascade,
  cover_title text,
  invitation_prefix text,
  default_guest_label text,
  share_message_template text,
  seo_title text,
  seo_description text
);

alter table weddings enable row level security;
alter table guests enable row level security;
alter table events enable row level security;
alter table photos enable row level security;
alter table love_stories enable row level security;
alter table rsvps enable row level security;
alter table wishes enable row level security;
alter table bank_accounts enable row level security;
alter table settings enable row level security;

-- Owners manage their weddings
create policy "owners manage weddings" on weddings
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "public read published weddings" on weddings
  for select using (status = 'PUBLISHED');

-- Repeat similar owner policies for child tables via wedding_id in production.
