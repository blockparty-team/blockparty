create table "public"."event_type" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "color" text,
    "inserted_at" timestamp with time zone not null default now(),
    "public" boolean default false
);


alter table "public"."event" add column "event_type_id" uuid;

CREATE UNIQUE INDEX event_type_pkey ON public.event_type USING btree (id);

alter table "public"."event_type" add constraint "event_type_pkey" PRIMARY KEY using index "event_type_pkey";

alter table "public"."event" add constraint "event_event_type_id_fkey" FOREIGN KEY (event_type_id) REFERENCES event_type(id) not valid;

alter table "public"."event" validate constraint "event_event_type_id_fkey";


