import { useEffect, useState } from "react";
import { Card } from "./Card";
import { getEvents } from "@/actions/eventActions";
import { CliMateEvent } from "@/types/event";

export function HeroEvents() {
  const [events, setEvents] = useState<CliMateEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data.slice(0, 4));
    }
    fetchEvents()
  }, [])

  return (
    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 -mx-10 md:mx-0 overflow-x-auto mt-5 mb-10 px-10 md:px-0">
      {events.map((event) => (
        <Card
          key={event.id}
          title={event.name}
          description={event.description}
          date={new Date(event.start_date)}
          href={`/dashboard/events/${event.id}`}
        />
      ))}
    </div>
  )
}