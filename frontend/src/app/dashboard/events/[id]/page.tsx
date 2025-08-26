import { notFound } from "next/navigation"
import { EventComponent } from "./event"
import { getEvent } from "@/actions/eventActions"

interface IssueProps {
	params: Promise<{
		id: string
	}>
}

export default async function EventPage({ params }: IssueProps) {
	const { id } = await params
	const event = await getEvent(id).catch(() => notFound())
	if (!event) {
		return notFound()
	}

	return <EventComponent event={event} />
}
