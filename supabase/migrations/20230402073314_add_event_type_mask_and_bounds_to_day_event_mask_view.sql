drop view if exists "public"."day_event_mask";

create or replace view "public"."day_event_mask" as  WITH day_event_collect AS (
         SELECT '52c29de2-fdd7-4b2b-bad9-9c8e68cdf7a4'::text AS id,
            st_collect(e.geom) AS geom,
            ARRAY[st_xmin((st_collect(e.geom))::box3d), st_ymin((st_collect(e.geom))::box3d), st_xmax((st_collect(e.geom))::box3d), st_ymax((st_collect(e.geom))::box3d)] AS bounds
           FROM mask m,
            (event e
             JOIN day_event de ON ((e.id = de.event_id)))
        UNION ALL
         SELECT (day_event.day_id)::text AS day_id,
            st_collect(event.geom) AS geom,
            ARRAY[st_xmin((st_collect(event.geom))::box3d), st_ymin((st_collect(event.geom))::box3d), st_xmax((st_collect(event.geom))::box3d), st_ymax((st_collect(event.geom))::box3d)] AS bounds
           FROM (event
             JOIN day_event ON ((event.id = day_event.event_id)))
          GROUP BY day_event.day_id
        UNION ALL
         SELECT concat(day_event.day_id, '_', event.event_type_id) AS id,
            st_collect(event.geom) AS geom,
            ARRAY[st_xmin((st_collect(event.geom))::box3d), st_ymin((st_collect(event.geom))::box3d), st_xmax((st_collect(event.geom))::box3d), st_ymax((st_collect(event.geom))::box3d)] AS bounds
           FROM (event
             JOIN day_event ON ((event.id = day_event.event_id)))
          GROUP BY day_event.day_id, event.event_type_id
        )
 SELECT day_event_collect.id,
    st_difference(mask.geom, day_event_collect.geom) AS geom,
    day_event_collect.bounds
   FROM (day_event_collect
     JOIN mask ON (st_intersects(day_event_collect.geom, mask.geom)));



