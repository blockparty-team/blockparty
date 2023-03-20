## Prerequisites
* Account at https://supabase.com
* Supabase CLI: https://supabase.com/docs/guides/cli

## Getting started
Create a project for the festival using the interavtive mode and select nearest region and organization 
```
supabase projects create <YOUR FESTIVAL NAME> --interactive
`````

Find $SUPABASE_PROJECT_ID under settings -> Geneal -> Reference ID
```bash
supabase link --project-ref $SUPABASE_PROJECT_ID -p <YOUR-PG-PASSWORD>
```
This will prompt for PostgreSQL password provided when project was created.

### Diff
For diff run:
```bash
supabase db diff --use-migra -f <migration_message>
```
This will create migration sql script in the `supabase/migrations` folder. Omit `-f` flag for dry-run without file generation.

### Migration
For applying local database changes to the remote production database hosted at supabase.com run:
```bash
supabase db push -p <db_password>  
```

