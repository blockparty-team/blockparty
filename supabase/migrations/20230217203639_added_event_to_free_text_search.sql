CREATE TYPE text_search_entity AS ENUM ('artist', 'stage', 'asset', 'event');

drop view if exists "public"."entity_text_search";

drop function if exists "public"."text_search"(search_term text);

create or replace view "public"."entity_text_search" as  SELECT 'artist'::text_search_entity AS entity,
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
    (setweight(to_tsvector('english'::regconfig, COALESCE(at.name, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(a.description, ''::text)), 'B'::"char")) AS ts
   FROM (asset a
     JOIN asset_type at ON ((a.asset_type_id = at.id)))
UNION ALL
 SELECT 'event'::text_search_entity AS entity,
    e.id,
    e.name,
    (setweight(to_tsvector('english'::regconfig, COALESCE(e.name, ''::text)), 'A'::"char") || setweight(to_tsvector('english'::regconfig, COALESCE(e.description, ''::text)), 'B'::"char")) AS ts
   FROM event e;


CREATE OR REPLACE FUNCTION public.text_search(search_term text)
 RETURNS TABLE(rank double precision, similarity double precision, entity text_search_entity, id uuid)
 LANGUAGE sql
AS $function$ 
 	with ts_search_term as (
 		select array_to_string(array_agg(term || ':*'), ' & ')
		from unnest(string_to_array(search_term, ' ')) as term
		where nullif(term, '') is not null
 	)
	select 
		ts_rank(ts, to_tsquery((select * from ts_search_term))) rank, 
		similarity(name, search_term) similarity,
		entity,
		id
	from entity_text_search
	order by 1 desc, 2 desc;
 $function$
;
