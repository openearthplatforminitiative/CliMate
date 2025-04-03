import { useMap } from "@vis.gl/react-maplibre"
import { Card } from "./ui/card"
import { useIssues } from "@/lib/IssuesContext"
import { IssueWithImage } from "@/types/issue"

export const CardSlider = () => {
	const { issues } = useIssues()
	const { ecoMap } = useMap()

	if (issues === undefined || issues === null) {
		return null
	}

	const handleClick = (issue: IssueWithImage) => {
		const clickedPoint = issue.location.coordinates
		if (ecoMap) {
			const height = ecoMap.getContainer().clientHeight
			ecoMap.flyTo({
				center: [clickedPoint[0], clickedPoint[1]],
				offset: [0, -height / 5],
				zoom: 16,
				speed: 2,
			})
		}
	}

	return (
		<div className="flex relative w-full overflow-x-scroll gap-2 px-2">
			{issues.map((issue) => (
				<Card
					key={issue.id}
					className="flex-shrink-0 w-[300px] p-4 relative overflow-hidden bg-secondary-95"
					onClick={() => handleClick(issue)} // Pass the issue to handleClick
				>
					<div
						className="absolute top-0 right-0 h-full w-1/3"
						style={{
							backgroundImage: `url(https://marylandmatters.org/wp-content/uploads/2022/12/AdobeStock_290929282-scaled.jpeg)`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
					></div>

					{/* Content on the left side */}
					<div className="relative w-2/3">
						<h3 className="font-bold text-sm">{issue.title}</h3>
						<p className="text-xs">Category: {issue.category}</p>
						{/* <p className="text-xs mt-2">{issue.description}</p> */}
					</div>
				</Card>
			))}
		</div>
	)
}
