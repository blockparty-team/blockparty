alter table "public"."timetable" alter column "end_time" drop not null;

alter table "public"."timetable" alter column "start_time" drop not null;
