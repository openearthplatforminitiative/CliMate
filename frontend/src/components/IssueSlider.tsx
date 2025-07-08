import { useIssues } from "@/lib/IssuesContext"
import { Card } from "./Card"

export const IssueSlider = () => {
	const { issues } = useIssues()

	if (issues === undefined || issues === null) {
		return null
	}

	return (
		<div className="flex relative w-full overflow-x-scroll gap-4 px-4">
			{issues.map((issue) => (
				<Card
					key={issue.id}
					title={issue.title}
					description={issue.description}
					href={`/dashboard/issues/${issue.id}`}
					imageSrc={issue.image_url ? `${issue.image_url}` : "/image-placeholder.png"}
				/>
			))}
		</div>
	)
}
