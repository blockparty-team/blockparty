create or replace view "public"."map_icon" as  SELECT DISTINCT i.name,
    i.storage_path
   FROM (asset a
     JOIN icon i ON ((a.icon_id = i.id)))
UNION
 SELECT DISTINCT i.name,
    i.storage_path
   FROM (stage s
     JOIN icon i ON ((s.icon_id = i.id)));



