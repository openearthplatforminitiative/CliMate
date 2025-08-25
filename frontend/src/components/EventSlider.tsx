import { CliMateEvent } from "@/types/event"
import { Card } from "./Card"

type EventGridProps = {
	events: CliMateEvent[]
}

export const EventSlider = ({ events }: EventGridProps) => {
	if (!events || events.length === 0) {
		return null
	}

	return (
		<div className="flex relative w-full overflow-x-scroll gap-4 px-4">
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
