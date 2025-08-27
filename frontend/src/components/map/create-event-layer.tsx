import { useCallback, useEffect, useState } from "react"
import { Marker, useMap } from "react-map-gl/maplibre"
import { MapMouseEvent } from "maplibre-gl"
import { Button } from "@/components/ui/button"
import RoomIcon from "@mui/icons-material/Room"
import { useSetAtom } from "jotai"
import { createEventCoordinatesAtom } from "@/atoms/eventAtoms"

export function CreateEventLayer() {
	const [clickedPoint, setClickedPoint] = useState<[number, number] | null>()
	const setCreateEventCoordinates = useSetAtom(createEventCoordinatesAtom)
	const map = useMap()

	const handleEventButtonClick = () => {
		setCreateEventCoordinates({
			lat: clickedPoint![1],
			lng: clickedPoint![0],
		})
	}

	const handleEventLayerClick = useCallback(
		(event: MapMouseEvent) => {
			const { lng, lat } = event.lngLat
			setClickedPoint([lng, lat])
		},
		[setClickedPoint]
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

	return (
		<>
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
							onClick={() => handleEventButtonClick()}
						>
							Set Event Here
						</Button>
						<RoomIcon />
					</div>
				</Marker>
			)}
		</>
	)
}
