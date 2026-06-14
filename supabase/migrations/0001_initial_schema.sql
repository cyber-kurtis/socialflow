create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key,
  full_name text not null,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'approver', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  provider text not null default 'instagram',
  account_name text not null,
  handle text not null,
  external_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  social_account_id uuid not null references social_accounts(id) on delete restrict,
  created_by uuid references profiles(id) on delete set null,
  title text not null,
  post_type text not null check (post_type in ('single_image', 'carousel', 'video', 'reels')),
  caption text,
  hashtags text,
  first_comment text,
  status text not null default 'draft' check (
    status in (
      'draft',
      'pending_approval',
      'revision_requested',
      'approved',
      'scheduled',
      'publishing',
      'published',
      'failed',
      'rejected',
      'cancelled'
    )
  ),
  scheduled_at timestamptz,
  timezone text not null default 'Europe/Istanbul',
  approved_by uuid references profiles(id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  external_post_url text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  sort_order integer not null default 0,
  width integer,
  height integer,
  file_size bigint,
  processing_status text not null default 'ready',
  created_at timestamptz not null default now()
);

create table if not exists post_approvals (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  reviewer_id uuid references profiles(id) on delete set null,
  decision text not null check (decision in ('approved', 'revision_requested', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists publishing_jobs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  run_at timestamptz not null,
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists publishing_attempts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  status text not null check (status in ('publishing', 'published', 'failed')),
  external_post_id text,
  external_post_url text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_id uuid references profiles(id) on delete set null,
  post_id uuid references posts(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_members enable row level security;
alter table social_accounts enable row level security;
alter table posts enable row level security;
alter table post_media enable row level security;
alter table post_approvals enable row level security;
alter table post_comments enable row level security;
alter table publishing_jobs enable row level security;
alter table publishing_attempts enable row level security;
alter table notifications enable row level security;
alter table activity_logs enable row level security;
