import { CliMateEvent } from "@/types/event"
import { Card } from "./Card"

type EventGridProps = {
	events: CliMateEvent[]
}

export const EventGrid = ({ events }: EventGridProps) => {
	if (!events || events.length === 0) {
		return null
	}

	return (
		<div className="grid grid-cols-2 2xl:grid-cols-3 w-full gap-4">
			{events.map((event) => (
				<Card
					key={event.id}
					title={event.name}
					description={event.description}
					href={`/dashboard/events/${event.id}`}
					date={new Date(event.start_date)}
					imageSrc={event.image_url}
				/>
			))}
		</div>
	)
}
