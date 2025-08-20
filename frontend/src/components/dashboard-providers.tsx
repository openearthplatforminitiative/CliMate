"use client"

import { IssuesProvider } from "@/lib/IssuesContext"
import { MapProvider } from "react-map-gl/maplibre"
import { EventsProvider } from "@/lib/EventsContext"

export function DashboardProviders({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<IssuesProvider>
			<EventsProvider>
				<MapProvider>{children}</MapProvider>
			</EventsProvider>
		</IssuesProvider>
	)
}
