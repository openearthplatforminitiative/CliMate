import { NextRequest, NextResponse } from "next/server"
import { CliMateEvent } from "@/types/event"
import { Asset } from "@/types/asset"
import { revalidateTag } from "next/cache"

const PATH = "/events"

export async function POST(req: NextRequest): Promise<Response> {
	try {
		const formData = await req.formData()

		const image = formData.get("image") as File
		const eventData = JSON.parse(formData.get("event") as string)

		const eventResponse = await fetch(`${process.env.ENTITY_API_URL}${PATH}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(eventData),
		})

		if (!eventResponse.ok) {
			const errorText = await eventResponse.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to create event in backend" },
				{ status: eventResponse.status }
			)
		} else {
			const event = await eventResponse.json()
			revalidateTag("events")

			const formData = new FormData()
			formData.append("image", image)

			const assetResponse = await fetch(
				`${process.env.NEXT_URL}/api${PATH}/${event.id}/assets`,
				{
					method: "POST",
					body: formData,
				}
			)

			if (!assetResponse.ok) {
				const errorText = await assetResponse.text()
				console.error("Backend error:", errorText)

				await fetch(`${process.env.NEXT_URL}/api${PATH}/${event.id}`, {
					method: "DELETE",
				})
				return NextResponse.json(
					{ error: "Failed to create asset in backend" },
					{ status: assetResponse.status }
				)
			}
			const asset = await assetResponse.json()
			return NextResponse.json({ data: { ...event, image_url: asset.url } })
		}
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
		const result = await fetch(`${process.env.ENTITY_API_URL}${PATH}`)

		if (!result.ok) {
			const errorText = await result.text()
			console.error("Backend error:", errorText)
			return NextResponse.json(
				{ error: "Failed to get events" },
				{ status: result.status }
			)
		}

		const events = await result.json()

		const eventsWithAssetsPromise = events.map(async (event: CliMateEvent) => {
			const response = await fetch(
				`${process.env.NEXT_URL}/api/events/${event.id}/assets`
			)
			if (!response.ok) {
				console.error("Failed to fetch assets for event:", event.id)
				return event
			}
			const { data } = (await response.json()) as { data: Asset[] }
			if (data.length === 0) {
				console.error("No assets found for event:", event.id)
				return event
			}
			return { ...event, image_url: data[0].url }
		})
		const eventsWithAssets = await Promise.all(eventsWithAssetsPromise)
		return NextResponse.json({ data: eventsWithAssets })
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
		console.log("PUT event data:", putData)
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
				{ error: "Failed to create event in backend" },
				{ status: result.status }
			)
		}

		const data = await result.json()
		revalidateTag(putData.id)
		return NextResponse.json({ data })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
