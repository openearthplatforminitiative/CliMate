"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Issue } from "@/types/issue"
import { ChevronDown } from "lucide-react"
import { GeoJSONSource, LngLat } from "maplibre-gl"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Layer, MapMouseEvent, Marker, useMap } from "react-map-gl/maplibre"

type Cluster = {
	point: LngLat
	issues: Issue[]
}

export function ClusterLayer() {
	const map = useMap()
	const [clickedCluster, setClickedCluster] = useState<Cluster | null>(null)

	const handleClusterClick = useCallback(
		(e: MapMouseEvent) => {
			const mapRef = map.current
			if (!mapRef) return
			const features = mapRef.queryRenderedFeatures(e.point, {
				layers: ["clusters"],
			})

			if (!features || features.length == 0) return setClickedCluster(null)

			const cluster = features[0]
			const clusterId = cluster.properties.cluster_id
			const pointCount = cluster.properties.point_count

			const clusterSource = mapRef.getSource("issues")
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
							issues: leaves.map((leaf) => ({
								id: leaf.properties?.id,
								title: leaf.properties?.title,
								category: leaf.properties?.category,
								description: leaf.properties?.description,
								image_url: leaf.properties?.image,
								location: leaf.properties?.location,
								active: leaf.properties?.active,
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
				id="clusters"
				type="circle"
				source="issues"
				filter={["has", "point_count"]}
				paint={{
					"circle-color": "#677c6c",
					"circle-radius": 20,
				}}
			/>
			<Layer
				id="cluster-count"
				type="symbol"
				source="issues"
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
			{clickedCluster && clickedCluster.issues.length > 1 && (
				<Marker
					longitude={clickedCluster.point.lng}
					latitude={clickedCluster.point.lat}
					anchor="left"
					offset={[25, 0]}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Issues
								<ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="start">
							{clickedCluster.issues.map((issue) => (
								<DropdownMenuItem key={issue.id} asChild>
									<Link key={issue.id} href={`/dashboard/issues/${issue.id}`}>
										{issue.title}
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
