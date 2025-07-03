import { NextRequest, NextResponse } from "next/server"

// /v1/issues/{issue}/assets
const PATH = "/issues"
export async function POST(req: NextRequest): Promise<Response> {
	const formData = await req.formData()
	const issueId = formData.get("issueId")
	const image = formData.get("image") as File

	if (!issueId || !image) {
		return NextResponse.json(
			{ error: "Missing issue ID or image" },
			{ status: 400 }
		)
	}

	const backendFormData = new FormData()
	backendFormData.append("file", image, image.name) // Add the image file
	backendFormData.append("issueId", issueId as string)
	try {
		// const postData = await req.json()
		const result = await fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${issueId}/assets`,
			{
				method: "POST",
				body: backendFormData,
			}
		)

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to create asset in backend" },
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

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const issueId = url.pathname.split("/").pop()
		console.log(
			"fetching: ",
			`${process.env.ENTITY_API_URL}${PATH}/${issueId}/assets`
		)
		const result = await fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${issueId}/assets`
		)

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
