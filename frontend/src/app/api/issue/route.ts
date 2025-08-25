import { Asset } from "@/types/asset"
import { Issue } from "@/types/issue"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const PATH = "/issues"
export async function POST(req: NextRequest): Promise<Response> {
	try {
		const postData = await req.json()
		const result = await fetch(`${process.env.ENTITY_API_URL}${PATH}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		})

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to create issue in backend" },
				{ status: result.status }
			)
		}

		const data = await result.json()
		revalidateTag("issues")
		return NextResponse.json({ data })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

export async function GET() {
	console.log("GET issues")
	try {
		const result = await fetch(`${process.env.ENTITY_API_URL}${PATH}`)

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to get issues" },
				{ status: result.status }
			)
		}

		const issues = await result.json()

		const issuesWithAssetsPromise = issues.map(async (issue: Issue) => {
			const response = await fetch(
				`${process.env.NEXT_URL}/api/asset/${issue.id}`
			)
			if (!response.ok) {
				console.error("Failed to fetch assets for issue:", issue.id)
				return issue
			}
			const { data } = (await response.json()) as { data: Asset[] }
			if (data.length === 0) {
				console.error("No assets found for issue:", issue.id)
				return issue
			}
			return { ...issue, image_url: data[0].url }
		})
		const issuesWithAssets = await Promise.all(issuesWithAssetsPromise)
		return NextResponse.json({ data: issuesWithAssets })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

export async function PUT(req: NextRequest) {
	try {
		const putData = await req.json()
		console.log("PUT issue data:", putData)
		const result = await fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${putData.id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(putData),
			}
		)

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to create issue in backend" },
				{ status: result.status }
			)
		}
		revalidatePath(`/dashboard/issues/${putData.id}`)
		const data = await result.json()
		return NextResponse.json({ data })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
