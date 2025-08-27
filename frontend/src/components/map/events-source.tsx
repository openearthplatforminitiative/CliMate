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
			features: events.map((event) => ({
				type: "Feature",
				geometry: event.location,
				properties: {
					id: event.id,
					name: event.name,
					description: event.description,
					image: event.image_url,
					label: new Date(event.start_date).getDate(),
					startDate: event.start_date,
					endDate: event.end_date,
				},
			})),
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
			clusterMaxZoom={15}
			clusterRadius={20}
		/>
	)
}
