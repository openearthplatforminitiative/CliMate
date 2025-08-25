import { redirect } from "next/navigation"

export default function IssuesPage() {
	redirect("/dashboard?type=reports")
}
