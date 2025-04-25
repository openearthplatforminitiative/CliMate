"use client"
import { useIssues } from "@/lib/IssuesContext"
import { use, useMemo } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Map, Marker } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { mapStyle } from "@/utils/mapStyle"
import Pin from "@/components/Pin"
import Link from "next/link"
import { Issue, IssueWithImage } from "@/types/issue"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface IssueProps {
	params: Promise<{
		id: string
	}>
}

const IssuePage = ({ params }: IssueProps) => {
	const { id } = use(params)
	const { issues } = useIssues()
	const { data: session } = useSession()
	const issue = useMemo(() => {
		return issues.find((issue) => issue.id === id)
	}, [issues])

	if (issue === undefined || issue === null) return null

	const handleClick = async () => {
		try {
			const putData: Issue = {
				id: issue.id,
				title: issue.title,
				description: issue.description,
				category: issue.category,
				location: issue.location,
				user_uuid: issue.user_uuid,
				resolved: !issue.resolved,
			}

			const response = await fetch("/api/issue", {
				method: "PUT",
				body: JSON.stringify(putData),
			})

			if (!response.ok) {
				throw new Error("Failed to upload the issue.")
			}

			const { data }: { data: IssueWithImage } = await response.json()
			console.log("Data:", data)
			// TODO: update issue state
			toast("Successfully updated report")
		} catch (error) {
			toast("Could not update issue")
			console.error("Error updating issue:", error)
		}
	}

	return (
		<div className="flex flex-col w-full min-h-screen bg-secondary-95 items-center">
			<Card className="p-5 w-7/8 mt-5">
				<div className="relative mb-4">
					<Link href={"."} className="absolute left-0 top-1/2 -translate-y-1/2">
						<Button className="bg-neutral-95 text-neutral-0">{"<"}</Button>
					</Link>
					<h1 className="text-3xl text-center">{issue.title}</h1>
				</div>

				<div className="flex flex-col items-center gap-4">
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
					<div className="w-full h-[300px] my-4">
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
					<Button
						className="bg-primary-20 hover:bg-primary-10"
						onClick={handleClick}
					>
						Set as {issue.resolved ? "unresolved" : "resolved"}
					</Button>
				</div>
			</Card>
		</div>
	)
}

export default IssuePage
