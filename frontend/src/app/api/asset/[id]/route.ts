import { NextRequest, NextResponse } from "next/server"

// /v1/issues/{issue}/assets
const BACKEND_URL = "http://localhost:8080/v1"
const PATH = "/issues"

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const issueId = url.pathname.split("/").pop()
		console.log("fetching: ", `${BACKEND_URL}${PATH}/${issueId}/assets`)
		const result = await fetch(`${BACKEND_URL}${PATH}/${issueId}/assets`)

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to get assets" },
				{ status: result.status }
			)
		}

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
