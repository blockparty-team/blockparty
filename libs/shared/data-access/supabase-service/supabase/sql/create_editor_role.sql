CREATE ROLE editor NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOLOGIN;
GRANT CONNECT ON DATABASE postgres TO editor;
GRANT USAGE ON SCHEMA public TO editor;
GRANT USAGE ON SCHEMA extensions TO editor;
GRANT SELECT ON TABLE extensions.spatial_ref_sys TO editor;
GRANT UPDATE, DELETE, INSERT, SELECT ON TABLE public.asset TO editor;
GRANT UPDATE, DELETE, INSERT, SELECT ON TABLE public.stage TO editor;
GRANT UPDATE, DELETE, INSERT, SELECT ON TABLE public.event TO editor;
GRANT SELECT ON TABLE artist TO editor;
GRANT SELECT ON TABLE asset_type TO editor;
GRANT SELECT ON TABLE day TO editor;
GRANT SELECT ON TABLE day_event TO editor;
GRANT SELECT ON TABLE event TO editor;
GRANT SELECT ON TABLE event_type TO editor;
GRANT SELECT ON TABLE favorite TO editor;
GRANT SELECT ON TABLE icon TO editor;
GRANT SELECT ON TABLE timetable TO editor;
GRANT SELECT ON TABLE extensions.geography_columns TO editor;
GRANT SELECT ON TABLE extensions.geometry_columns TO editor;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO editor;

CREATE POLICY "editor can read artist" ON artist FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read asset" ON asset FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read asset_type" ON asset_type FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read day" ON day FOR SELECT TO editor USING (true);
CREATE POLICY "editor can read day_event" ON day_event FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read event" ON event FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read event_type" ON event_type FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read favorite" ON favorite FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read icon" ON icon FOR SELECT TO editor USING (true);
CREATE POLICY "editor can read timetable" ON timetable FOR SELECT TO editor USING (
    true
);
CREATE POLICY "editor can read stage" ON stage FOR SELECT TO editor USING (
    true
);

CREATE POLICY "editor can update stage" ON stage FOR UPDATE USING (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can delete stage" ON stage FOR DELETE USING (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can insert stage" ON stage FOR INSERT WITH CHECK (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);


CREATE POLICY "editor can update asset" ON asset FOR UPDATE USING (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can delete asset" ON asset FOR DELETE USING (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can insert asset" ON asset FOR INSERT WITH CHECK (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can update event" ON event FOR UPDATE USING (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can delete event" ON event FOR DELETE USING (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);

CREATE POLICY "editor can insert event" ON event FOR INSERT WITH CHECK (
    (SELECT EXISTS(
        SELECT 1 FROM pg_auth_members
        INNER JOIN pg_roles ON (pg_auth_members.roleid = pg_roles.oid)
        INNER JOIN pg_user ON (pg_auth_members.member = pg_user.usesysid)
        WHERE
            pg_roles.rolname = 'editor'
            AND pg_user.usename = current_user
    ))
);
