"use client"
import { Card } from "./ui/card"
import { useIssues } from "@/lib/IssuesContext"
import Link from "next/link"
import { Skeleton } from "./ui/skeleton"
import { useMemo } from "react"

interface CardListProps {
	resolved?: boolean
}

export const CardList = ({ resolved = false }: CardListProps) => {
	const { issues, loading, error } = useIssues()

	const filteredIssues = useMemo(() => {
		if (!loading && issues.length > 0) {
			return issues.filter((issue) => (resolved ? issue.active : !issue.active))
		}
	}, [issues, loading, resolved])

	if (error) {
		return <div className="items-center">Error: Could not fetch issues</div>
	}

	if (loading) {
		return (
			<div className="flex flex-col items-center w-full">
				<div className="flex flex-col w-3/4">
					<Skeleton className="w-full h-20" />
				</div>
			</div>
		)
	}

	if (
		filteredIssues === undefined ||
		filteredIssues === null ||
		filteredIssues.length <= 0
	) {
		return <div className="flex flex-col items-center w-full">No issues</div>
	}

	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex flex-col w-3/4 gap-3">
				{filteredIssues.map((issue) => (
					<Link href={`/issues/${issue.id}`} key={issue.id} className="w-full">
						<Card className="flex w-full p-4 relative overflow-hidden bg-primary-100 hover:bg-primary-99 transition-colors min-h-20">
							{/* Content on the left side */}
							<div className="relative w-2/3">
								<h3 className="font-bold text-sm">{issue.title}</h3>
								<p className="text-xs">Category: {issue.category}</p>
							</div>
							<div
								className="absolute top-0 right-0 h-full w-1/3"
								style={{
									backgroundImage: `url(https://marylandmatters.org/wp-content/uploads/2022/12/AdobeStock_290929282-scaled.jpeg)`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							></div>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}
