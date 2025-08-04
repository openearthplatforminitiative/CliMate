"use server"

import { Issue } from "@/types/issue"
import { booleanContains } from "@turf/boolean-contains"
import { Feature } from "geojson"

interface BoundsCoordinates {
	minLat: number
	minLng: number
	maxLat: number
	maxLng: number
}

export const getIssuesInBounds = async (bounds: BoundsCoordinates) => {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/issue`, {
			next: {
				revalidate: 60 * 60, // cache for 60 minutes
				tags: ["issues"],
			},
		})
		if (!response.ok) {
			console.error("Failed to fetch issues", response.statusText)
			throw new Error("Failed to fetch issues")
		}
		const { data: issues } = (await response.json()) as { data: Issue[] }

		const { minLat, minLng, maxLat, maxLng } = bounds

		const filteredIssues = issues.filter((issue) => {
			const boundsFeature: Feature = {
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates: [
						[
							[minLng, minLat],
							[maxLng, minLat],
							[maxLng, maxLat],
							[minLng, maxLat],
							[minLng, minLat],
						],
					],
				},
				properties: {},
			}
			const [lng, lat] = issue.location.coordinates
			const issueFeature: Feature = {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [lng, lat],
				},
				properties: {},
			}
			return booleanContains(boundsFeature, issueFeature)
		})

		return filteredIssues
	} catch (error) {
		console.error("Error fetching issues in bounds:", error)
		throw error
	}
}
