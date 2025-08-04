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

async function getIssues(): Promise<Issue[]> {
	try {
		const response = await fetch(`http://localhost:3000/api/issue`, {
			cache: "no-store", // Disable caching for development
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const { data: issues } = await response.json()
		return issues.data as Issue[]
	} catch (error) {
		console.error("Error fetching issues:", error)
		return []
	}
}

export const getIssuesInBounds = async (bounds: BoundsCoordinates) => {
	try {
		const issues = await getIssues()

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
