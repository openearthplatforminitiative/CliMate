"use client"

import { MapProvider } from "react-map-gl/maplibre"

export function DashboardProviders({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<MapProvider>{children}</MapProvider>
	)
}
