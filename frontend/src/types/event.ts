import { Issue } from "./issue"

// "Event" is a name that is used several places in web development
// Have therefore called it CliMateEvent to prevent confusion.
export type CliMateEvent = {
	id?: string
	name: string
	description: string
	image_url?: string
	location: GeoJSON.Point | GeoJSON.Polygon
	issues?: Issue[]
	user_uuid?: string
	start_date: string
	end_date?: string
}
