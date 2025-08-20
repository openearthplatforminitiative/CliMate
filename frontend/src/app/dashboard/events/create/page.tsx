"use client"
import { useIsMobile } from "@/lib/utils"
import { SheetRef } from "react-modal-sheet"
import { Button } from "@/components/ui/button"
import { EventForm } from "@/components/EventForm"
import { useRef, useState } from "react"
import { useMap } from "react-map-gl/maplibre"

export default function CreateEventPage() {
	const sheetRef = useRef<SheetRef>(null)
	const isMobile = useIsMobile()

	if (isMobile) {
		return (
			<div className="absolute inset-0 bg-neutral-100 p-4">
				<div className="flex justify-between mb-4">
					<h1 className="text-lg font-bold mt-16">Create Event</h1>
					<Button
						className="bg-neutral-90 hover:bg-neutral-80 text-neutral-0 ml-4"
						size="icon"
						asChild
					></Button>
				</div>
				<EventForm />
			</div>
		)
	}
	return (
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<h1 className="text-2xl font-bold mb-4">Create Event</h1>
			<div className="bg-white p-4 rounded shadow">Event Form Placeholder</div>
		</div>
	)
}
