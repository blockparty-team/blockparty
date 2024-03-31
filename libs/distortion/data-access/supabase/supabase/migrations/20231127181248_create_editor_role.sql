CREATE ROLE editor NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOLOGIN;
GRANT CONNECT ON DATABASE postgres TO editor;
GRANT USAGE ON SCHEMA public TO editor;
GRANT USAGE ON SCHEMA extensions TO editor;
GRANT SELECT ON TABLE extensions.spatial_ref_sys TO editor;
GRANT UPDATE, DELETE, INSERT, SELECT ON TABLE public.asset TO editor;
GRANT UPDATE, DELETE, INSERT, SELECT ON TABLE public.stage TO editor;
GRANT UPDATE, DELETE, INSERT, SELECT ON TABLE public.event TO editor;
grant select on table artist to editor;
grant select on table asset_type to editor;
grant select on table day to editor;
grant select on table day_event to editor;
grant select on table event to editor;
grant select on table event_type to editor;
grant select on table favorite to editor;
grant select on table icon to editor;
grant select on table timetable to editor;
grant select on table extensions.geography_columns to editor;
grant select on table extensions.geometry_columns to editor;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO editor;

create policy "editor can read artist" ON artist FOR SELECT TO editor USING (true);
create policy "editor can read asset" ON asset FOR SELECT TO editor USING (true);
create policy "editor can read asset_type" ON asset_type FOR SELECT TO editor USING (true);
create policy "editor can read day" ON day FOR SELECT TO editor USING (true);
create policy "editor can read day_event" ON day_event FOR SELECT TO editor USING (true);
create policy "editor can read event" ON event FOR SELECT TO editor USING (true);
create policy "editor can read event_type" ON event_type FOR SELECT TO editor USING (true);
create policy "editor can read favorite" ON favorite FOR SELECT TO editor USING (true);
create policy "editor can read icon" ON icon FOR SELECT TO editor USING (true);
create policy "editor can read timetable" ON timetable FOR SELECT TO editor USING (true);
create policy "editor can read stage" ON stage FOR SELECT TO editor USING (true);

create policy "editor can update stage" on stage for update using ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can delete stage" on stage for delete using ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can insert stage" on stage for insert with check ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));


create policy "editor can update asset" on asset for update using ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can delete asset" on asset for delete using ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can insert asset" on asset for insert with check ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can update event" on event for update using ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can delete event" on event for delete using ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));

create policy "editor can insert event" on event for insert with check ((SELECT EXISTS (
  SELECT 1 FROM pg_auth_members
  JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
  JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
  WHERE pg_roles.rolname = 'editor'
    AND pg_user.usename = current_user
)));