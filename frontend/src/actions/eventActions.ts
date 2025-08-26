"use server"

import { CliMateEvent } from "@/types/event"
import booleanContains from "@turf/boolean-contains"
import { Feature } from "geojson"

interface BoundsCoordinates {
	minLat: number
	minLng: number
	maxLat: number
	maxLng: number
}

export async function getEvents(): Promise<CliMateEvent[]> {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/events`, {
			next: {
				revalidate: 60 * 60,
				tags: ["events"],
			},
		})
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

export const getEvent = async (id: string) => {
	try {
		const response = await fetch(`${process.env.NEXT_URL}/api/events/${id}`, {
			next: { revalidate: 60 },
		})

		if (!response.ok) {
			console.error("Failed to fetch event:", await response.text())
			throw new Error(`Failed to fetch event with id ${id}`)
		}
		return await response.json()
	} catch (error) {
		console.error("Error fetching event:", error)
		throw error
	}
}
