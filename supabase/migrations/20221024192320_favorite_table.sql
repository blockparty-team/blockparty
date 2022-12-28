CREATE TYPE favorite_entity AS ENUM ('artist', 'stage', 'asset');

create table if not exists favorite (
  user_id uuid references auth.users not null,
  entity favorite_entity not null,
  ids uuid[] not null,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY(user_id, entity)
);

alter table favorite enable row level security;

create policy "Users can insert favorites" on favorite for
    insert with check (auth.uid() = user_id);

create policy "Users can view their own favorites " on favorite for
    select using (auth.uid() = user_id);

create policy "Users can update their own favorites" on favorite for
    update using (auth.uid() = user_id);

-- Couldn't make upsert work on composite primary key hence this RPC
CREATE OR REPLACE FUNCTION public.upsert_favorite(_user_id uuid, _entity favorite_entity, _ids uuid[])
 RETURNS void
 LANGUAGE sql
AS $function$ 
INSERT INTO public.favorite(user_id, entity, ids) 
VALUES(
	_user_id,
	_entity,
	_ids
)  on conflict on constraint favorite_pkey
DO 
   UPDATE SET ids = _ids;
 $function$
;