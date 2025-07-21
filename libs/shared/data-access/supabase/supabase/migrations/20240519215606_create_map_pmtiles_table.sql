create table "public"."map_pmtiles" (
    "id" uuid not null default gen_random_uuid(),
    "inserted_at" timestamp with time zone not null default now(),
    "name" text not null,
    "style" jsonb not null,
    "public" boolean default true,
    "storage_path" text not null
);

alter table "public"."map_pmtiles" enable row level security;

CREATE UNIQUE INDEX map_pmtile_name_key ON public.map_pmtiles USING btree (name);

CREATE UNIQUE INDEX map_pmtile_pkey ON public.map_pmtiles USING btree (id);

alter table "public"."map_pmtiles" add constraint "map_pmtile_pkey" PRIMARY KEY using index "map_pmtile_pkey";

alter table "public"."map_pmtiles" add constraint "map_pmtile_name_key" UNIQUE using index "map_pmtile_name_key";

grant references on table "public"."map_pmtiles" to "anon";

grant select on table "public"."map_pmtiles" to "anon";

grant trigger on table "public"."map_pmtiles" to "anon";

grant delete on table "public"."map_pmtiles" to "authenticated";

grant insert on table "public"."map_pmtiles" to "authenticated";

grant references on table "public"."map_pmtiles" to "authenticated";

grant select on table "public"."map_pmtiles" to "authenticated";

grant trigger on table "public"."map_pmtiles" to "authenticated";

grant truncate on table "public"."map_pmtiles" to "authenticated";

grant update on table "public"."map_pmtiles" to "authenticated";

grant delete on table "public"."map_pmtiles" to "service_role";

grant insert on table "public"."map_pmtiles" to "service_role";

grant references on table "public"."map_pmtiles" to "service_role";

grant select on table "public"."map_pmtiles" to "service_role";

grant trigger on table "public"."map_pmtiles" to "service_role";

grant truncate on table "public"."map_pmtiles" to "service_role";

grant update on table "public"."map_pmtiles" to "service_role";

create policy "Enable read access for anon role"
on "public"."map_pmtiles"
as permissive
for select
to anon
using (true);

INSERT INTO "storage".buckets (id,"name",public) VALUES
	('pmtiles','pmtiles',true)


