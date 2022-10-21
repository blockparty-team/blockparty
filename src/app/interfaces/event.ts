import { Event } from "./database-entities"

export type EventViewModel = Pick<Event, 'id' | 'name' | 'description' | 'storage_path'>