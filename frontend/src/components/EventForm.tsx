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
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { createEventCoordinatesAtom, showMapAtom } from "@/atoms/eventAtoms"
import { useAtom, useAtomValue } from "jotai"
import { Map } from "react-map-gl/maplibre"
import { CreateEventLayer } from "@/components/map/create-event-layer"
import { GeocoderClient } from "openepi-client"
import { useRouter } from "next/navigation"

export const EventForm = () => {
	const { data: session } = useSession()
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const [showMap, setShowMap] = useAtom(showMapAtom)
	const createEventCoordinates = useAtomValue(createEventCoordinatesAtom)
	const [locationString, setLocationString] = useState<string>("")
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
		if (createEventCoordinates) {
			setEvent((prev) => ({
				...prev,
				location: {
					type: "Point",
					coordinates: [createEventCoordinates.lng, createEventCoordinates.lat],
				},
			}))
		}
		setShowMap(false)
	}, [createEventCoordinates, setShowMap])

	// Fetches the location string based on coordinates
	useEffect(() => {
		if (createEventCoordinates) {
			const client = new GeocoderClient()
			client
				.getReverseGeocoding({
					lon: createEventCoordinates.lng,
					lat: createEventCoordinates.lat,
				})
				.then((result) => {
					const { data, error } = result

					if (error) {
						console.error(error)
					} else {
						if (data.features && data.features[0]) {
							const locationProperties = data.features[0].properties
							setLocationString(
								`${locationProperties.city}, ${locationProperties.country}`
							)
						}
					}
				})
		}
	}, [createEventCoordinates])

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

	const handleCreateLocation = () => {
		setShowMap(true)
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
				location: event.location,
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
	if (showMap) {
		return (
			<div>
				<Map
					initialViewState={{
						longitude: 0,
						latitude: 0,
						zoom: 0,
					}}
					style={{
						position: "absolute",
						transition: "linear",
						inset: 0,
						width: "100%",
						height: "100%",
					}}
					mapStyle="https://tiles.openfreemap.org/styles/liberty"
					attributionControl={false}
					id="placeMap"
				>
					<CreateEventLayer />
				</Map>
			</div>
		)
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
						className="mt-1 data-[empty=true]:text-muted-foreground w-full justify-start text-left"
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
						className="mt-1data-[empty=true]:text-muted-foreground w-full justify-start text-left"
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
			<Button onClick={() => handleCreateLocation()} className="mt-1 w-full">
				{createEventCoordinates ? "Change Location" : "Set Location"}
			</Button>
			{createEventCoordinates && locationString.length !== 0 && (
				<div>Current location set to: {locationString}</div>
			)}

			{/*TODO: bruk geocoding apiet til å si hvor vi har satt marker?*/}
			{/*bytt knapp til å si "bytt lokasjon" istedet*/}

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
