
Create a project for the festival using the interavtive mode and select nearest region and organization 
```
supabase projects create <YOUR FESTIVAL NAME> --interactive
`````

Find $SUPABASE_PROJECT_ID under settings -> Geneal -> Reference ID
```bash
supabase link --project-ref $SUPABASE_PROJECT_ID
```