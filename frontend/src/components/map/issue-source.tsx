"use client"

import { currentIssueAtom } from "@/atoms/issueAtoms"
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { Source } from "react-map-gl/maplibre"

export function IssueSource() {

  const issue = useAtomValue(currentIssueAtom)

  const geoJsonData = useMemo<GeoJSON.FeatureCollection>(() => ({
    type: "FeatureCollection",
    features: issue ? [{
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
    }] : [],
  }), [issue])

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