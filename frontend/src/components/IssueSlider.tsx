import { Issue } from "@/types/issue"
import { Card } from "./Card"

interface IssueSliderProps {
	issues: Issue[]
}

export const IssueSlider = ({ issues }: IssueSliderProps) => {
	return (
		<div className="flex relative w-full overflow-x-scroll gap-4 px-4">
			{issues.map((issue) => (
				<Card
					key={issue.id}
					title={issue.title}
					description={issue.description}
					href={`/dashboard/issues/${issue.id}`}
					imageSrc={
						issue.image_url ? `${issue.image_url}` : "/image-placeholder.png"
					}
				/>
			))}
		</div>
	)
}
