export type Category =
	| "garbage"
	| "chemicals"
	| "deforestation"
	| "vandalism"
	| "other"

export type Issue = {
	id?: string
	title: string
	description: string
	image_url?: string
	location: GeoJSON.Point
	category: Category
	user_uuid?: string
	active: boolean
}
