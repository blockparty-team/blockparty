drop policy "Authenticated user can read artist" on "public"."artist";

create policy "Authenticated user can read artist"
on "public"."artist"
as permissive
for select
to authenticated
using (true);



