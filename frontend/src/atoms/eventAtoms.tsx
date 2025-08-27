import { atom } from "jotai"

export const showMapAtom = atom<boolean>(false)

export const createEventCoordinatesAtom = atom<{
	lat: number
	lng: number
} | null>(null)
