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
	resolved: boolean
}

export type Asset = {
	id: string
	name: string
	mimetype: string
	file_size: number
	url: string
	created_at: Date
	updated_at: Date
	checksum: string
}
