"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CliMateEvent } from "@/types/event"
import { ChevronDown } from "lucide-react"
import { GeoJSONSource, LngLat } from "maplibre-gl"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Layer, MapMouseEvent, Marker, useMap } from "react-map-gl/maplibre"

type Cluster = {
	point: LngLat
	events: CliMateEvent[]
}

export function EventsClusterLayer() {
	const map = useMap()
	const [clickedCluster, setClickedCluster] = useState<Cluster | null>(null)

	const handleClusterClick = useCallback(
		(e: MapMouseEvent) => {
			const mapRef = map.current
			if (!mapRef) return
			const features = mapRef.queryRenderedFeatures(e.point, {
				layers: ["event-clusters"],
			})

			if (!features || features.length == 0) return setClickedCluster(null)

			const cluster = features[0]
			const clusterId = cluster.properties.cluster_id
			const pointCount = cluster.properties.point_count

			const clusterSource = mapRef.getSource("events")
			if (clusterSource && clusterSource.type === "geojson") {
				const source = clusterSource as GeoJSONSource
				const clusterGeometry = cluster.geometry as GeoJSON.Point

				source
					.getClusterLeaves(clusterId, pointCount, 0)
					.then((leaves) => {
						setClickedCluster({
							point: new LngLat(
								clusterGeometry.coordinates[0],
								clusterGeometry.coordinates[1]
							),
							events: leaves.map((leaf) => ({
								id: leaf.properties?.id,
								name: leaf.properties?.name,
								category: leaf.properties?.category,
								location: leaf.properties?.location,
								description: leaf.properties?.description,
								image_url: leaf.properties?.image,
								start_date: leaf.properties?.startDate,
								end_date: leaf.properties?.endDate,
							})),
						})
					})
					.catch((err) => {
						console.error("Error fetching cluster leaves:", err)
					})
			}
		},
		[map, setClickedCluster]
	)

	useEffect(() => {
		const mapRef = map.current
		if (!mapRef) return

		const handleMapClick = (event: MapMouseEvent) => {
			event.preventDefault()
			handleClusterClick(event)
		}

		mapRef.on("click", handleMapClick)

		return () => {
			mapRef.off("click", handleMapClick)
		}
	}, [handleClusterClick, map])

	return (
		<>
			<Layer
				id="event-clusters"
				type="circle"
				source="events"
				filter={["has", "point_count"]}
				paint={{
					"circle-color": "#677c6c",
					"circle-radius": 20,
				}}
			/>
			<Layer
				id="event-cluster-count"
				type="symbol"
				source="events"
				filter={["has", "point_count"]}
				layout={{
					"text-field": "{point_count_abbreviated}",
					"text-font": ["Noto Sans Regular"],
					"text-size": 12,
				}}
				paint={{
					"text-color": "#dff7e3",
				}}
			/>
			{clickedCluster && clickedCluster.events.length > 1 && (
				<Marker
					longitude={clickedCluster.point.lng}
					latitude={clickedCluster.point.lat}
					anchor="left"
					offset={[25, 0]}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Events
								<ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="start">
							{clickedCluster.events.map((event) => (
								<DropdownMenuItem key={event.id} asChild>
									<Link key={event.id} href={`/dashboard/events/${event.id}`}>
										{event.name}
									</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</Marker>
			)}
		</>
	)
}
