"use client"

import { calculateOffset, useIsMobile } from "@/lib/utils"
import { Sheet, SheetRef } from "react-modal-sheet"
import { Button } from "@/components/ui/button"
import { EventForm } from "@/components/EventForm"
import { useEffect, useMemo, useRef, useState } from "react"
import { useMap } from "react-map-gl/maplibre"
import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"
import { createIssueCoordinatesAtom } from "@/atoms/issueAtoms"
import { useAtom } from "jotai"
import { signIn, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

const SNAP_POINTS = [-40, 650, 90]

export default function CreateEventPage() {
	const sheetRef = useRef<SheetRef>(null)
	const [snapIndex, setSnapIndex] = useState(1)

	const [coordinates, setCoordinates] = useAtom(createIssueCoordinatesAtom)
	const map = useMap()
	const isMobile = useIsMobile()
	const { data: session } = useSession()
	const currentRoute = usePathname()

	useEffect(() => {
		if (session?.error === "RefreshAccessTokenError") {
			signIn("keycloak")
		}
	}, [session, currentRoute])

	const handleClose = () => {
		const sheet = sheetRef.current
		if (sheet) {
			sheet.snapTo(2)
		}
	}

	const offsetY = useMemo(() => {
		return calculateOffset(isMobile, snapIndex, SNAP_POINTS)
	}, [isMobile, snapIndex])

	const handleSnap = (index: number) => {
		setSnapIndex(index)
	}

	useEffect(() => {
		const mapRef = map.ecoMap
		if (!mapRef) return

		if (!coordinates) {
			const centerLngLat = mapRef.getCenter()
			setCoordinates({
				lng: centerLngLat.lng,
				lat: centerLngLat.lat,
			})
		} else {
			mapRef.flyTo({
				center: [coordinates.lng, coordinates.lat],
				offset: [
					0,
					isMobile && snapIndex != SNAP_POINTS.length - 1 ? offsetY : 0,
				],
				duration: 1000,
			})
		}
	}, [coordinates, isMobile, map, offsetY, setCoordinates, snapIndex])

	if (isMobile) {
		return (
			<Sheet
				ref={sheetRef}
				isOpen={true}
				onClose={handleClose}
				onSnap={handleSnap}
				snapPoints={SNAP_POINTS}
				initialSnap={1}
				className="z-40"
			>
				<Sheet.Container className="rounded-t-4xl bg-primary-99">
					<Sheet.Header />
					<Sheet.Content>
						<div className="p-4">
							<div className="flex justify-between mb-4">
								<h1 className="text-2xl">Create Report</h1>
								<Button
									className="bg-neutral-90 hover:bg-neutral-80 text-neutral-0 ml-4"
									size="icon"
									asChild
								>
									<Link href={"/dashboard/events"}>
										<X />
									</Link>
								</Button>
							</div>
							<EventForm />
						</div>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="bg-primary-100 h-full p-4 w-full">
			<div className="grid grid-cols-[1fr_auto_1fr] items-center">
				<Button
					className="flex-2 bg-neutral-90 hover:bg-neutral-80 text-neutral-0"
					size="icon"
					asChild
				>
					<Link href={"/dashboard/events"}>
						<ChevronLeft />
					</Link>
				</Button>
				<h1 className="text-center text-2xl">Create Event</h1>
			</div>
			<EventForm />
		</div>
	)
}
