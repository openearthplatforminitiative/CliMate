"use client";

import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Marker, MarkerDragEvent, useMap } from "react-map-gl/maplibre";

export function CreateIssueLayer() {
  const [coordinates, setCoordinates] = useAtom(createIssueCoordinatesAtom);
  const map = useMap();

  useEffect(() => {
    const mapRef = map.current;
    if (!mapRef || !coordinates) return;
    mapRef.flyTo({
      center: [coordinates.lng, coordinates.lat],
      duration: 1000,
    });
  }, [coordinates, map]);

  const handleDragEnd = (event: MarkerDragEvent) => {
    const lngLat = event.lngLat
    setCoordinates({
      lng: lngLat.lng,
      lat: lngLat.lat,
    });
  };

  return (
    <Marker
      longitude={coordinates?.lng || 0}
      latitude={coordinates?.lat || 0}
      draggable
      onDragEnd={handleDragEnd}
      anchor="center"
    />
  )
}