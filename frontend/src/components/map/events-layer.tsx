"use client"

import RoomIcon from "@mui/icons-material/Room"
import { useCallback, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { MapMouseEvent } from "maplibre-gl"
import { Layer, Marker, useMap } from "react-map-gl/maplibre"
import { useRouter } from "next/navigation"
import { useSetAtom } from "jotai"
import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms"
import { useSession } from "next-auth/react"

export function EventsLayer() {
	const [clickedPoint, setClickedPoint] = useState<[number, number] | null>()
	const [userLocation] = useState<[number, number] | null>(null)

	const setCreateIssueCoordinates = useSetAtom(createIssueCoordinatesAtom)
	const map = useMap()
	const navigate = useRouter()
	const { data: session } = useSession()

	const handleEventLayerClick = useCallback(
		(event: MapMouseEvent) => {
			const mapRef = map.current
			if (!mapRef) return

			const clickedFeatures = mapRef.queryRenderedFeatures(event.point, {
				layers: ["events-layer"],
			})

			if (clickedFeatures && clickedFeatures.length > 0) {
				setClickedPoint(null)
				if (clickedFeatures[0].properties.id) {
					navigate.push(`/dashboard/events/${clickedFeatures[0].properties.id}`)
				}
			} else {
				const { lng, lat } = event.lngLat
				setClickedPoint([lng, lat])
			}
		},
		[map, navigate, setClickedPoint]
	)

	useEffect(() => {
		const mapRef = map.current
		if (!mapRef) return

		const handleMapClick = (event: MapMouseEvent) => {
			handleEventLayerClick(event)
		}

		mapRef.on("click", handleMapClick)

		return () => {
			mapRef.off("click", handleMapClick)
		}
	}, [handleEventLayerClick, map, setClickedPoint])

	const handleCreateIssueClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		if (!session) return
		setCreateIssueCoordinates({
			lat: clickedPoint![1],
			lng: clickedPoint![0],
		})
		navigate.push("/dashboard/events/create")
	}

	return (
		<>
			{userLocation && (
				<Marker longitude={userLocation[0]} latitude={userLocation[1]}>
					<div className="w-4 h-4 bg-tertiary-60 rounded-full border-2 border-white"></div>
				</Marker>
			)}
			{clickedPoint && (
				<Marker
					longitude={clickedPoint[0]}
					latitude={clickedPoint[1]}
					anchor="bottom"
				>
					<div className="flex flex-col items-center gap-2">
						<Button
							size="sm"
							className="bg-primary-20 whitespace-nowrap"
							onClick={handleCreateIssueClick}
						>
							Add Event Here
						</Button>
						<RoomIcon />
					</div>
				</Marker>
			)}
			<Layer
				id="events-layer"
				type="circle"
				source="events"
				paint={{
					"circle-color": "#DFF7E3",
					"circle-radius": 20,
				}}
			/>
			<Layer
				id="events-date-layer"
				type="symbol"
				source="events"
				layout={{
					"text-field": ["get", "date"],
					"text-font": ["Noto Sans Regular"],
					"text-size": 16,
					"text-anchor": "bottom",
					"text-offset": [0, 0.3],
					"text-allow-overlap": true, // Allow text to overlap other text
					"text-ignore-placement": true, // Don't hide text due to collisions
				}}
				paint={{
					"text-color": "#005230",
				}}
			/>
			<Layer
				id="events-month-layer"
				type="symbol"
				source="events"
				layout={{
					"text-field": ["get", "month"],
					"text-font": ["Noto Sans Regular"],
					"text-size": 9,
					"text-offset": [0, 0.3],
					"text-anchor": "top",
					"text-allow-overlap": true,
					"text-ignore-placement": true,
				}}
				paint={{
					"text-color": "#005230",
				}}
			/>
		</>
	)
}
