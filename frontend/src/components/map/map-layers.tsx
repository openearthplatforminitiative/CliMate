"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { ClusterLayer } from "./cluster-layer"
import { CreateIssueLayer } from "./create-issue-layer"
import { IssueLayer } from "./issue-layer"
import { IssueSource } from "./issue-source"
import { IssuesLayer } from "./issues-layer"
import { IssuesSource } from "./issues-source"
import { MissingImage } from "./missing-image"
import { EventsSource } from "./events-source"
import { EventsLayer } from "./events-layer"

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
					<ClusterLayer />
				</>
			)}
			{pathname === "/dashboard" && type === "events" && (
				<>
					<EventsSource />
					<EventsLayer />
					<ClusterLayer />
				</>
			)}
			{pathname === "/dashboard/issues/create" && <CreateIssueLayer />}
			{pathname.startsWith("/dashboard/issues/") && (
				<>
					<IssueSource />
					<IssueLayer />
				</>
			)}
			{pathname === "/dashboard/events/create" && <CreateIssueLayer />}
			<MissingImage />
		</>
	)
}
