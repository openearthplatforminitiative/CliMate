import { useIssues } from "@/lib/IssuesContext"
import { Card } from "./Card"

export const IssueSlider = () => {
	const { issues } = useIssues()

	if (issues === undefined || issues === null) {
		return null
	}

	return (
		<div className="flex relative w-full overflow-x-scroll gap-2 px-2">
			{issues.map((issue) => (
				<Card
					key={issue.id}
					title={issue.title}
					description={issue.description}
					href={`/dashboard/issues/${issue.id}`}
					imageSrc="/river.jpg"
				/>
			))}
		</div>
	)
}
