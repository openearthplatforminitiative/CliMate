import { NextRequest, NextResponse } from "next/server"

// /v1/events/{event}/assets
const PATH = "/events"

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	console.log("GET assets")
	try {
		console.log(
			"fetching: ",
			`${process.env.ENTITY_API_URL}${PATH}/${id}/assets`
		)
		const result = await fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${id}/assets`
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

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {
	const { id } = await params
	const formData = await req.formData()
	const image = formData.get("image") as File

	if (!id || !image) {
		return NextResponse.json(
			{ error: "Missing event ID or image" },
			{ status: 400 }
		)
	}

	const backendFormData = new FormData()
	backendFormData.append("file", image, image.name)
	backendFormData.append("eventId", id)
	try {
		const result = await fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${id}/assets`,
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
