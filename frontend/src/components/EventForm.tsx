"use client"


import { ChangeEvent, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export const EventForm = () => {
	const [file, setFile] = useState<File | null>(null)
	const { data: session } = useSession()
	const router = useRouter()
	const [date, setDate] = useState<Date>()

	const [event, setEvent] = useState({
		title: "",
		description: "",
		location: {
			type: "Point",
			coordinates: [0, 0]
		},
		start_date: new Date(),
	})

	// TODO: update point and polygon continually with useEffect


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

	}

	return (
		<div>
			<Input
				id="title"
				type="text"
				placeholder="Title"
				value={event.title}
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

			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						data-empty={!date}
						className="bg-primary-98 data-[empty=true]:text-muted-foreground w-full mt-5 justify-start text-left"
					>
						<CalendarIcon />
						{date ? format(date, "PPP") : <span>Pick a start date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={date} onSelect={setDate} />
				</PopoverContent>
			</Popover>
			<Label className="mt-5">
				Start time
			</Label>
			<Input
				type="time"
				id="time-picker"
				step="1"
				defaultValue="10:30:00"
				className="bg-primary-98 data-[empty=true]:text-muted-foreground appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
			/>




			<Button
				onClick={handleUpload}
				disabled={!event.title  || !event.description}
				className="w-full mt-5 mb-10 bg-primary-20"
			>
				Submit report
			</Button>
		</div>
	)
}