"use server"

import { Asset } from "@/types/asset"
import { CliMateEvent } from "@/types/event"

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
