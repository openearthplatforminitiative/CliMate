"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { IssuesClusterLayer } from "./issues-cluster-layer"
import { CreateIssueLayer } from "./create-issue-layer"
import { IssueLayer } from "./issue-layer"
import { IssueSource } from "./issue-source"
import { IssuesLayer } from "./issues-layer"
import { IssuesSource } from "./issues-source"
import { MissingImage } from "./missing-image"
import { EventsSource } from "./events-source"
import { EventsLayer } from "./events-layer"
import { EventsClusterLayer } from "./events-cluster-layer"

export const MapLayers = () => {
	const pathname = usePathname()
	const params = useSearchParams()
	const type = params.get("type")
	return (
		<>
			{pathname === "/dashboard" && type === "reports" && (
				<>
					<IssuesSource />
					<IssuesLayer />
					<IssuesClusterLayer />
				</>
			)}
			{pathname === "/dashboard/issues/create" && <CreateIssueLayer />}
			{pathname.startsWith("/dashboard/issues/") && (
				<>
					<IssueSource />
					<IssueLayer />
				</>
			)}
			{pathname === "/dashboard" && type === "events" && (
				<>
					<EventsSource />
					<EventsLayer />
					<EventsClusterLayer />
				</>
			)}
			{pathname === "/dashboard/events/create" && <CreateIssueLayer />}
			{pathname.startsWith("/dashboard/events/") && (
				<>
					<EventsSource />
					<EventsLayer />
				</>
			)}
			<MissingImage />
		</>
	)
}
