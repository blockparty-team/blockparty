create or replace view "public"."day_event_stage_timetable" as  WITH timetables AS (
         SELECT d_1.id AS day_id,
            s_1.event_id,
            s_1.id AS stage_id,
            min(date_trunc('minute'::text, t.start_time)) AS first_start_time,
            max(date_trunc('minute'::text, t.end_time)) AS last_end_time,
            jsonb_agg(json_build_object('artist_id', a.id, 'artist_name', a.name, 'start_time', date_trunc('minute'::text, t.start_time), 'end_time', date_trunc('minute'::text, t.end_time)) ORDER BY t.start_time) AS timetable
           FROM (((( SELECT timetable.id,
                    timetable.day_id,
                    timetable.start_time,
                    timetable.end_time,
                    timetable.artist_id,
                    timetable.stage_id,
                    timetable.inserted_at,
                    timetable.public
                   FROM timetable) t
             JOIN day d_1 ON ((t.day_id = d_1.id)))
             JOIN artist a ON ((t.artist_id = a.id)))
             JOIN stage s_1 ON ((t.stage_id = s_1.id)))
          GROUP BY d_1.id, s_1.event_id, s_1.id
        ), stages AS (
         SELECT d_1.id AS day_id,
            e.id AS event_id,
            e.name AS event_name,
            min(t.first_start_time) AS first_start_time,
            max(t.last_end_time) AS last_end_time,
            jsonb_agg(json_build_object('stage_name', s_1.name, 'timetable', t.timetable, 'first_start_time', t.first_start_time, 'last_end_time', t.last_end_time)) AS stages
           FROM (((event e
             JOIN timetables t ON ((e.id = t.event_id)))
             JOIN day d_1 ON ((d_1.id = t.day_id)))
             JOIN stage s_1 ON ((s_1.id = t.stage_id)))
          GROUP BY d_1.id, e.id, e.name
          ORDER BY e.name
        )
 SELECT d.id,
    d.name,
    min(s.first_start_time) AS first_start_time,
    max(s.last_end_time) AS last_end_time,
    jsonb_agg(json_build_object('event_id', s.event_id, 'event_name', s.event_name, 'stages', s.stages, 'first_start_time', s.first_start_time, 'last_end_time', s.last_end_time)) AS events
   FROM (stages s
     JOIN day d ON ((d.id = s.day_id)))
  GROUP BY d.id, d.name
  ORDER BY d.day;