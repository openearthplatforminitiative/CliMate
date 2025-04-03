"use client"
import React, { createContext, useState, useContext, ReactNode } from "react"

type Coordinates = [number, number] | null

interface CoordinatesContextProps {
	coordinates: Coordinates
	setCoordinates: (coords: Coordinates) => void
}

const CoordinatesContext = createContext<CoordinatesContextProps | undefined>(
	undefined
)

export const CoordinatesProvider = ({ children }: { children: ReactNode }) => {
	const [coordinates, setCoordinates] = useState<Coordinates>(null)

	return (
		<CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
			{children}
		</CoordinatesContext.Provider>
	)
}

export const useCoordinates = () => {
	const context = useContext(CoordinatesContext)
	if (!context) {
		throw new Error("useCoordinates must be used within a CoordinatesProvider")
	}
	return context
}
