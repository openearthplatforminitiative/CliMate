"use client"

import { getEvents } from "@/actions/eventActions"
import { CliMateEvent } from "@/types/event"
import { useEffect, useMemo, useState } from "react"
import { Source } from "react-map-gl/maplibre"

export function EventsSource() {
	const [events, setEvents] = useState<CliMateEvent[]>([])

	useEffect(() => {
		async function fetchEvents() {
			const events = await getEvents()
			setEvents(events)
		}
		fetchEvents()
	}, [])

	const geoJsonData = useMemo<GeoJSON.FeatureCollection>(
		() => ({
			type: "FeatureCollection",
			features: events.map((event) => {
				const startDateObj = new Date(event.start_date)
				const monthName = startDateObj
					.toLocaleString("en-US", { month: "long" })
					.slice(0, 3)
				return {
					type: "Feature",
					geometry: event.location,
					properties: {
						id: event.id,
						name: event.name,
						description: event.description,
						image: event.image_url,
						date: startDateObj.getDate(),
						month: monthName,
						startDate: event.start_date,
						endDate: event.end_date,
					},
				}
			}),
		}),
		[events]
	)

	return (
		<Source
			id="events"
			type="geojson"
			data={geoJsonData}
			generateId
			cluster={true}
			clusterRadius={20}
		/>
	)
}
