import { Event } from "./database-entities"

export interface EventViewModel extends Pick<Event, 'id' | 'name' | 'description' | 'storage_path'> {
    imgUrl?: string
}