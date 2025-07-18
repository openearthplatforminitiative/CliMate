"use client"
import { CliMateEvent } from "@/types/event"
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"

interface EventsContextProps {
	events: CliMateEvent[]
	setEvents: React.Dispatch<React.SetStateAction<CliMateEvent[]>>
	loading: boolean
	error: Error | null
}

const EventContext = createContext<EventsContextProps | undefined>(undefined)

export const EventsProvider = ({ children }: { children: ReactNode }) => {
	const [events, setEvents] = useState<CliMateEvent[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const retrievedEvents = await fetch("/api/event")
				console.log("retrievedEvents", retrievedEvents)
				const { data, error } = await retrievedEvents.json()
				console.log("data", data)
				if (error) throw error
				setEvents(data)
			} catch (err) {
				setError(err as Error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<EventContext.Provider value={{ events, setEvents, loading, error }}>
			{children}
		</EventContext.Provider>
	)
}

export const useEvents = () => {
	const context = useContext(EventContext)
	if (!context) {
		throw new Error("useEvents must be used within a EventsProvider")
	}
	return context
}
