import { clsx, type ClassValue } from "clsx"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

const MOBILE_BREAKPOINT = 1024

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
		}
		mql.addEventListener("change", onChange)
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
		return () => mql.removeEventListener("change", onChange)
	}, [])

	return !!isMobile
}

export function calculateOffset(
	isMobile: boolean,
	snapIndex: number,
	snapPoints: number[]
): number {
	if (!isMobile || snapIndex === snapPoints.length - 1) return 0
	const snap = snapPoints[1] ?? 0
	return -snap / 2
}
