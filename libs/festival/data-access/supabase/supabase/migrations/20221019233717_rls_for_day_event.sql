alter table "public"."day_event" enable row level security;

create policy "anon_can_read_day_event"
on "public"."day_event"
as permissive
for select
to anon
using (true);


create policy "authenticated_can_read_day_event"
on "public"."day_event"
as permissive
for select
to authenticated
using (true);



