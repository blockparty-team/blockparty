create schema distortion_2023;

-- Create tables
create table distortion_2023.artist (like public.artist including all);
create table distortion_2023.asset (like public.asset including all);
create table distortion_2023.asset_type (like public.asset_type including all);
create table distortion_2023.day (like public.day including all);
create table distortion_2023.day_event (like public.day_event including all);
create table distortion_2023.event (like public.event including all);
create table distortion_2023.event_type (like public.event_type including all);
create table distortion_2023.favorite (like public.favorite including all);
create table distortion_2023.icon (like public.icon including all);
create table distortion_2023.profile (like public.profile including all);
create table distortion_2023.stage (like public.stage including all);
create table distortion_2023.timetable (like public.timetable including all);


-- Insert data
insert into distortion_2023.artist (
    id,
    "name",
    description,
    storage_path,
    bandcamp,
    spotify,
    tidal,
    apple_music,
    soundcloud,
    youtube,
    instagram,
    facebook,
    webpage,
    bandcamp_iframe,
    inserted_at,
    public,
    soundcloud_iframe,
    is_visible,
    country
)
select
    id,
    "name",
    description,
    storage_path,
    bandcamp,
    spotify,
    tidal,
    apple_music,
    soundcloud,
    youtube,
    instagram,
    facebook,
    webpage,
    bandcamp_iframe,
    inserted_at,
    public,
    soundcloud_iframe,
    is_visible,
    country
from artist;

insert into distortion_2023.stage (
    id,
    "name",
    description,
    icon_id,
    geom,
    event_id,
    inserted_at,
    public,
    "rank",
    tags,
    meta,
    url
)
select
    id,
    "name",
    description,
    icon_id,
    geom,
    event_id,
    inserted_at,
    public,
    "rank",
    tags,
    meta,
    url
from public.stage;

insert into distortion_2023.event (
    id,
    "name",
    description,
    geom,
    "style",
    inserted_at,
    public,
    storage_path,
    event_type_id,
    tickets
)
select
    id,
    "name",
    description,
    geom,
    "style",
    inserted_at,
    public,
    storage_path,
    event_type_id,
    tickets
from public.event;

insert into distortion_2023.asset select * from public.asset;
insert into distortion_2023.asset_type select * from public.asset_type;
insert into distortion_2023.day select * from public.day;
insert into distortion_2023.day_event select * from public.day_event;
insert into distortion_2023.event_type select * from public.event_type;
insert into distortion_2023.favorite select * from public.favorite;
insert into distortion_2023.icon select * from public.icon;
insert into distortion_2023.profile select * from public.profile;
insert into distortion_2023.timetable select * from public.timetable;
