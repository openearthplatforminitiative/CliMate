"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { useAtomValue } from "jotai"
import { GeocoderClient } from "openepi-client"
import { useRouter } from "next/navigation"
import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms"

export const EventForm = () => {
	const { data: session } = useSession()
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const coordinates = useAtomValue(createIssueCoordinatesAtom)
	const [locationString, setLocationString] = useState<string>("Unknown")
	const router = useRouter()

	const [event, setEvent] = useState({
		name: "",
		description: "",
		location: {
			type: "Point",
			coordinates: [0, 0],
		},
		start_date: new Date(),
	})

	// Sets coordinates on the state when user sets location
	useEffect(() => {
		if (coordinates) {
			setEvent((prev) => ({
				...prev,
				location: {
					type: "Point",
					coordinates: [coordinates.lng, coordinates.lat],
				},
			}))
		}
	}, [coordinates])

	// Fetches the location string based on coordinates
	useEffect(() => {
		if (coordinates) {
			const client = new GeocoderClient()
			client
				.getReverseGeocoding({
					lon: coordinates.lng,
					lat: coordinates.lat,
				})
				.then((result) => {
					const { data, error } = result

					if (error) {
						console.error(error)
					} else {
						if (data.features && data.features[0]) {
							const locationProperties = data.features[0].properties
							return setLocationString(
								`${locationProperties.city}, ${locationProperties.country}`
							)
						}
					}
					setLocationString("Unknown")
				})
		}
	}, [coordinates])

	// Set state when use writes
	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target
		setEvent((prev) => ({
			...prev,
			[id]: value,
		}))
	}

	const handleUpload = async () => {
		try {
			const startDateString = startDate?.toISOString().split("T")[0] // Extract only the date
			const endDateString = endDate?.toISOString().split("T")[0] //

			const postData = {
				name: event.name,
				description: event.description,
				location: event.location,
				start_date: startDateString,
				user_uuid: session?.user?.id || "",
				end_date: endDateString,
			}

			console.log("postData", postData)
			const response = await fetch("/api/event", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(postData),
			})

			if (!response.ok) {
				throw new Error("Failed to create event")
			}

			const data = await response.json()
			console.log("Successfully created event", data)
			router.push("/dashboard")
		} catch (error) {
			console.error("Error creating event:", error)
			// Handle UI to display error
		}
	}

	if (!session) {
		return <div>You have to be logged in to create an event.</div>
	}
	return (
		<div>
			<Input
				id="name"
				type="text"
				placeholder="Name of the event"
				value={event.name}
				onChange={handleInputChange}
				className="mt-5"
			/>
			<Textarea
				id="description"
				placeholder="Description"
				value={event.description}
				onChange={handleInputChange}
				className="mt-5"
				rows={3}
			/>

			<Label className="mt-5">Start date</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						data-empty={!startDate}
						className="mt-1 data-[empty=true]:text-muted-foreground w-full justify-start text-left bg-transparent"
					>
						<CalendarIcon />
						{startDate && format(startDate, "PPP")}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={startDate}
						onSelect={setStartDate}
					/>
				</PopoverContent>
			</Popover>

			<Label className="mt-5">End date</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						data-empty={!endDate}
						className="mt-1 data-[empty=true]:text-muted-foreground w-full justify-start text-left bg-transparent"
					>
						<CalendarIcon />
						{endDate && format(endDate, "PPP")}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={endDate} onSelect={setEndDate} />
				</PopoverContent>
			</Popover>

			<Label className="mt-5">Location</Label>

			<div className="flex items-center gap-2 mt-2">
				<MapPin />
				<div className="flex flex-col">
					Current location set to: {locationString}
					<div className="text-sm text-muted-foreground">
						Drag the pin on the map to change the location
					</div>
				</div>
			</div>

			<Button
				onClick={handleUpload}
				disabled={!event.name || !event.description || !startDate}
				className="w-full mt-10 mb-10 bg-primary-20"
			>
				Create Event
			</Button>
		</div>
	)
}
