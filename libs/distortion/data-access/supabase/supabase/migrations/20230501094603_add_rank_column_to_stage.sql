alter table "public"."stage" add column "rank" smallint not null default 50;

create or replace view "public"."day_event_stage_timetable" as  WITH timetables AS (
         SELECT d.id AS day_id,
            s_1.event_id,
            s_1.id AS stage_id,
            min(date_trunc('minute'::text, t.start_time)) AS first_start_time,
            max(date_trunc('minute'::text, t.end_time)) AS last_end_time,
            jsonb_agg(json_build_object('artist_id', a.id, 'artist_name', a.name, 'start_time', date_trunc('minute'::text, t.start_time), 'end_time', date_trunc('minute'::text, t.end_time))) AS timetable
           FROM (((( SELECT timetable.id,
                    timetable.day_id,
                    timetable.start_time,
                    timetable.end_time,
                    timetable.artist_id,
                    timetable.stage_id,
                    timetable.inserted_at,
                    timetable.public
                   FROM timetable
                  ORDER BY timetable.start_time) t
             JOIN day d ON ((t.day_id = d.id)))
             JOIN artist a ON ((t.artist_id = a.id)))
             JOIN stage s_1 ON ((t.stage_id = s_1.id)))
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
           FROM ((((event e
             JOIN timetables t ON ((e.id = t.event_id)))
             JOIN day d ON ((d.id = t.day_id)))
             JOIN stage s_1 ON ((s_1.id = t.stage_id)))
             JOIN event_type et ON ((e.event_type_id = et.id)))
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



