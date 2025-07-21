drop policy "anon_can_read_day_event" on "public"."day_event";

alter table "public"."day_event" add column "public" boolean default true;

create policy "anon_can_read_public_day_event"
on "public"."day_event"
as permissive
for select
to anon
using (public);
