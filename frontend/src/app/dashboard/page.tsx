"use client"

import { IssueGrid } from "@/components/IssueGrid"
import { IssueSlider } from "@/components/IssueSlider"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Sheet, SheetRef } from "react-modal-sheet"
import { getEventsInBounds } from "@/actions/eventActions"
import { getIssues, getIssuesInBounds } from "@/actions/issueActions"
import { useMap } from "react-map-gl/maplibre"
import { Issue } from "@/types/issue"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CliMateEvent } from "@/types/event"
import { EventGrid } from "@/components/EventGrid"
import { EventSlider } from "@/components/EventSlider"
import { getEvents } from "@/actions/eventActions"

const SNAP_POINTS = [400, 90]

export default function MapPage() {
	const sheetRef = useRef<SheetRef>(null)
	const [issuesInBounds, setIssuesInBounds] = useState<Issue[]>([])
	const [numberOfIssues, setNumberOfIssues] = useState<number>()
	const [eventsInBounds, setEventsInBounds] = useState<CliMateEvent[]>([])
	const [numberOfEvents, setNumberOfEvents] = useState<number>()

	const isMobile = useIsMobile()
	const map = useMap()

	useEffect(() => {
		async function getNumbers() {
			const issues = await getIssues()
			setNumberOfIssues(issues.length)
			const events = await getEvents()
			setNumberOfEvents(events.length)
		}
		getNumbers()
	})

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
				const events = await getEventsInBounds(bounds)
				setIssuesInBounds(issues)
				setEventsInBounds(events)
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

	if (isMobile) {
		return (
			<Sheet
				ref={sheetRef}
				isOpen={true}
				onClose={handleClose}
				snapPoints={SNAP_POINTS}
				initialSnap={1}
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
							<Tabs defaultValue="reports">
								<TabsList className="mx-auto">
									<TabsTrigger value="reports">Reports</TabsTrigger>
									<TabsTrigger value="events">Events</TabsTrigger>
								</TabsList>
								<TabsContent value="reports">
									<IssueSlider issues={issuesInBounds} />
								</TabsContent>
								<TabsContent value="events">
									<EventSlider events={eventsInBounds} />
								</TabsContent>
							</Tabs>
						</Sheet.Scroller>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="bg-primary-20 grow px-10 py-5 w-full">
			<Tabs defaultValue="reports">
				<TabsList className="mx-auto mb-5">
					<TabsTrigger value="reports">Reports</TabsTrigger>
					<TabsTrigger value="events">Events</TabsTrigger>
				</TabsList>
				<TabsContent value="reports">
					<h1 className="text-2xl text-neutral-100 mb-4">Recent Reports</h1>
					{issuesInBounds.length == 0 &&
						(numberOfIssues == 0 ? (
							<p className="text-neutral-100">There is no reports present</p>
						) : (
							<p className="text-neutral-100">
								There is no reports on the current map. Please zoom out
							</p>
						))}
					<IssueGrid issues={issuesInBounds} />
				</TabsContent>
				<TabsContent value="events">
					<h1 className="text-2xl text-neutral-100 mb-4">Recent Events</h1>
					{eventsInBounds.length == 0 &&
						(numberOfEvents == 0 ? (
							<p className="text-neutral-100">There is no events present</p>
						) : (
							<p className="text-neutral-100">
								There is no events on the current map. Please zoom out
							</p>
						))}
					<EventGrid events={eventsInBounds} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
