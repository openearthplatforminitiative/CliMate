"use client"
import { Card } from "./ui/card"
import { useIssues } from "@/lib/IssuesContext"
import Link from "next/link"
import { Skeleton } from "./ui/skeleton"
import { useMemo } from "react"

interface CardListProps {
	active?: boolean
}

export const CardList = ({ active = true }: CardListProps) => {
	const { issues, loading, error } = useIssues()

	const filteredIssues = useMemo(() => {
		if (!loading && issues.length > 0 && !active) {
			issues.forEach((issue) => {
				console.log(issue.active)
			})
			return issues.filter((issue) => !issue.active)
		} else {
			return issues
		}
	}, [issues, loading])

	if (error) {
		return <div>Error: Could not fetch issues</div>
	}

	if (
		loading ||
		filteredIssues === undefined ||
		filteredIssues === null ||
		filteredIssues.length <= 0
	) {
		return <Skeleton className="w-[100px] h-[20px]" />
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
