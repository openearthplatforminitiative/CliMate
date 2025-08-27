"use client"

import { getIssues } from "@/actions/issueActions"
import { Issue } from "@/types/issue"
import { useEffect, useMemo, useState } from "react"
import { Source } from "react-map-gl/maplibre"

export function IssuesSource() {
	const [issues, setIssues] = useState<Issue[]>([])

	useEffect(() => {
		async function fetchIssues() {
			const issues = await getIssues()
			setIssues(issues)
		}
		fetchIssues()
	}, [])

	const geoJsonData = useMemo<GeoJSON.FeatureCollection>(
		() => ({
			type: "FeatureCollection",
			features: issues.map((issue) => ({
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
					image: issue.image_url
				},
			})),
		}),
		[issues]
	)

	return (
		<Source
			id="issues"
			type="geojson"
			data={geoJsonData}
			generateId
			cluster={true}
			clusterRadius={20}
		/>
	)
}
