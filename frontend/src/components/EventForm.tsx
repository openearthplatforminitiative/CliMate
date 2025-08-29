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
import { CalendarIcon, MapPin, User } from "lucide-react"
import { format } from "date-fns"
import { useAtom } from "jotai"
import { GeocoderClient } from "openepi-client"
import { useRouter } from "next/navigation"
import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms"
import Image from "next/image"
import { toast } from "sonner"

export const EventForm = () => {
	const { data: session } = useSession()
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const [coordinates, setCoordinates] = useAtom(createIssueCoordinatesAtom)
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

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)
			setPreview(URL.createObjectURL(selectedFile))
		}
	}

	const handleUpload = async () => {
		try {
			if (!file) {
				throw new Error("Missing image file")
			}

			const startDateString = startDate?.toISOString().split("T")[0]
			const endDateString = endDate?.toISOString().split("T")[0]

			const eventData = {
				name: event.name,
				description: event.description,
				location: event.location,
				start_date: startDateString,
				end_date: endDateString,
				user_uuid: session?.user?.id || "",
				active: false,
			}

			const formData = new FormData()
			formData.append("event", JSON.stringify(eventData))
			formData.append("image", file)

			const response = await fetch("/api/events", {
				method: "POST",
				body: formData,
			})

			if (!response.ok) {
				throw new Error("Could not create the event.")
			}

			toast("Successfully uploaded event")
			router.push("/dashboard/events")
		} catch (error) {
			toast("Could not create event")
			console.error("Error uploading event:", error)
		}
	}

	const handleCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords
					setCoordinates({ lat: latitude, lng: longitude })
				},
				() => {
					toast("Could not get your location")
				}
			)
		}
	}

	if (!session) {
		return <div>You have to be logged in to create an event.</div>
	}
	return (
		<div>
			<Label htmlFor="picture">Choose or take picture</Label>
			<Input
				id="picture"
				type="file"
				onChange={handleFileChange}
				className="mt-2"
			/>
			{file && <p>Selected file: {file.name}</p>}
			{preview && (
				<Image
					width={32}
					height={32}
					src={preview}
					alt="Preview"
					className="w-32 h-32 object-cover mt-2"
				/>
			)}
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

			<div className="flex items-center gap-2 mt-2 mb-4">
				<MapPin />
				<div className="flex flex-col">
					Current location set to: {locationString}
					<div className="text-sm text-muted-foreground">
						Drag the pin on the map to change the location
					</div>
				</div>
			</div>
			<Button variant="outline" onClick={handleCurrentLocation}>
				<User />
				Use current location
			</Button>

			<Button
				onClick={handleUpload}
				disabled={!event.name || !event.description || !startDate || !file}
				className="w-full mt-10 mb-10 bg-primary-20"
			>
				Create Event
			</Button>
		</div>
	)
}
