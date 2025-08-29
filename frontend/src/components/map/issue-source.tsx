"use client"

import { getIssue } from "@/actions/issueActions"
import { Issue } from "@/types/issue"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Source } from "react-map-gl/maplibre"

export function IssueSource() {
	const [issue, setIssue] = useState<Issue>()

	const params = useParams()

	useEffect(() => {
		const issueId = params.id
		if (!issueId || Array.isArray(issueId)) return

		const fetchIssue = async () => {
			try {
				const response = await getIssue(issueId)

				if (response) {
					setIssue(response)
				}
			} catch (error) {
				console.error("Error fetching issue:", error)
			}
		}

		fetchIssue()
	}, [params.id])

	const geoJsonData = useMemo<GeoJSON.FeatureCollection>(
		() => ({
			type: "FeatureCollection",
			features: issue
				? [
						{
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
						},
					]
				: [],
		}),
		[issue]
	)

	return <Source id="issue" type="geojson" data={geoJsonData} generateId />
}
