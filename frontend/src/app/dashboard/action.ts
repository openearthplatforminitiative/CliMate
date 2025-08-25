"use server"

import { CliMateEvent } from "@/types/event"
import { Issue } from "@/types/issue"
import { booleanContains } from "@turf/boolean-contains"
import { Feature } from "geojson"

interface BoundsCoordinates {
	minLat: number
	minLng: number
	maxLat: number
	maxLng: number
}

async function getEvents(): Promise<CliMateEvent[]> {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/event`)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const { data: events } = await response.json()
		return events as CliMateEvent[]
	} catch (error) {
		console.error("Error fetching events:", error)
		return []
	}
}

export async function getEventsInBounds(
	bounds: BoundsCoordinates
): Promise<CliMateEvent[]> {
	try {
		const events = await getEvents()
		console.log(events)

		const { minLat, minLng, maxLat, maxLng } = bounds

		const filteredEvents = events.filter((event) => {
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
			const eventFeature: Feature = {
				type: "Feature",
				geometry: event.location,
				properties: {},
			}
			return booleanContains(boundsFeature, eventFeature)
		})

		return filteredEvents
	} catch (error) {
		console.error("Error fetching events in bounds:", error)
		throw error
	}
}

async function getIssues(): Promise<Issue[]> {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/issue`, {
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
		console.log(issues)

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
