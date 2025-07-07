"use client"

import { useIssues } from "@/lib/IssuesContext"
import { useMemo } from "react"
import { Source } from "react-map-gl/maplibre"

export function IssuesSource() {

  const { issues } = useIssues()

  const geoJsonData = useMemo<GeoJSON.FeatureCollection>(() => ({
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
        image: issue.image_url,
      },
    })),
  }), [issues])

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