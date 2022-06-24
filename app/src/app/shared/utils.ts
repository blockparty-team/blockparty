import { environment } from '@env/environment';

export const pathToImageUrl = (path: string) => (
    `${environment.supabaseUrl}/storage/v1/object/public/${path}`
);
