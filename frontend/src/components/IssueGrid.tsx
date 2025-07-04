import { useIssues } from "@/lib/IssuesContext"
import { Card } from "./Card"

export const IssueGrid = () => {
	const { issues } = useIssues()

	if (issues === undefined || issues === null) {
		return null
	}

	return (
		<div className="grid grid-cols-2 2xl:grid-cols-3 w-full gap-4">
			{issues.map((issue) => (
				<Card
					key={issue.id}
					title={issue.title}
					description={issue.description}
					href={`/dashboard/issues/${issue.id}`}
					imageSrc={issue.image_url}
				/>
			))}
		</div>
	)
}
