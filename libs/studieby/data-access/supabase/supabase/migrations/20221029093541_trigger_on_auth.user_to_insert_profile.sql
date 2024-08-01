alter table "public"."profile" drop column "info";

alter table "public"."profile" add column "avatar_url" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
	insert into public.profile (id, username, avatar_url)
	values(
		new.id, 
		new.raw_user_meta_data ->> 'name', 
		new.raw_user_meta_data ->> 'avatar_url'
	);
	return new;
end;
$function$
;

create policy "User can read own profile"
on "public"."profile"
as permissive
for select
to public
using ((auth.uid() = id));



