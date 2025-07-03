"use server"

export const fetchIssue = async (id: string) => {
	try {
		const response = await fetch(`${process.env.ENTITY_API_URL}/issues/${id}`, {
			next: { revalidate: 60 },
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch issue with id ${id}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error("Error fetching issue:", error)
		throw error
	}
}
