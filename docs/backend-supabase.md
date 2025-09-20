# Supabase Backend Documentation

## Overview

This document describes the Supabase backend setup for the RockfallAI Dashboard. The backend provides authentication, multi-tenant data isolation, real-time updates, and secure storage for drone imagery.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema Setup

1. Go to your Supabase project's SQL Editor
2. Run the following SQL commands in order:

### 1. Enable Extensions

```sql
create extension if not exists "pgcrypto";
```

### 2. Create Tables

```sql
-- PROFILES (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text,
  name text,
  role text not null default 'viewer', -- 'viewer' | 'inspector' | 'manager' | 'admin'
  mine_id uuid references public.mines,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- MINES
create table public.mines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location geography(point, 4326),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- SENSORS
create table public.sensors (
  id uuid default gen_random_uuid() primary key,
  mine_id uuid references public.mines on delete cascade,
  name text,
  sensor_type text,
  status text default 'active',
  latest_reading_value double precision,
  latest_reading_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- SENSOR READINGS
create table public.sensor_readings (
  id uuid default gen_random_uuid() primary key,
  sensor_id uuid references public.sensors on delete cascade,
  value double precision,
  unit text,
  recorded_at timestamptz default now()
);

create index on public.sensor_readings (sensor_id, recorded_at desc);

-- ALERTS
create table public.alerts (
  id uuid default gen_random_uuid() primary key,
  mine_id uuid references public.mines on delete cascade,
  sensor_id uuid references public.sensors,
  level text,
  message text,
  acknowledged boolean default false,
  created_at timestamptz default now()
);

-- INCIDENTS
create table public.incidents (
  id uuid default gen_random_uuid() primary key,
  mine_id uuid references public.mines on delete cascade,
  title text,
  description text,
  status text default 'open',
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

-- DRONE IMAGERY
create table public.drone_imagery (
  id uuid default gen_random_uuid() primary key,
  mine_id uuid references public.mines on delete cascade,
  file_path text not null,
  thumbnail_path text,
  captured_at timestamptz,
  uploaded_by uuid references auth.users,
  tags text[],
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- INSPECTIONS
create table public.inspections (
  id uuid default gen_random_uuid() primary key,
  mine_id uuid references public.mines on delete cascade,
  title text not null,
  description text,
  status text default 'open',
  images uuid[] default '{}'::uuid[],
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

-- INTEGRATIONS
create table public.integrations (
  id uuid default gen_random_uuid() primary key,
  mine_id uuid references public.mines,
  provider text not null,
  config jsonb default '{}'::jsonb,
  enabled boolean default false,
  created_at timestamptz default now()
);
```

### 3. Enable Row Level Security

```sql
alter table public.profiles enable row level security;
alter table public.mines enable row level security;
alter table public.sensors enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.alerts enable row level security;
alter table public.incidents enable row level security;
alter table public.drone_imagery enable row level security;
alter table public.inspections enable row level security;
alter table public.integrations enable row level security;
```

### 4. Create RLS Policies

```sql
-- PROFILES POLICIES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- MINES POLICIES
create policy "All authenticated users can view mines"
  on public.mines for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage mines"
  on public.mines for all
  using (exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- SENSORS POLICIES
create policy "Users can view sensors in their mine"
  on public.sensors for select
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = sensors.mine_id)
    )
  );

-- ALERTS POLICIES
create policy "Users can view alerts in their mine"
  on public.alerts for select
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = alerts.mine_id)
    )
  );

-- INCIDENTS POLICIES
create policy "Users can view incidents in their mine"
  on public.incidents for select
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = incidents.mine_id)
    )
  );

create policy "Users can create incidents in their mine"
  on public.incidents for insert
  with check (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = incidents.mine_id)
    )
  );

-- DRONE IMAGERY POLICIES
create policy "Users can view imagery in their mine"
  on public.drone_imagery for select
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = drone_imagery.mine_id)
    )
  );

create policy "Users can upload imagery to their mine"
  on public.drone_imagery for insert
  with check (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = drone_imagery.mine_id)
    )
  );

-- INSPECTIONS POLICIES
create policy "Users can view inspections in their mine"
  on public.inspections for select
  using (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and (p.role = 'admin' or p.mine_id = inspections.mine_id)
    )
  );

create policy "Inspectors can create inspections"
  on public.inspections for insert
  with check (
    exists (
      select 1 from public.profiles p 
      where p.id = auth.uid() 
      and p.role in ('inspector', 'admin')
    )
  );
```

### 5. Create Profile Trigger

```sql
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer 
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Storage Buckets Setup

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:

### drone-imagery (Private)
```sql
insert into storage.buckets (id, name, public)
values ('drone-imagery', 'drone-imagery', false);
```

### drone-thumbs (Private)
```sql
insert into storage.buckets (id, name, public)
values ('drone-thumbs', 'drone-thumbs', false);
```

## Sample Data (Optional)

To get started with sample data:

```sql
-- Insert sample mine
insert into public.mines (id, name) 
values ('550e8400-e29b-41d4-a716-446655440000', 'Demo Mine Site');

-- Insert sample sensors
insert into public.sensors (mine_id, name, sensor_type, status)
values 
  ('550e8400-e29b-41d4-a716-446655440000', 'Sensor A1', 'displacement', 'active'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Sensor B2', 'pore_pressure', 'active'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Sensor C3', 'rainfall', 'offline');

-- Insert sample alerts
insert into public.alerts (mine_id, level, message)
values 
  ('550e8400-e29b-41d4-a716-446655440000', 'warning', 'Displacement exceeding threshold at Zone A'),
  ('550e8400-e29b-41d4-a716-446655440000', 'critical', 'Heavy rainfall detected - monitoring required');
```

## Authentication Flow

1. **Sign Up**: Users can sign up with email/password
2. **Profile Creation**: A profile is automatically created via trigger
3. **Role Assignment**: Admin must update user role in profiles table
4. **Mine Assignment**: Admin assigns users to mines via mine_id

## Testing

1. Create test users with different roles
2. Verify RLS policies work correctly
3. Test real-time subscriptions
4. Verify storage upload/download

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema created
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Profile trigger active
- [ ] Sample data inserted (optional)
- [ ] Authentication tested
- [ ] Real-time subscriptions tested