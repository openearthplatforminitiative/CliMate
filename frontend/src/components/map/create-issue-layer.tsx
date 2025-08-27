"use client"

import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms"
import { useAtom } from "jotai"
import { Marker, MarkerDragEvent } from "react-map-gl/maplibre"
import { MapMarker } from "../map-marker"

export function CreateIssueLayer() {
	const [coordinates, setCoordinates] = useAtom(createIssueCoordinatesAtom)

	const handleDragEnd = (event: MarkerDragEvent) => {
		const lngLat = event.lngLat
		setCoordinates({
			lng: lngLat.lng,
			lat: lngLat.lat,
		})
	}

	if (!coordinates) return null
	return (
		<Marker
			longitude={coordinates?.lng}
			latitude={coordinates?.lat}
			draggable
			onDragEnd={handleDragEnd}
			anchor="center"
		>
			<MapMarker />
		</Marker>
	)
}
