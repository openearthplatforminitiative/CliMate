"use client"

import { getIssues, getIssuesInBounds } from "@/actions/issueActions"
import { IssueGrid } from "@/components/IssueGrid"
import { IssueSlider } from "@/components/IssueSlider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/lib/utils"
import { Issue } from "@/types/issue"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { } from "react-day-picker"
import { useMap } from "react-map-gl/maplibre"
import { Sheet, SheetRef } from "react-modal-sheet"

const SNAP_POINTS = [400, 90]

export default function IssuesPage() {
	const sheetRef = useRef<SheetRef>(null)
	const [issuesInBounds, setIssuesInBounds] = useState<Issue[]>([])
	const [numberOfIssues, setNumberOfIssues] = useState<number>()

	const isMobile = useIsMobile()
	const map = useMap()

	useEffect(() => {
		async function getNumbers() {
			const issues = await getIssues()
			setNumberOfIssues(issues.length)
		}
		getNumbers()
	}, [])

	useEffect(() => {
		const mapRef = map.ecoMap
		const fetchIssues = async () => {
			const mapBounds = mapRef?.getBounds()
			if (!mapBounds) {
				setIssuesInBounds([])
				return
			}

			const bounds = {
				minLat: mapBounds._sw.lat,
				minLng: mapBounds._sw.lng,
				maxLat: mapBounds._ne.lat,
				maxLng: mapBounds._ne.lng,
			}

			try {
				const issues = await getIssuesInBounds(bounds)
				setIssuesInBounds(issues)
			} catch (error) {
				console.error("Failed to fetch issues:", error)
			}
		}

		fetchIssues()

		mapRef?.on("moveend", fetchIssues)
		return () => {
			mapRef?.off("moveend", fetchIssues)
		}
	}, [map.ecoMap])

	const handleClose = () => {
		const sheet = sheetRef.current
		if (sheet) {
			sheet.snapTo(1)
		}
	}

	const zoomOut = () => {
		map.ecoMap?.zoomTo(0)
	}

	if (isMobile) {
		return (
			<Sheet
				ref={sheetRef}
				isOpen={true}
				onClose={handleClose}
				snapPoints={SNAP_POINTS}
				initialSnap={0}
				className="z-40"
			>
				<Sheet.Container className="rounded-t-4xl bg-primary-99">
					<Button asChild className="bg-primary-20">
						<Link
							href="/dashboard/issues/create"
							className="absolute -top-12 right-4 z-50"
						>
							Add Report
						</Link>
					</Button>
					<Sheet.Header />
					<Sheet.Content>
						<Sheet.Scroller>
							<Tabs value={"issues"}>
								<TabsList className="mx-auto mb-5">
									<TabsTrigger value="issues" asChild><Link href="/dashboard/issues">Issues</Link></TabsTrigger>
									<TabsTrigger value="events" asChild><Link href="/dashboard/events">Events</Link></TabsTrigger>
								</TabsList>
							</Tabs>
							{issuesInBounds.length == 0 &&
								(numberOfIssues == 0 ? (
									<p className="mx-4">There is no reports present</p>
								) : (
									<div className="flex flex-col mx-4 gap-2">
										<p>
											There is no issues on the current map. Please zoom out
										</p>
										<Button onClick={zoomOut}>
											Zoom Out
										</Button>
									</div>
								))}
							<IssueSlider issues={issuesInBounds} />
						</Sheet.Scroller>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="bg-primary-20 grow px-10 py-5 w-full">
			<Tabs value={"issues"}>
				<TabsList className="mx-auto mb-5">
					<TabsTrigger value="issues" asChild><Link href="/dashboard/issues">Issues</Link></TabsTrigger>
					<TabsTrigger value="events" asChild><Link href="/dashboard/events">Events</Link></TabsTrigger>
				</TabsList>
			</Tabs>
			<h1 className="text-2xl text-neutral-100 mb-4">Recent Issues</h1>
			{issuesInBounds.length == 0 &&
				(numberOfIssues == 0 ? (
					<p className="text-neutral-100">There is no issues present</p>
				) : (
					<div className="flex flex-col gap-2">
						<p className="text-neutral-100">
							There is no issues on the current map. Please zoom out
						</p>
						<Button variant="outline" className="self-start" onClick={zoomOut}>
							Zoom Out
						</Button>
					</div>
				))}
			<IssueGrid issues={issuesInBounds} />
		</div>
	)
}
