create policy "Enable delete for authenticated" on "public"."day" as permissive for delete to authenticated using (true);

create policy "Enable insert for authenticated users only" on "public"."day" as permissive for
insert
  to authenticated with check (true);

create policy "Enable update for authenticated users" on "public"."day" as permissive for
update
  to public using (true) with check (true);

create policy "Enable delete for authenticated" on "public"."event" as permissive for delete to authenticated using (true);

create policy "Enable insert for authenticated users only" on "public"."event" as permissive for
insert
  to authenticated with check (true);

create policy "Enable update for authenticated users" on "public"."event" as permissive for
update
  to public using (true) with check (true);

create policy "Enable delete for authenticated" on "public"."day_event" as permissive for delete to authenticated using (true);

create policy "Enable insert for authenticated users only" on "public"."day_event" as permissive for
insert
  to authenticated with check (true);

create policy "Enable update for authenticated users" on "public"."day_event" as permissive for
update
  to public using (true) with check (true);