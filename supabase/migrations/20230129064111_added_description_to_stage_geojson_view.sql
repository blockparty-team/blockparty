drop view if exists "public"."stage_geojson";

create or replace view "public"."stage_geojson" as  
WITH cte_day AS (
         SELECT day.id,
            json_build_object('id', day.id, 'date', day.day, 'name', day.name) AS day
           FROM day
        ), cte_timetable AS (
         SELECT t_1.stage_id,
            d.id AS day_id,
            jsonb_agg(json_build_object('start_time', t_1.start_time, 'end_time', t_1.end_time, 'name', a.name, 'artist_id', t_1.artist_id) ORDER BY t_1.start_time) AS timetable
           FROM ((timetable t_1
             JOIN artist a ON ((t_1.artist_id = a.id)))
             JOIN day d ON ((t_1.day_id = d.id)))
          GROUP BY t_1.stage_id, d.id, d.day
          ORDER BY d.day
        ), tt AS (
         SELECT t_1.stage_id,
            d.day,
            t_1.timetable
           FROM (cte_timetable t_1
             JOIN cte_day d ON ((t_1.day_id = d.id)))
        )
 SELECT s.id,
    s.name,
    s.description,
    i.name AS icon,
    jsonb_agg(((row_to_json(t.*))::jsonb - 'stage_id'::text)) AS timetables,
    s.geom
   FROM ((stage s
     LEFT JOIN tt t ON ((s.id = t.stage_id)))
     LEFT JOIN icon i ON ((s.icon_id = i.id)))
  GROUP BY s.id, s.name, i.name;
