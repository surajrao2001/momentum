-- Momentum initial schema

-- Users profile (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  wake_time time not null default '07:00',
  daily_hour_budget numeric not null default 2.0,
  onboarding_completed boolean not null default false,
  theme_preference text not null default 'system' check (theme_preference in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  icon text not null default '🎯',
  color_token text not null default '#5B5BF0',
  category_type text not null check (category_type in ('career', 'fitness', 'creative', 'language', 'custom')),
  target_weeks int,
  weekly_hour_allocation numeric not null default 4.0,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  progress_pct numeric not null default 0,
  started_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roadmaps
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  week_number int not null,
  theme text not null,
  sub_topics jsonb not null default '[]',
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed'))
);

-- Recurrence rules
create table if not exists public.recurrence_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title_template text not null,
  days_of_week text[] not null,
  start_time time not null,
  duration_minutes int not null,
  rotation_set jsonb,
  rotation_index_field text,
  is_fixed_commitment boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Task instances
create table if not exists public.task_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  recurrence_rule_id uuid references public.recurrence_rules(id) on delete set null,
  title text not null,
  sub_tasks jsonb,
  scheduled_date date not null,
  start_time time not null,
  duration_minutes int not null,
  status text not null default 'pending' check (status in ('pending', 'done', 'partial', 'missed', 'skipped', 'rescheduled')),
  completed_at timestamptz,
  rescheduled_from_instance_id uuid references public.task_instances(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_task_instances_user_date on public.task_instances(user_id, scheduled_date);

-- Gym logs
create table if not exists public.gym_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  task_instance_id uuid not null references public.task_instances(id) on delete cascade,
  exercise_name text not null,
  set_number int not null,
  weight_kg numeric,
  reps int,
  created_at timestamptz not null default now()
);

create index if not exists idx_gym_logs_exercise on public.gym_logs(user_id, exercise_name, created_at desc);

-- Coach suggestions
create table if not exists public.coach_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  rule_key text not null,
  message text not null,
  action_payload jsonb,
  status text not null default 'pending' check (status in ('pending', 'applied', 'dismissed', 'expired')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_coach_pending on public.coach_suggestions(user_id, status) where status = 'pending';

-- Notifications
create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  body text not null,
  sent_at timestamptz not null default now(),
  delivery_channel text not null default 'web_push',
  status text not null default 'sent'
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  pre_block_reminders boolean not null default true,
  coach_suggestions boolean not null default true,
  daily_brief boolean not null default true,
  weekly_review boolean not null default true,
  quiet_hours_start time,
  quiet_hours_end time
);

create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null,
  platform text not null,
  created_at timestamptz not null default now(),
  unique(user_id, token)
);

-- RLS
alter table public.users enable row level security;
alter table public.goals enable row level security;
alter table public.roadmaps enable row level security;
alter table public.recurrence_rules enable row level security;
alter table public.task_instances enable row level security;
alter table public.gym_logs enable row level security;
alter table public.coach_suggestions enable row level security;
alter table public.notifications_log enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.device_tokens enable row level security;

create policy users_own on public.users for all using (auth.uid() = id);
create policy goals_own on public.goals for all using (auth.uid() = user_id);
create policy roadmaps_own on public.roadmaps for all using (
  exists (select 1 from public.goals g where g.id = goal_id and g.user_id = auth.uid())
);
create policy recurrence_own on public.recurrence_rules for all using (auth.uid() = user_id);
create policy tasks_own on public.task_instances for all using (auth.uid() = user_id);
create policy gym_own on public.gym_logs for all using (auth.uid() = user_id);
create policy coach_own on public.coach_suggestions for all using (auth.uid() = user_id);
create policy notif_log_own on public.notifications_log for all using (auth.uid() = user_id);
create policy notif_prefs_own on public.notification_preferences for all using (auth.uid() = user_id);
create policy device_own on public.device_tokens for all using (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  insert into public.notification_preferences (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
