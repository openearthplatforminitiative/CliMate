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

export async function getIssues(): Promise<Issue[]> {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/issues`, {
			next: {
				revalidate: 60 * 60,
				tags: ["issues"],
			},
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const { data: issues } = await response.json()
		return issues as Issue[]
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
			const issueFeature: Feature = {
				type: "Feature",
				geometry: issue.location,
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

export const getIssue = async (id: string) => {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/issues/${id}`, {
			next: { revalidate: 60 },
		})

		if (!response.ok) {
			console.error("Failed to fetch issue:", await response.text())
			throw new Error(`Failed to fetch issue with id ${id}`)
		}
		return await response.json()
	} catch (error) {
		console.error("Error fetching issue:", error)
		throw error
	}
}
