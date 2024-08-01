create policy "Anon can read favorites"
on "public"."favorite"
as permissive
for select
to anon
using (true);
