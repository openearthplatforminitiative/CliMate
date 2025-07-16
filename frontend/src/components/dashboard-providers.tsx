"use client"

import { IssuesProvider } from "@/lib/IssuesContext"
import { MapProvider } from "react-map-gl/maplibre"

export function DashboardProviders({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<IssuesProvider>
			<MapProvider>{children}</MapProvider>
		</IssuesProvider>
	)
}
