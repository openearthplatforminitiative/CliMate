import { redirect } from "next/navigation"

export default function EventsPage() {
	redirect("/dashboard?type=events")
}
