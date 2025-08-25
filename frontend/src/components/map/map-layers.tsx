"use client"

import { usePathname } from "next/navigation"
import { ClusterLayer } from "./cluster-layer"
import { CreateIssueLayer } from "./create-issue-layer"
import { IssueLayer } from "./issue-layer"
import { IssueSource } from "./issue-source"
import { IssuesLayer } from "./issues-layer"
import { IssuesSource } from "./issues-source"
import { MissingImage } from "./missing-image"

export const MapLayers = () => {
	const pathname = usePathname()
	return (
		<>
			{pathname === "/dashboard" && (
				<>
					<IssuesSource />
					<IssuesLayer />
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
