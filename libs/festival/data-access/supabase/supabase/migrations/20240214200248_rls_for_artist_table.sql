create policy "Enable delete for authenticated" on "public"."artist" as permissive for delete to authenticated using (true);

create policy "Enable insert for authenticated users only" on "public"."artist" as permissive for
insert
  to authenticated with check (true);

create policy "Enable update for authenticated users" on "public"."artist" as permissive for
update
  to public using (true) with check (true);
