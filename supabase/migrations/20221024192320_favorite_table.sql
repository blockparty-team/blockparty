CREATE TYPE favorite_entity AS ENUM ('artist', 'stage', 'asset');

create table if not exists favorite (
  id uuid not null primary key DEFAULT uuid_generate_v4(),
  user_id uuid references auth.users not null,
  entity favorite_entity not null,
  ids uuid[] not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table favorite enable row level security;

create policy "Users can insert favorites" on favorite for
    insert with check (auth.uid() = user_id);

create policy "Users can view their own favorites " on favorite for
    select using (auth.uid() = user_id);

create policy "Users can update their own favorites" on favorite for
    update using (auth.uid() = user_id);
