
alter table "public"."artist" add column "embedding" vector(1536);

alter table "public"."artist" add column "embedding_input" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.similar_artists(artist_id uuid)
 RETURNS TABLE(id uuid, name text, similarity double precision)
 LANGUAGE sql
AS $function$ 
	with curr as (
		select id, embedding
		from artist 
		where id = artist_id
	)
	select 
		artist.id,
		artist.name,
	    1 - (artist.embedding <=> curr.embedding) as similarity
	from artist, curr
	where 
		artist.embedding is not null 
		and curr.id != artist.id
		and 1 - (artist.embedding <=> curr.embedding) > 0.8
	order by artist.embedding <=> curr.embedding
	limit 5
 $function$
;


