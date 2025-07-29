create or replace view "public"."event_geojson" as
SELECT
  e.id,
  et.color,
  e.geom
FROM event e
  JOIN event_type et ON e.event_type_id = et.id;