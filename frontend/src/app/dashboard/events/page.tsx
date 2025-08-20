"use client"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/utils"
import Link from "next/link"
import { useEvents } from "@/lib/EventsContext"
import { EventGrid } from "@/components/EventGrid"

export default function EventsPage() {
	const isMobile = useIsMobile()
	const { events } = useEvents()

	if (isMobile) {
		return (
			<div className="absolute inset-0 bg-neutral-100">
				<h1 className="text-lg font-bold mt-16">Events</h1>
				{events && events.length > 0 ? (
					events.map((event) => (
						<div key={event.id} className="bg-white p-4 rounded shadow mb-4">
							<h2 className="text-xl font-semibold">{event.name}</h2>
							<p>{event.description}</p>
							<p className="text-sm text-gray-500">{event.start_date}</p>
						</div>
					))
				) : (
					<div>No events</div>
				)}
				<Link href="/dashboard/events/create">
					<Button>Create Event</Button>
				</Link>
			</div>
		)
	}
	// TODO: Desktop view
	return (
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<h1 className="text-2xl font-bold mb-4">Events</h1>
			<EventGrid events={events} />
		</div>
	)
}
