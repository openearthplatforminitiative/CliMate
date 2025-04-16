"use client"
import { useIssues } from "@/lib/IssuesContext"
import { use, useMemo } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layer, Map, MapProvider, Marker, Source } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { mapStyle } from "@/utils/mapStyle"
import Pin from "@/components/Pin"

interface IssueProps {
	params: Promise<{
		id: string
	}>
}

const Issue = ({ params }: IssueProps) => {
	const { id } = use(params)
	const { issues } = useIssues()
	const issue = useMemo(() => {
		return issues.find((issue) => issue.id === id)
	}, [issues])

	if (issue === undefined || issue === null) return null

	const activeString = issue.active ? "true" : "false"

	return (
		<div className="flex flex-col w-full min-h-screen bg-secondary-95 items-center">
			<Card className="p-5 w-7/8 mt-5 items-center">
				<h1 className="text-3xl">{issue.title}</h1>
				<div>Category: {issue.category}</div>
				<div>{issue.description}</div>
				<div>
					<Image
						src="https://marylandmatters.org/wp-content/uploads/2022/12/AdobeStock_290929282-scaled.jpeg"
						width={200}
						height={100}
						alt="Picture of issue"
					/>
				</div>
				<div>Active: {activeString}</div>
				<div className="w-full h-[300px] my-4">
					{" "}
					{/* Added container with fixed height */}
					<Map
						initialViewState={{
							longitude: issue.location.coordinates[0],
							latitude: issue.location.coordinates[1],
							zoom: 12,
						}}
						style={{ width: "100%", height: "100%" }}
						mapStyle={mapStyle}
						id="issueMap"
						attributionControl={false}
					>
						<Marker
							key={issue.id}
							longitude={issue.location.coordinates[0]}
							latitude={issue.location.coordinates[1]}
							anchor="bottom"
						>
							<Pin />
						</Marker>
					</Map>
				</div>

				<Button className="bg-primary-20 hover:bg-primary-10">
					Set as resolved
				</Button>
			</Card>
		</div>
	)
}

export default Issue
