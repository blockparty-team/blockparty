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
		d.name as day_name,
		e.id event_id,
		e."name" event_name,
		e.event_type_id,
		et.name as event_type_name,
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
	join event_type et on e.event_type_id = et.id
	group by 1, 2, 3, 4, 5,6
	order by e.name
)
select 
	s.day_id as id,
	s.day_name as name,
	min(s.first_start_time) first_start_time,
	max(s.last_end_time) last_end_time,
    jsonb_agg(
    	jsonb_build_object(
				    'event_type_id', event_type_id,
					'event_type_name', event_type_name,
					'event_id', event_id, 
					'event_name', event_name, 
					'stages', stages
					)  
	) events
from stages s
group by 1, 2
order by first_start_time;