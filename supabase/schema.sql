-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- USERS TABLE -----------------------------------------------------------
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4() references auth.users (id) on delete cascade,
    email text not null unique,
    first_name text,
    last_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can view own profile" on public.users
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
    for update using (auth.uid() = id);

-- PROJECTS TABLE --------------------------------------------------------
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users (id) on delete cascade,
    title text not null,
    author_name text,
    status text not null default 'draft',
    format_type text,
    marketplace text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    deleted_at timestamp with time zone,
    constraint projects_status_check check (status in ('draft', 'in_progress', 'completed', 'archived'))
);

create index if not exists projects_user_idx on public.projects (user_id);
create index if not exists projects_status_idx on public.projects (status);

alter table public.projects enable row level security;

create policy "Users can access own projects" on public.projects
    using (auth.uid() = user_id);

create policy "Users can insert own projects" on public.projects
    for insert with check (auth.uid() = user_id);

-- PROJECT FILES TABLE ---------------------------------------------------
create table if not exists public.project_files (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects (id) on delete cascade,
    file_type text not null,
    file_path text not null,
    uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists project_files_project_idx on public.project_files (project_id);

alter table public.project_files enable row level security;

create policy "Users can access files via project" on public.project_files
    using (auth.uid() = (select user_id from public.projects where id = project_id));

create policy "Users can insert files via project" on public.project_files
    for insert with check (auth.uid() = (select user_id from public.projects where id = project_id));

-- PROJECT METADATA TABLE ------------------------------------------------
create table if not exists public.project_metadata (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects (id) on delete cascade,
    description text,
    keywords text[],
    categories text[],
    audience_type text,
    reading_age text,
    series_info text,
    generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.project_metadata enable row level security;

create policy "Users can access metadata via project" on public.project_metadata
    using (auth.uid() = (select user_id from public.projects where id = project_id));

create policy "Users can modify metadata via project" on public.project_metadata
    for all using (auth.uid() = (select user_id from public.projects where id = project_id));

-- FORMATTING SETTINGS TABLE --------------------------------------------
create table if not exists public.formatting_settings (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects (id) on delete cascade,
    trim_size text,
    font_family text,
    margins jsonb,
    ai_decisions_json jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.formatting_settings enable row level security;

create policy "Users can access formatting settings" on public.formatting_settings
    using (auth.uid() = (select user_id from public.projects where id = project_id));

create policy "Users can modify formatting settings" on public.formatting_settings
    for all using (auth.uid() = (select user_id from public.projects where id = project_id));

-- BISAC CATEGORIES TABLE ------------------------------------------------
create table if not exists public.bisac_categories (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    name text not null,
    parent_category text
);

alter table public.bisac_categories enable row level security;

create policy "Allow read access to BISAC catalog" on public.bisac_categories
    for select using (true);

-- Trigger to keep updated_at fresh -------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
    before update on public.projects
    for each row execute function set_updated_at();

-- STORAGE POLICIES ------------------------------------------------------
-- These policies assume buckets 'manuscripts' and 'pdfs' already exist.
-- Execute in the Storage SQL editor after creating buckets via Dashboard.

-- Manuscripts bucket policies
insert into storage.buckets (id, name) values ('manuscripts', 'manuscripts')
    on conflict (id) do nothing;

create policy "Users can manage own manuscripts" on storage.objects
    for all
    using (bucket_id = 'manuscripts' and auth.uid() = owner)
    with check (bucket_id = 'manuscripts' and path_tokens[1] = auth.uid()::text);

-- PDFs bucket policies
insert into storage.buckets (id, name) values ('pdfs', 'pdfs')
    on conflict (id) do nothing;

create policy "Users can manage own generated pdfs" on storage.objects
    for all
    using (bucket_id = 'pdfs' and auth.uid() = owner)
    with check (bucket_id = 'pdfs' and path_tokens[1] = auth.uid()::text);

