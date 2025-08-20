import { CliMateEvent } from "@/types/event"
import Link from "next/link"

export const EventGrid = ({ events }: { events: CliMateEvent[] }) => {
	if (!events || events.length === 0) {
		return null
	}

	return (
		<div className="grid grid-cols-2 2xl:grid-cols-3 w-full gap-4">
			{events.map((event) => (
				<Link key={event.id} href={`/events/${event.id}`}>
					<div className="">test</div>
				</Link>
			))}
		</div>
	)
}
