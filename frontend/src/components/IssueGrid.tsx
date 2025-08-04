import { Card } from "./Card"
import { Issue } from "@/types/issue";

type IssueGridProps = {
	issues: Issue[];
}

export const IssueGrid = ({ issues }: IssueGridProps) => {
	if (!issues || issues.length === 0) {
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
