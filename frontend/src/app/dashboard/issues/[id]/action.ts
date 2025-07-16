"use server"

import { Asset, Issue } from "@/types/issue"

export const fetchIssue = async (id: string) => {
	try {
		const response = await fetch(`${process.env.ENTITY_API_URL}/issues/${id}`, {
			next: { revalidate: 60 },
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch issue with id ${id}`)
		}
		const issue = (await response.json()) as Issue

		const issueAssets = await fetch(
			`${process.env.NEXT_URL}/api/asset/${issue.id}`
		)
			.then(async (response) => {
				if (!response.ok) {
					console.error("Failed to fetch assets for issue:", issue.id)
					return []
				}
				const { data } = (await response.json()) as { data: Asset[] }
				return data
			})
			.catch((error) => {
				console.error("Error fetching assets for issue:", issue.id, error)
				return []
			})

		return {
			...issue,
			image_url: issueAssets.length > 0 ? issueAssets[0].url : undefined,
		}
	} catch (error) {
		console.error("Error fetching issue:", error)
		throw error
	}
}
