CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create mask 
create materialized view public.mask as
select row_number() over() id, ST_MakeEnvelope(9, 54, 15, 57, 4326) geom;

create index on public.mask using gist(geom);
GRANT SELECT ON TABLE public.mask TO anon;

-------------------------
-------------------------
-- 		DAS MODEL      --
-------------------------
-------------------------

-- Enums
create table if not exists public.asset_enum (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	description text,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.asset_enum TO anon;

-- Entities
-------------
-- ICON
-------------
create table if not exists public.icon (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text not null,
	storage_path text,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.icon TO anon;

-------------
-- DAY
-------------
create table if not exists public.day(
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	day date not null,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.day TO anon;

-------------
-- EVENT
-------------
create table if not exists public.event(
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text,
	description text,
	geom geometry(polygon, 4326),
	style jsonb,
	day_id uuid references public.day not null,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

create index on public.event using gist(geom);
GRANT SELECT ON TABLE public.event TO anon;

-------------
-- STAGE
-------------
create table if not exists public.stage (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text,
	description text,
	icon_id uuid references public.icon,
	geom geometry(point, 4326),
	event_id uuid references public.event not null,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

create index if not exists on public.stage using gist(geom);
GRANT SELECT ON TABLE public.stage TO anon;

-------------
-- ARTIST
-------------
create table if not exists public.artist (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	name text,
	description text,
	storage_path text,
	stage_id uuid references public.stage,
	links jsonb,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.artist TO anon;

-------------
-- SCHEDULE
-------------
create table if not exists public.schedule (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	timerange tstzrange,
	artist_id uuid references public.artist not null,
	stage_id uuid references public.stage not null,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

GRANT SELECT ON TABLE public.schedule TO anon;


-------------
-- ASSET
-------------
create table if not exists public.asset (
	id uuid not null primary key DEFAULT uuid_generate_v4(),
	description text,
	geom geometry(point, 4326),
	asset_id uuid references public.asset_enum not null,
	icon_id uuid references public.icon,
	event_id uuid references public.event not null,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	public boolean default false
);

create index on public.asset using gist(geom);
GRANT SELECT ON TABLE public.asset TO anon;

-----------------------
-- Buckets
-----------------------
-- create bucket for artist photo and icons
INSERT INTO "storage".buckets (id,"name",public) VALUES
	('icon','icon',false),
	('artist','artist',false);
