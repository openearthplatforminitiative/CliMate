"use server"

import { Asset } from "@/types/asset"
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

export const fetchEvent = async (id: string) => {
	try {
		const response = await fetch(`${process.env.ENTITY_API_URL}/events/${id}`, {
			next: { revalidate: 60 },
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch event with id ${id}`)
		}
		const event = (await response.json()) as CliMateEvent

		const eventAssets = await fetch(
			`${process.env.NEXT_URL}/api/asset/${event.id}`
		)
			.then(async (response) => {
				if (!response.ok) {
					console.error("Failed to fetch assets for event:", event.id)
					return []
				}
				const { data } = (await response.json()) as { data: Asset[] }
				return data
			})
			.catch((error) => {
				console.error("Error fetching assets for event:", event.id, error)
				return []
			})

		return {
			...event,
			image_url: eventAssets.length > 0 ? eventAssets[0].url : undefined,
		}
	} catch (error) {
		console.error("Error fetching event:", error)
		throw error
	}
}
