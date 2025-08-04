"use client"

import { IssueGrid } from "@/components/IssueGrid"
import { IssueSlider } from "@/components/IssueSlider"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Sheet, SheetRef } from "react-modal-sheet"
import { getIssuesInBounds } from "./action"
import { useMap } from "react-map-gl/maplibre"
import { Issue } from "@/types/issue"

const SNAP_POINTS = [-40, 700, 400, 90]

export default function MapPage() {
	const sheetRef = useRef<SheetRef>(null)
	const [issuesInBounds, setIssuesInBounds] = useState<Issue[]>([])

	const isMobile = useIsMobile()

	const map = useMap()

	useEffect(() => {
		const mapRef = map.ecoMap
		const fetchIssues = async () => {
			const mapBounds = mapRef?.getBounds()
			if (!mapBounds) {
				setIssuesInBounds([])
				return
			}

			// Extract bounds coordinates on client side
			const bounds = {
				minLat: mapBounds._sw.lat,
				minLng: mapBounds._sw.lng,
				maxLat: mapBounds._ne.lat,
				maxLng: mapBounds._ne.lng
			}

			try {
				const issues = await getIssuesInBounds(bounds)
				setIssuesInBounds(issues)
			} catch (error) {
				console.error("Failed to fetch issues:", error)
				setIssuesInBounds([])
			}
		}

		fetchIssues()

		mapRef?.on("moveend", fetchIssues)
		return () => {
			mapRef?.off("moveend", fetchIssues)
		}
	}, [map.ecoMap])

	const handleClose = () => {
		const sheet = sheetRef.current
		if (sheet) {
			sheet.snapTo(2)
		}
	}

	if (isMobile) {
		return (
			<Sheet
				ref={sheetRef}
				isOpen={true}
				onClose={handleClose}
				snapPoints={SNAP_POINTS}
				initialSnap={2}
				className="z-40"
			>
				<Sheet.Container className="rounded-t-4xl bg-primary-99">
					<Button asChild className="bg-primary-20">
						<Link
							href="/dashboard/issues/create"
							className="absolute -top-12 right-4 z-50"
						>
							Add Report
						</Link>
					</Button>
					<Sheet.Header />
					<Sheet.Content>
						<Sheet.Scroller>
							<h2 className="text-2xl px-4 py-2">Recent Reports</h2>
							<IssueSlider issues={issuesInBounds} />
							<h2 className="text-2xl px-4 mt-4 mb-2">Events</h2>
							<IssueSlider issues={issuesInBounds} />
						</Sheet.Scroller>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<h1 className="text-2xl text-neutral-100 mb-4">Recent Reports</h1>
			<IssueGrid issues={issuesInBounds} />
		</div>
	)
}
