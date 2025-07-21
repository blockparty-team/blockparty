drop view if exists "public"."asset_geojson";

alter table "public"."icon" add column "color" text;

create or replace view "public"."asset_geojson" as  SELECT a.id,
    at.name,
    a.description,
    i.name AS icon,
    i.color,
    a.geom
   FROM ((asset a
     JOIN asset_type at ON ((a.asset_type_id = at.id)))
     JOIN icon i ON ((a.icon_id = i.id)));



