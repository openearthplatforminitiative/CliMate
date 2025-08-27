"use client"

import RoomIcon from "@mui/icons-material/Room"
import { useCallback, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { MapMouseEvent } from "maplibre-gl"
import { Layer, Marker, useMap } from "react-map-gl/maplibre"
import { useRouter } from "next/navigation"
import { useSetAtom } from "jotai"
import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms"

export function IssuesLayer() {
	const [clickedPoint, setClickedPoint] = useState<[number, number] | null>()
	const [userLocation] = useState<[number, number] | null>(null)

	const setCreateIssueCoordinates = useSetAtom(createIssueCoordinatesAtom)
	const map = useMap()
	const navigate = useRouter()

	const handleIssueLayerClick = useCallback(
		(event: MapMouseEvent) => {
			const mapRef = map.current
			if (!mapRef) return

			const clickedFeatures = mapRef.queryRenderedFeatures(event.point, {
				layers: ["issues-labels", "clusters"],
			})

			if (clickedFeatures && clickedFeatures.length > 0) {
				setClickedPoint(null)
				if (clickedFeatures[0].properties.id) {
					navigate.push(`/dashboard/issues/${clickedFeatures[0].properties.id}`)
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
			handleIssueLayerClick(event)
		}

		mapRef.on("click", handleMapClick)

		return () => {
			mapRef.off("click", handleMapClick)
		}
	}, [handleIssueLayerClick, map, setClickedPoint])

	const handleCreateIssueClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault()
		setCreateIssueCoordinates({
			lat: clickedPoint![1],
			lng: clickedPoint![0],
		})
		navigate.push("/dashboard/issues/create")
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
							Add Report Here
						</Button>
						<RoomIcon />
					</div>
				</Marker>
			)}
			<Layer
				id="issues-labels"
				type="symbol"
				source="issues"
				layout={{
					"icon-image": ["get", "category"],
					"icon-size": [
						"interpolate",
						["linear"],
						["zoom"],
						0,
						0.1,
						12,
						0.25,
						22,
						0.5,
					],
				}}
			/>
		</>
	)
}
