"use client"

import { Map } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { MapLayers } from "./map/map-layers"

export const EcoMap = () => {
	const [mapLoaded, setMapLoaded] = useState(false)

	const handleMapLoad = () => {
		setMapLoaded(true)
	}

	return (
		<>
			<Map
				initialViewState={{
					longitude: 0,
					latitude: 0,
					zoom: 0,
				}}
				style={{
					position: "absolute",
					transition: "linear",
					inset: 0,
					width: "100%",
					height: "100%",
				}}
				mapStyle="https://tiles.openfreemap.org/styles/liberty"
				attributionControl={false}
				id="ecoMap"
				onLoad={handleMapLoad}
			>
				<MapLayers />
			</Map>
			{!mapLoaded && (
				<Skeleton className="w-full h-screen min-h-screen flex items-center justify-center">
					<p className="text-gray-500">Loading map...</p>
				</Skeleton>
			)}
		</>
	)
}
