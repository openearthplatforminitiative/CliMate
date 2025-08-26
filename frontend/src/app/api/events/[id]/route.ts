import { Asset } from "@/types/asset"
import { NextRequest, NextResponse } from "next/server"

// /v1/events/{event}
const PATH = "/events"

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	console.log("GET event")
	try {
		const { id } = await params
		console.log("fetching: ", `${process.env.ENTITY_API_URL}${PATH}/${id}`)
		const eventResponsePromise = fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${id}`
		)
		const assetResponsePromise = fetch(
			`${process.env.ENTITY_API_URL}${PATH}/${id}/assets`
		)

		const [eventResponse, assetResponse] = await Promise.all([
			eventResponsePromise,
			assetResponsePromise,
		])

		if (!eventResponse.ok) {
			const errorText = await eventResponse.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to get event" },
				{ status: eventResponse.status }
			)
		} else {
			const event = await eventResponse.json()

			if (!assetResponse.ok) {
				const errorText = await assetResponse.text()
				console.error("Backend error:", errorText)
				return NextResponse.json(event)
			}
			const { data } = (await assetResponse.json()) as { data: Asset[] }
			if (!data[0]) {
				console.error("No assets found for event")
				return NextResponse.json(event)
			}
			const eventWithAsset = { ...event, image_url: data[0].url }
			return NextResponse.json(eventWithAsset)
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
	console.log("DELETE event")
	try {
		const { id } = await params
		const result = await fetch(`${process.env.ENTITY_API_URL}${PATH}/${id}`, {
			method: "DELETE",
		})

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to delete event" },
				{ status: result.status }
			)
		}
		return NextResponse.json({ message: "Event deleted successfully" })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
