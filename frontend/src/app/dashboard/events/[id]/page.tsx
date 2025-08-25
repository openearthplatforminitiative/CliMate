import { notFound } from "next/navigation"
import { EventComponent } from "./event"
import { fetchEvent } from "@/actions/eventActions"

interface IssueProps {
	params: Promise<{
		id: string
	}>
}

export default async function IssuePage({ params }: IssueProps) {
	const { id } = await params
	const event = await fetchEvent(id).catch(() => notFound())
	if (!event) {
		return notFound()
	}

	return <EventComponent event={event} />
}
