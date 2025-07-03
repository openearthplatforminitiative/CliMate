"use client"

import { Map } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { IssuesLayer } from "./map/issues-layer"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { MissingImage } from "./map/missing-image"
import { MapSources } from "./map/map-sources"
import { ClusterLayer } from "./map/cluster-layer"
import { CreateIssueLayer } from "./map/create-issue-layer"

export const EcoMap = () => {
	const segments = useSelectedLayoutSegments()
	const pathname = usePathname()

	useEffect(() => {
		console.log(segments[segments.length - 1])
	}, [segments])

	const [mapLoaded, setMapLoaded] = useState(false)

	const handleMapLoad = () => {
		setMapLoaded(true)
	}

	return (
		<div className="sticky top-0 w-full h-screen min-h-screen">
			<Map
				initialViewState={{
					longitude: 10.752245,
					latitude: 59.913868,
					zoom: 8,
				}}
				style={{ width: "100%", height: "100%" }}
				mapStyle="https://tiles.openfreemap.org/styles/liberty"
				attributionControl={false}
				id="ecoMap"
				onLoad={handleMapLoad}
			>
				<MapSources />
				{pathname === "/dashboard" && (
					<>
						<IssuesLayer />
						<ClusterLayer />
					</>
				)}
				{pathname === "/dashboard/issues/create" && <CreateIssueLayer />}
				<MissingImage />
			</Map>
			{!mapLoaded && (
				<Skeleton className="w-full h-screen min-h-screen flex items-center justify-center">
					<p className="text-gray-500">Loading map...</p>
				</Skeleton>
			)}
		</div>
	)
}
