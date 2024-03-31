drop policy "Users can insert favorites" on "public"."favorite";

drop policy "Users can update their own favorites" on "public"."favorite";

drop policy "Users can view their own favorites " on "public"."favorite";

alter table "public"."favorite" drop constraint "favorite_user_id_fkey";

drop function if exists "public"."upsert_favorite"(_user_id uuid, _entity favorite_entity, _ids uuid[]);

alter table "public"."favorite" drop constraint "favorite_pkey";

drop index if exists "public"."favorite_pkey";

alter table "public"."event_type" enable row level security;

alter table "public"."favorite" drop column "user_id";

alter table "public"."favorite" add column "device_id" uuid not null;

CREATE UNIQUE INDEX favorite_pkey ON public.favorite USING btree (device_id, entity);

alter table "public"."favorite" add constraint "favorite_pkey" PRIMARY KEY using index "favorite_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.upsert_favorite(_device_id uuid, _entity favorite_entity, _ids uuid[])
 RETURNS void
 LANGUAGE sql
AS $function$ 
INSERT INTO public.favorite(device_id, entity, ids) 
VALUES(
	_device_id,
	_entity,
	_ids
)  on conflict on constraint favorite_pkey
DO 
   UPDATE SET ids = _ids;
 $function$
;

create policy "Anon can read event types"
on "public"."event_type"
as permissive
for select
to anon
using (true);


create policy "Anon can insert favorites"
on "public"."favorite"
as permissive
for insert
to anon
with check (true);


create policy "Anon can update favorites"
on "public"."favorite"
as permissive
for update
to anon
using (true)
with check (true);
