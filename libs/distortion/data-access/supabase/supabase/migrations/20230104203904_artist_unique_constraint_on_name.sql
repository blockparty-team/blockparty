CREATE UNIQUE INDEX artist_name_key ON public.artist USING btree (name);

alter table "public"."artist" add constraint "artist_name_key" UNIQUE using index "artist_name_key";


