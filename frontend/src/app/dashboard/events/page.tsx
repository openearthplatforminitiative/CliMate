"use client"

import { getEvents, getEventsInBounds } from "@/actions/eventActions"
import { EventGrid } from "@/components/EventGrid"
import { EventSlider } from "@/components/EventSlider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/lib/utils"
import { CliMateEvent } from "@/types/event"
import { useSession } from "next-auth/react"
import Link from "next/dist/client/link"
import { useEffect, useRef, useState } from "react"
import { useMap } from "react-map-gl/maplibre"
import { Sheet, SheetRef } from "react-modal-sheet"

const SNAP_POINTS = [400, 90]

export default function EventsPage() {
	const sheetRef = useRef<SheetRef>(null)
	const [eventsInBounds, setEventsInBounds] = useState<CliMateEvent[]>([])
	const [numberOfEvents, setNumberOfEvents] = useState<number>()

	const { data: session } = useSession()
	const isMobile = useIsMobile()
	const map = useMap()

	useEffect(() => {
		async function getNumbers() {
			const events = await getEvents()
			setNumberOfEvents(events.length)
		}
		getNumbers()
	}, [])

	useEffect(() => {
		const mapRef = map.ecoMap
		const fetchEvents = async () => {
			const mapBounds = mapRef?.getBounds()
			if (!mapBounds) {
				return
			}

			const bounds = {
				minLat: mapBounds._sw.lat,
				minLng: mapBounds._sw.lng,
				maxLat: mapBounds._ne.lat,
				maxLng: mapBounds._ne.lng,
			}

			try {
				const events = await getEventsInBounds(bounds)
				setEventsInBounds(events)
			} catch (error) {
				console.error("Failed to fetch events:", error)
			}
		}

		fetchEvents()

		mapRef?.on("moveend", fetchEvents)
		return () => {
			mapRef?.off("moveend", fetchEvents)
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
					{session && (
						<Button asChild className="bg-primary-20">
							<Link
								href="/dashboard/events/create"
								className="absolute -top-12 right-4 z-50"
							>
								Add Event
							</Link>
						</Button>
					)}
					<Sheet.Header />
					<Sheet.Content>
						<Sheet.Scroller>
							<Tabs value={"events"}>
								<TabsList className="mx-auto mb-5">
									<TabsTrigger value="issues">
										<Link href="/dashboard/issues">Issues</Link>
									</TabsTrigger>
									<TabsTrigger value="events">
										<Link href="/dashboard/events">Events</Link>
									</TabsTrigger>
								</TabsList>
							</Tabs>
							{eventsInBounds.length == 0 &&
								(numberOfEvents == 0 ? (
									<p className="mx-4">There is no events present</p>
								) : (
									<div className="flex flex-col mx-4 gap-2">
										<p>
											There is no events on the current map. Please zoom out
										</p>
										<Button onClick={zoomOut}>Zoom Out</Button>
									</div>
								))}
							<EventSlider events={eventsInBounds} />
						</Sheet.Scroller>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="bg-primary-20 grow px-10 py-5 w-full">
			<Tabs value={"events"}>
				<TabsList className="mx-auto mb-5">
					<TabsTrigger value="issues">
						<Link href="/dashboard/issues">Issues</Link>
					</TabsTrigger>
					<TabsTrigger value="events">
						<Link href="/dashboard/events">Events</Link>
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<h1 className="text-2xl text-neutral-100 mb-4">Recent Events</h1>
			{eventsInBounds.length == 0 &&
				(numberOfEvents == 0 ? (
					<p className="text-neutral-100">There is no events present</p>
				) : (
					<div className="flex flex-col gap-2">
						<p className="text-neutral-100">
							There is no events on the current map. Please zoom out
						</p>
						<Button variant="outline" className="self-start" onClick={zoomOut}>
							Zoom Out
						</Button>
					</div>
				))}
			<EventGrid events={eventsInBounds} />
		</div>
	)
}
