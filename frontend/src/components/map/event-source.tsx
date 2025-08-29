"use client"

import { getEvent } from "@/actions/eventActions"
import { CliMateEvent } from "@/types/event"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Source } from "react-map-gl/maplibre"

export function EventSource() {
	const [event, setEvent] = useState<CliMateEvent>()

	const params = useParams()

	useEffect(() => {
		const eventId = params.id
		if (!eventId || Array.isArray(eventId)) return

		const fetchEvent = async () => {
			try {
				const response = await getEvent(eventId)

				if (response) {
					setEvent(response)
				}
			} catch (error) {
				console.error("Error fetching issue:", error)
			}
		}

		fetchEvent()
	}, [params.id])

	const geoJsonData = useMemo<GeoJSON.FeatureCollection>(() => {
		if (!event) {
			return {
				type: "FeatureCollection",
				features: [],
			} as GeoJSON.FeatureCollection
		}
		const startDateObj = new Date(event.start_date)
		const monthName = startDateObj
			.toLocaleString("en-US", { month: "long" })
			.slice(0, 3)
		return {
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: event.location.coordinates,
					},
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
				},
			],
		} as GeoJSON.FeatureCollection
	},
		[event]
	)

	return (
		<Source
			id="event"
			type="geojson"
			data={geoJsonData}
			generateId
		/>
	)
}
