export type Category =
	| "garbage"
	| "chemicals"
	| "deforestation"
	| "destruction"
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

export type IssueWithImage = Omit<Issue, "image_url"> & {
	image: string // Base64 encoded image
}
