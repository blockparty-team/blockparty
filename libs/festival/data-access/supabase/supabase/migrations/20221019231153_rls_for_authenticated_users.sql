create table "public"."profile" (
    "id" uuid not null,
    "username" text,
    "info" jsonb,
    "inserted_at" time with time zone not null default now()
);


alter table "public"."profile" enable row level security;

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX profile_username_key ON public.profile USING btree (username);

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."profile" add constraint "profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profile" validate constraint "profile_id_fkey";

alter table "public"."profile" add constraint "profile_username_key" UNIQUE using index "profile_username_key";

alter table "public"."profile" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profile" validate constraint "username_length";

create policy "Authenticated user can read artist"
on "public"."artist"
as permissive
for select
to authenticated
using (public);


create policy "Authenticated user can read asset"
on "public"."asset"
as permissive
for select
to authenticated
using (public);


create policy "Authenticated user can read asset_type"
on "public"."asset_type"
as permissive
for select
to authenticated
using (public);


create policy "Authenticated user can read day"
on "public"."day"
as permissive
for select
to authenticated
using (public);


create policy "Authenticated user can read event"
on "public"."event"
as permissive
for select
to authenticated
using (public);


create policy "Authenticated user can read icon"
on "public"."icon"
as permissive
for select
to authenticated
using (public);


create policy "Users can insert their own profile."
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Authenticated user can read stage"
on "public"."stage"
as permissive
for select
to authenticated
using (public);


create policy "Authenticated user can read timetable"
on "public"."timetable"
as permissive
for select
to authenticated
using (public);



