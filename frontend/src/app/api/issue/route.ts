import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:8080/v1"
const PATH = "/issues"
export async function POST(req: NextRequest): Promise<Response> {
	// TODO: image
	// const blob = await req.blob();
	// const arrayBuffer = await blob.arrayBuffer();
	// const buffer = Buffer.from(arrayBuffer);
	try {
		const postData = await req.json()
		const result = await fetch(`${BACKEND_URL}${PATH}`, {
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
	try {
		const result = await fetch(`${BACKEND_URL}${PATH}`)

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to get issues" },
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

export async function PUT(req: NextRequest) {
	try {
		const putData = await req.json()
		const result = await fetch(`${BACKEND_URL}${PATH}/${putData.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(putData),
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
		return NextResponse.json({ data })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
