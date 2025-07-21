-- Set your locale timezone
--ALTER DATABASE postgres SET timezone TO 'Europe/Copenhagen';
--SELECT pg_reload_conf();

-- Extensions
CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
create EXTENSION IF NOT EXISTS PG_TRGM SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA extensions;

-- Create mask
create materialized view public.mask as
select row_number() over() id, ST_MakeEnvelope(-180, -90, 180, 90, 4326) geom;

create index on public.mask using gist(geom);
GRANT SELECT ON TABLE public.mask TO anon;

-------------------------
-------------------------
-- 		DAS MODEL      --
-------------------------
-------------------------

-------------
-- ICON
-------------
create table if not exists public.icon (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	storage_path text,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.icon TO anon;

-- Row level security
ALTER TABLE icon ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_public_icons 
	ON icon 
	FOR SELECT
	TO anon 
	USING (public);

-------------
-- DAY
-------------
create table if not exists public.day(
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	day date not null,
	name text,
	description text,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.day TO anon;

-- Row level security
ALTER TABLE day ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_public_days
	ON day 
	FOR SELECT
	TO anon 
	USING (public);


-------------
-- EVENT
-------------
create table if not exists public.event(
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	description text,
	geom geometry(polygon, 4326),
	style jsonb,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

create index on public.event using gist(geom);

GRANT SELECT ON TABLE public.event TO anon;

-- Row level security
ALTER TABLE event ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_public_events 
	ON event 
	FOR SELECT
	TO anon 
	USING (public);

-- Generated column for bounds
ALTER TABLE public.event ADD COLUMN bounds float8[]
    GENERATED ALWAYS AS
    (array[
		st_xmin(geom),
		st_ymin(geom),
		st_xmax(geom),
		st_ymax(geom)
	]) STORED;


-------------------------------------
-- DAY EVENT (many-to-many relation)
-------------------------------------
create table if not exists public.day_event(
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	day_id uuid references public.day not null,
	event_id uuid references public.event not null,
	inserted_at timestamp with time zone default now() not null
);

-- Permissions
GRANT SELECT ON TABLE public.day_event TO anon;

ALTER TABLE event ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_day_event 
	ON event 
	FOR SELECT
	TO anon;
 

-------------
-- STAGE
-------------
create table if not exists public.stage (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	description text,
	icon_id uuid references public.icon,
	geom geometry(point, 4326),
	event_id uuid references public.event not null,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

-- Full text search as generated column
ALTER TABLE public.stage ADD COLUMN ts tsvector
    GENERATED ALWAYS AS
     (setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
     setweight(to_tsvector('english', coalesce(description, '')), 'B')) STORED;

CREATE INDEX ON public.stage USING GIN(ts);

create index on public.stage using gist(geom);

GRANT SELECT ON TABLE public.stage TO anon;

-- Row level security
ALTER TABLE stage ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_public_stages
	ON stage 
	FOR SELECT
	TO anon 
	USING (public);


-------------
-- ARTIST
-------------
create table if not exists public.artist (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	description text,
	storage_path text,
	bandcamp text,
	spotify text,
	tidal text,
	apple_music text,
	soundcloud text,
	youtube text,
	instagram text,
	facebook text,
	webpage text,
	bandcamp_iframe text,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.artist TO anon;

-- Row level security
ALTER TABLE artist ENABLE ROW LEVEL SECURITY;

--drop policy anon_can_read_public_artists on artist;
create policy anon_can_read_public_artists 
	ON artist 
	FOR SELECT
	TO anon 
	USING (public);

-- Full text search as generated column
ALTER TABLE public.artist  ADD COLUMN ts tsvector
    GENERATED ALWAYS AS
     (setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
     setweight(to_tsvector('english', coalesce(description, '')), 'B')) STORED;

CREATE INDEX ON public.artist USING GIN (ts);


-------------
-- TIMETABLE
-------------
create table if not exists public.timetable (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	day_id uuid references public.day not null,
	start_time timestamp with time zone not null,
	end_time timestamp with time zone not null,
	artist_id uuid references public.artist not null,
	stage_id uuid references public.stage not null,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.timetable TO anon;

-- Row level security
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

--drop policy anon_can_read_public_timetable on timetable;
create policy anon_can_read_public_timetable 
	ON timetable 
	FOR select
	TO anon 
	USING (public);


---------------
-- ASSET TYPE
---------------
create table if not exists public.asset_type (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	description text,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.asset_type TO anon;

-- Row level security
ALTER TABLE asset_type ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_public_asset_types
	ON asset_type 
	FOR SELECT
	TO anon 
	USING (public);


-------------
-- ASSET
-------------
create table if not exists public.asset (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	description text,
	geom geometry(point, 4326),
	asset_type_id uuid references public.asset_type not null,
	icon_id uuid references public.icon,
	event_id uuid references public.event not null,
	inserted_at timestamp with time zone default now() not null,
	public boolean default false
);

--Indicies
CREATE INDEX ON public.artist USING GIN (ts);
create index on public.asset using gist(geom);

--Permission
GRANT SELECT ON TABLE public.asset TO anon;

-- Row level security
ALTER TABLE asset ENABLE ROW LEVEL SECURITY;

create policy anon_can_read_public_assets
	ON asset 
	FOR SELECT
	TO anon 
	USING (public);


-- Grant select fro Authenticated user
grant select on table artist to authenticated;
grant select on table asset to authenticated;
grant select on table asset_type to authenticated;
grant select on table day to authenticated;
grant select on table day_event to authenticated;
grant select on table event to authenticated;
grant select on table icon to authenticated;
grant select on table stage to authenticated;
grant select on table timetable to authenticated;


-------------------
--  VIEWS
-------------------

-- Day/Event mask
create or replace view public.day_event_mask as
select
	'52c29de2-fdd7-4b2b-bad9-9c8e68cdf7a4' id,
	st_difference(st_collect(m.geom), st_collect(e.geom)) geom,
	array[
		st_xmin(st_collect(e.geom)),
		st_ymin(st_collect(e.geom)),
		st_xmax(st_collect(e.geom)),
		st_ymax(st_collect(e.geom))
	] as bounds
from mask m, "event" e
join day_event de on e.id = de.event_id
union all
select
	d.id id,
	st_difference(st_collect(m.geom), st_collect(e.geom)) geom,
	array[
		st_xmin(st_collect(e.geom)),
		st_ymin(st_collect(e.geom)),
		st_xmax(st_collect(e.geom)),
		st_ymax(st_collect(e.geom))
	] as bounds
from
	mask m
join "event" e on
	st_intersects(m.geom,
	e.geom)
join day_event de on e.id = de.event_id
join "day" d on de.day_id = d.id
group by
	d.id;

GRANT SELECT ON TABLE public.day_event_mask TO anon;


-- Asset with type for geojson
create or replace view asset_geojson as
select
	a.id, 
	at.name,
	a.description,
	i."name" icon, 
	a.geom
from asset a
join asset_type at on a.asset_type_id = at.id
join icon i on a.icon_id = i.id;

GRANT SELECT ON table asset_geojson TO anon;


-- Stage with timetable geojson
create or replace view stage_geojson as
with cte_day as (
	select 
		id,
		json_build_object(
			'id', id,
			'date', "day",
			'name', "name" 
		) "day"
	from "day"
), cte_timetable as (
	select 
		stage_id, 
		d.id day_id,
		jsonb_agg(
			json_build_object(
					'start_time', start_time, 
					'end_time', end_time, 
					'name', a."name", 
					'artist_id', artist_id
			) 
		) as timetable
	from timetable t
	join artist a on t.artist_id = a.id
	join day d on t.day_id = d.id 
	group by 1, 2, d."day"
	order by d."day" 
), tt as (
	select 
		t.stage_id,
		d."day",
		t.timetable
	from cte_timetable t
	join cte_day d on t.day_id = d.id
)
select 
	s.id,
	s."name",
	i."name" icon,
	jsonb_agg(row_to_json(t.*)::jsonb - 'stage_id') timetables,
	s.geom
from stage s 
left join tt t on s.id = t.stage_id
left join icon i on s.icon_id = i.id
group by 1, 2, 3;

GRANT SELECT ON table stage_geojson TO anon;

-- Timetable
create or replace view day_event_stage_timetable as
with timetables as (
	select
		d.id day_id,
		s.event_id,
		s.id stage_id,
		min(date_trunc('minute', t.start_time)) first_start_time,
		max(date_trunc('minute', t.end_time)) last_end_time,
		jsonb_agg(
			json_build_object(
				'artist_id', a.id,
				'artist_name', a."name",
				'start_time', date_trunc('minute', t.start_time),
				'end_time', date_trunc('minute', t.end_time)
			) 
		) timetable 
	from
		(select * from timetable order by start_time) t
	join day d on
		t.day_id = d.id	
	join artist a on
		t.artist_id = a.id
	join stage s on
		t.stage_id = s.id
	group by 1, 2, 3
), stages as (
	select
		d.id day_id,
		e.id event_id,
		e."name" event_name,
		min(t.first_start_time) first_start_time,
		max(last_end_time) last_end_time,
		jsonb_agg(
			json_build_object(
				'stage_name', s.name,
				'timetable', t.timetable,
				'first_start_time', t.first_start_time,
				'last_end_time', t.last_end_time
			) 
		) stages
	from event e 
	join timetables t on e.id = t.event_id
	join day d on d.id = t.day_id 
	join stage s on s.id = t.stage_id
	group by 1, 2, 3	
	order by e.name
)
select 
	d.id,
	d."name",
	min(s.first_start_time) first_start_time,
	max(s.last_end_time) last_end_time,
	jsonb_agg(
		json_build_object(
			'event_id', s.event_id,
			'event_name', s.event_name,
			'stages', s.stages,
			'first_start_time', s.first_start_time,
			'last_end_time', s.last_end_time
		) 
	) events
from stages s
join day d on d.id = s.day_id
group by 1, 2
order by d.day;

GRANT SELECT ON table day_event_stage_timetable TO anon;


-- Search
create or replace view entity_text_search as
select
	'artist' entity,
	id,
	name,
	description,
	ts
from
	artist
union all
select
	'stage' entity,
	id,
	name,
	description,
	ts
from
	stage
union all
select
	'asset' entity,
	a.id,
	at.name,
	a.description,
	(setweight(to_tsvector('english', coalesce(at.name, '')), 'A') ||
     setweight(to_tsvector('english', coalesce(a.description, '')), 'B')) ts
from
	asset a
join asset_type at on
	a.asset_type_id = at.id;

GRANT SELECT ON table entity_text_search TO anon;


-- location distance (near me)
create or replace view entity_distance_search as
select
	'artist' entity,
	a.id,
	a.name,
	s.geom
from
	artist a
	join timetable t on a.id = t.artist_id 
	join stage s on s.id = t.stage_id 
union all
select
	'stage' entity,
	id,
	"name", 
	geom
from
	stage
union all
select
	'asset' entity,
	a.id,
	at.name,
	a.geom
from
	asset a
join asset_type at on at.id = a.asset_type_id;

-----------------------
-- Buckets
-----------------------
-- create bucket for artist photo and icons
INSERT INTO "storage".buckets (id,"name",public) VALUES
	('icon','icon',true),
	('artist','artist',true),
	('event','event',true);


-----------------------
-- RPC
-----------------------

-- table as geojson
CREATE OR REPLACE FUNCTION table_as_geojson(_tbl regclass, OUT geojson json)
    LANGUAGE plpgsql AS
$func$
BEGIN
   EXECUTE format('
	SELECT 
		  json_build_object(
		    ''type'', ''FeatureCollection'',
		    ''features'', json_agg(ST_AsGeoJSON(s.*)::json)
		  )
	FROM %s as s', _tbl)
   INTO geojson;
END
$func$;


-- Distance to entities
--DROP FUNCTION distance_to(double precision,double precision,integer);

CREATE OR REPLACE FUNCTION distance_to(lng float, lat float, search_radius int)
 RETURNS table (entity text, id uuid, name text, geom geometry, distance int) as $$ 
 	SELECT 
 		*, 
 		round(st_distance(st_transform(st_setsrid(st_point(lng, lat), 4326), 3857), st_transform(geom, 3857))) distance
	FROM 
		entity_distance_search e
	where 
		st_dwithin(st_transform(st_setsrid(st_point(lng, lat), 4326), 3857),st_transform(geom, 3857), search_radius)
	order by 
		st_distance(st_setsrid(st_point(lng, lat), 4326), geom);
 $$ language sql;

-- Full text search
CREATE OR REPLACE FUNCTION text_search(search_term text)
 RETURNS table (rank float, similarity float, entity text, id uuid, name text, description text) as $$ 
 	with ts_search_term as (
 		select array_to_string(array_agg(term || ':*'), ' & ')
		from unnest(string_to_array(search_term, ' ')) as term
		where nullif(term, '') is not null -- Remove multible whitespaces
 	)
	select 
		ts_rank(ts, to_tsquery((select * from ts_search_term))) rank, 
		similarity(name, search_term),
		entity,
		id,
		name, 
		description
	from entity_text_search
	order by 1 desc, 2 desc;
 $$ language sql;


-----------------------
-- Auditlog
-----------------------
-- Source https://supabase.com/blog/2022/03/08/audit 

create schema if not exists audit;

-- Audit table
create table audit.record_version(
  id             bigserial primary key,
  record_id      uuid, 
  old_record_id  uuid,
  op             varchar(8) not null,
  ts             timestamptz not null default now(),
  table_oid      oid not null,  
  table_schema   name not null,
  table_name     name not null,
  record         jsonb,
  old_record     jsonb
);

-- index ts for time range filtering
create index record_version_ts
  on audit.record_version
  using brin(ts);
 
-- index table_oid for table filtering
create index record_version_table_oid
  on audit.record_version
  using btree(table_oid);
 
 
 -- function to lookup a record's primary key column names
 create or replace function audit.primary_key_columns(entity_oid oid)
    returns text[]
    stable
    security definer
    language sql
as $$
    select
        coalesce(
            array_agg(pa.attname::text order by pa.attnum),
            array[]::text[]
        ) column_names
    from
        pg_index pi
        join pg_attribute pa
            on pi.indrelid = pa.attrelid
            and pa.attnum = any(pi.indkey)
    where
        indrelid = $1
        and indisprimary
$$;

-- consume the table_oid and primary key, converting the result into the record's UUID.
create or replace
function audit.to_record_id(
        entity_oid oid,
        pkey_cols text[],
        rec jsonb
)
    returns uuid
    stable
    language sql
as $$
    select
	case
		when rec is null then null
		-- if no primary key exists, use a random uuid
		when pkey_cols = array[]::text[] then uuid_generate_v4()
		else (
		select
			uuid_generate_v5(
				'fd62bc3d-8d6e-43c2-919c-802ba3762271',
				(
                    jsonb_build_array(to_jsonb($1))
                    || jsonb_agg($3 ->> key_)
                )::text
            )
		from
			unnest($2) x(key_)
            )
	end
$$;

-- index record_id for fast searching
create index record_version_record_id
    on audit.record_version(record_id)
    where record_id is not null;

-- index old_record_id for fast searching
create index record_version_old_record_id
    on audit.record_version(record_id)
  where old_record_id is not null;
 
 
 create or replace function audit.insert_update_delete_trigger()
    returns trigger
    security definer
    language plpgsql
as $$
declare
    pkey_cols text[] = audit.primary_key_columns(TG_RELID);
    record_jsonb jsonb = to_jsonb(new);
    record_id uuid = audit.to_record_id(TG_RELID, pkey_cols, record_jsonb);
    old_record_jsonb jsonb = to_jsonb(old);
    old_record_id uuid = audit.to_record_id(TG_RELID, pkey_cols, old_record_jsonb);
begin

    insert into audit.record_version(
        record_id,
        old_record_id,
        op,
        table_oid,
        table_schema,
        table_name,
        record,
        old_record
    )
    select
        record_id,
        old_record_id,
        TG_OP,
        TG_RELID,
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        record_jsonb,
        old_record_jsonb;

    return coalesce(new, old);
end;
$$;

-- api for enabling audit log on table
create or replace function audit.enable_tracking(regclass)
    returns void
    volatile
    security definer
    language plpgsql
as $$
declare
    statement_row text = format('
        create trigger audit_i_u_d
            before insert or update or delete
            on %I
            for each row
            execute procedure audit.insert_update_delete_trigger();',
        $1
    );

    pkey_cols text[] = audit.primary_key_columns($1);
begin
    if pkey_cols = array[]::text[] then
        raise exception 'Table % can not be audited because it has no primary key', $1;
    end if;

    if not exists(select 1 from pg_trigger where tgrelid = $1 and tgname = 'audit_i_u_d') then
        execute statement_row;
    end if;
end;
$$;

-- api for enabling audit log on table
create or replace function audit.disable_tracking(regclass)
    returns void
    volatile
    security definer
    language plpgsql
as $$
declare
    statement_row text = format(
        'drop trigger if exists audit_i_u_d on %I;',
        $1
    );
begin
    execute statement_row;
end;
$$;


-- Enable audit log for tables
select audit.enable_tracking('public.artist');
select audit.enable_tracking('public.asset');
select audit.enable_tracking('public.asset_type');
select audit.enable_tracking('public.day');
select audit.enable_tracking('public.event');
select audit.enable_tracking('public.day_event');
select audit.enable_tracking('public.icon');
select audit.enable_tracking('public.stage');
select audit.enable_tracking('public.timetable');

