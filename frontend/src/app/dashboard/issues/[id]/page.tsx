import { notFound } from "next/navigation"
import { IssueComponent } from "./issue"
import { fetchIssue } from "@/actions/issueActions"

interface IssueProps {
	params: Promise<{
		id: string
	}>
}

export default async function IssuePage({ params }: IssueProps) {
	const { id } = await params
	const issue = await fetchIssue(id).catch(() => notFound())
	if (!issue) {
		return notFound()
	}

	return <IssueComponent issue={issue} />
}
