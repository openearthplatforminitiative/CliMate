"use client"

import { getIssuesInBounds } from "@/app/dashboard/action"
import { Issue } from "@/types/issue"
import { useEffect, useMemo, useState } from "react"
import { Source, useMap } from "react-map-gl/maplibre"

export function IssuesSource() {
	const [issuesInBounds, setIssuesInBounds] = useState<Issue[]>([])
	const map = useMap()

	useEffect(() => {
		const mapRef = map.ecoMap
		const fetchIssues = async () => {
			const mapBounds = mapRef?.getBounds()
			if (!mapBounds) {
				setIssuesInBounds([])
				return
			}

			const bounds = {
				minLat: mapBounds._sw.lat,
				minLng: mapBounds._sw.lng,
				maxLat: mapBounds._ne.lat,
				maxLng: mapBounds._ne.lng,
			}

			try {
				const issues = await getIssuesInBounds(bounds)
				setIssuesInBounds(issues)
			} catch (error) {
				console.error("Failed to fetch issues:", error)
			}
		}

		fetchIssues()

		mapRef?.on("moveend", fetchIssues)
		return () => {
			mapRef?.off("moveend", fetchIssues)
		}
	}, [map.ecoMap])

	const geoJsonData = useMemo<GeoJSON.FeatureCollection>(
		() => ({
			type: "FeatureCollection",
			features: issuesInBounds.map((issue) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: issue.location.coordinates,
				},
				properties: {
					id: issue.id,
					title: issue.title,
					category: issue.category,
					description: issue.description,
					image: issue.image_url,
				},
			})),
		}),
		[issuesInBounds]
	)

	return (
		<Source
			id="issues"
			type="geojson"
			data={geoJsonData}
			generateId
			cluster={true}
			clusterMaxZoom={15}
			clusterRadius={20}
		/>
	)
}
