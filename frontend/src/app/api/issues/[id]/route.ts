import { Asset } from "@/types/asset"
import { NextRequest, NextResponse } from "next/server"

// /v1/issues/{issue}
const PATH = "/issues"

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	console.log("GET issue")
	try {
		const { id } = await params
		console.log("fetching: ", `${process.env.ENTITY_API_URL}${PATH}/${id}`)
		const issueResponsePromise = fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${id}`
		)
		const assetResponsePromise = fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${id}/assets`
		)

		const [issueResponse, assetResponse] = await Promise.all([
			issueResponsePromise,
			assetResponsePromise,
		])

		if (!issueResponse.ok) {
			const errorText = await issueResponse.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to get issue" },
				{ status: issueResponse.status }
			)
		} else {
			const issue = await issueResponse.json()

			if (!assetResponse.ok) {
				const errorText = await assetResponse.text()
				console.error("Backend error:", errorText)
				return NextResponse.json(issue)
			}
			const data = (await assetResponse.json()) as Asset[]
			if (!data) {
				console.error("No assets found for issue")
				return NextResponse.json(issue)
			}
			const issueWithAsset = { ...issue, image_url: data[0].url }
			return NextResponse.json(issueWithAsset)
		}
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	console.log("DELETE issue")
	try {
		const { id } = await params
		const result = await fetch(`${process.env.ENTITY_API_URL}${PATH}/${id}`, {
			method: "DELETE",
		})

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to delete issue" },
				{ status: result.status }
			)
		}
		return NextResponse.json({ message: "Issue deleted successfully" })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
