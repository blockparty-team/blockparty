alter table "public"."event" add column "rank" smallint default '50'::smallint;

alter table "public"."event_type" add column "rank" smallint default '50'::smallint;


