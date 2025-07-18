"use client"

import { NextRequest, NextResponse } from "next/server"
import { CliMateEvent } from "@/types/event"
import { Asset } from "@/types/asset"

const PATH = "/events"

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
				{ error: "Failed to create event in backend" },
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
				`${process.env.NEXT_URL}/api/asset/${event.id}`
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
		return NextResponse.json({ data })
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}