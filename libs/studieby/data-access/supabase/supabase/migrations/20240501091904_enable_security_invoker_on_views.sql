-- public.asset_geojson source

CREATE OR REPLACE VIEW public.asset_geojson
WITH(security_invoker=on)
AS SELECT a.id,
    at.name,
    a.description,
    i.name AS icon,
    i.color,
    a.geom
   FROM asset a
     JOIN asset_type at ON a.asset_type_id = at.id
     JOIN icon i ON a.icon_id = i.id;


-- public.day_event_mask source

CREATE OR REPLACE VIEW public.day_event_mask
WITH(security_invoker=on)
AS WITH day_event_collect AS (
         SELECT '52c29de2-fdd7-4b2b-bad9-9c8e68cdf7a4'::text AS id,
            st_collect(e.geom) AS geom,
            ARRAY[st_xmin(st_collect(e.geom)::box3d), st_ymin(st_collect(e.geom)::box3d), st_xmax(st_collect(e.geom)::box3d), st_ymax(st_collect(e.geom)::box3d)] AS bounds
           FROM mask m,
            event e
             JOIN day_event de ON e.id = de.event_id
        UNION ALL
         SELECT day_event.day_id::text AS day_id,
            st_collect(event.geom) AS geom,
            ARRAY[st_xmin(st_collect(event.geom)::box3d), st_ymin(st_collect(event.geom)::box3d), st_xmax(st_collect(event.geom)::box3d), st_ymax(st_collect(event.geom)::box3d)] AS bounds
           FROM event
             JOIN day_event ON event.id = day_event.event_id
          GROUP BY day_event.day_id
        UNION ALL
         SELECT concat(day_event.day_id, '_', event.event_type_id) AS id,
            st_collect(event.geom) AS geom,
            ARRAY[st_xmin(st_collect(event.geom)::box3d), st_ymin(st_collect(event.geom)::box3d), st_xmax(st_collect(event.geom)::box3d), st_ymax(st_collect(event.geom)::box3d)] AS bounds
           FROM event
             JOIN day_event ON event.id = day_event.event_id
          GROUP BY day_event.day_id, event.event_type_id
        )
 SELECT day_event_collect.id,
    st_difference(mask.geom, day_event_collect.geom) AS geom,
    day_event_collect.bounds
   FROM day_event_collect
     JOIN mask ON st_intersects(day_event_collect.geom, mask.geom);


-- public.day_event_stage_timetable source

CREATE OR REPLACE VIEW public.day_event_stage_timetable
WITH(security_invoker=on)
AS WITH timetables AS (
         SELECT d.id AS day_id,
            s_1.event_id,
            s_1.id AS stage_id,
            min(date_trunc('minute'::text, t.start_time)) AS first_start_time,
            max(date_trunc('minute'::text, t.end_time)) AS last_end_time,
            jsonb_agg(json_build_object('artist_id', a.id, 'artist_name', a.name, 'start_time', date_trunc('minute'::text, t.start_time), 'end_time', date_trunc('minute'::text, t.end_time))) AS timetable
           FROM ( SELECT timetable.id,
                    timetable.day_id,
                    timetable.start_time,
                    timetable.end_time,
                    timetable.artist_id,
                    timetable.stage_id,
                    timetable.inserted_at,
                    timetable.public
                   FROM timetable
                  WHERE timetable.start_time IS NOT NULL AND timetable.end_time IS NOT NULL AND timetable.visible_on_timetable = true
                  ORDER BY timetable.start_time) t
             JOIN day d ON t.day_id = d.id
             JOIN artist a ON t.artist_id = a.id
             JOIN stage s_1 ON t.stage_id = s_1.id
          GROUP BY d.id, s_1.event_id, s_1.id
        ), stages AS (
         SELECT d.id AS day_id,
            d.name AS day_name,
            e.id AS event_id,
            e.name AS event_name,
            e.event_type_id,
            et.name AS event_type_name,
            min(t.first_start_time) AS first_start_time,
            max(t.last_end_time) AS last_end_time,
            jsonb_agg(json_build_object('stage_name', s_1.name, 'timetable', t.timetable, 'first_start_time', t.first_start_time, 'last_end_time', t.last_end_time) ORDER BY s_1.rank) AS stages
           FROM event e
             JOIN timetables t ON e.id = t.event_id
             JOIN day d ON d.id = t.day_id
             JOIN stage s_1 ON s_1.id = t.stage_id
             JOIN event_type et ON e.event_type_id = et.id
          GROUP BY d.id, d.name, e.id, e.name, e.event_type_id, et.name
          ORDER BY e.name
        )
 SELECT s.day_id AS id,
    s.day_name AS name,
    min(s.first_start_time) AS first_start_time,
    max(s.last_end_time) AS last_end_time,
    jsonb_agg(jsonb_build_object('event_type_id', s.event_type_id, 'event_type_name', s.event_type_name, 'event_id', s.event_id, 'event_name', s.event_name, 'first_start_time', s.first_start_time, 'last_end_time', s.last_end_time, 'stages', s.stages)) AS events
   FROM stages s
  GROUP BY s.day_id, s.day_name
  ORDER BY (min(s.first_start_time));


-- public.entity_distance_search source

CREATE OR REPLACE VIEW public.entity_distance_search
WITH(security_invoker=on)
AS SELECT 'artist'::text AS entity,
    a.id,
    a.name,
    s.geom
   FROM artist a
     JOIN timetable t ON a.id = t.artist_id
     JOIN stage s ON s.id = t.stage_id
UNION ALL
 SELECT 'stage'::text AS entity,
    stage.id,
    stage.name,
    stage.geom
   FROM stage
UNION ALL
 SELECT 'asset'::text AS entity,
    a.id,
    at.name,
    a.geom
   FROM asset a
     JOIN asset_type at ON at.id = a.asset_type_id;


-- public.entity_text_search source

CREATE OR REPLACE VIEW public.entity_text_search
WITH(security_invoker=on)
AS SELECT 'artist'::text_search_entity AS entity,
    artist.id,
    artist.name,
    artist.ts
   FROM artist
UNION ALL
 SELECT 'stage'::text_search_entity AS entity,
    stage.id,
    stage.name,
    stage.ts
   FROM stage
UNION ALL
 SELECT 'asset'::text_search_entity AS entity,
    a.id,
    at.name,
    setweight(to_tsvector('english'::regconfig, COALESCE(at.name, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(a.description, ''::text)), 'B'::"char") AS ts
   FROM asset a
     JOIN asset_type at ON a.asset_type_id = at.id
UNION ALL
 SELECT 'event'::text_search_entity AS entity,
    e.id,
    e.name,
    setweight(to_tsvector('english'::regconfig, COALESCE(e.name, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(e.description, ''::text)), 'B'::"char") AS ts
   FROM event e;


-- public.event_geojson source

CREATE OR REPLACE VIEW public.event_geojson
WITH(security_invoker=on)
AS SELECT e.id,
    et.color,
    e.geom
   FROM event e
     JOIN event_type et ON e.event_type_id = et.id;


-- public.map_icon source

CREATE OR REPLACE VIEW public.map_icon
WITH(security_invoker=on)
AS SELECT DISTINCT i.name,
    i.storage_path
   FROM asset a
     JOIN icon i ON a.icon_id = i.id
UNION
 SELECT DISTINCT i.name,
    i.storage_path
   FROM stage s
     JOIN icon i ON s.icon_id = i.id;


-- public.stage_geojson source

CREATE OR REPLACE VIEW public.stage_geojson
WITH(security_invoker=on)
AS WITH cte_day AS (
         SELECT day.id,
            json_build_object('id', day.id, 'date', day.day, 'name', day.name) AS day
           FROM day
        ), cte_timetable AS (
         SELECT t_1.stage_id,
            d.id AS day_id,
            jsonb_agg(json_build_object('start_time', t_1.start_time, 'end_time', t_1.end_time, 'name', a.name, 'artist_id', t_1.artist_id) ORDER BY t_1.start_time) AS timetable
           FROM timetable t_1
             JOIN artist a ON t_1.artist_id = a.id
             JOIN day d ON t_1.day_id = d.id
          WHERE t_1.visible_on_stage = true
          GROUP BY t_1.stage_id, d.id, d.day
          ORDER BY d.day
        ), tt AS (
         SELECT t_1.stage_id,
            d.day,
            t_1.timetable
           FROM cte_timetable t_1
             JOIN cte_day d ON t_1.day_id = d.id
        )
 SELECT s.id,
    s.name,
    s.description,
    i.name AS icon,
    e.tickets,
    s.url,
    s.tags,
    jsonb_agg(row_to_json(t.*)::jsonb - 'stage_id'::text) AS timetables,
    s.geom
   FROM stage s
     LEFT JOIN tt t ON s.id = t.stage_id
     LEFT JOIN icon i ON s.icon_id = i.id
     LEFT JOIN event e ON e.id = s.event_id
  GROUP BY s.id, s.name, i.name, e.tickets;
