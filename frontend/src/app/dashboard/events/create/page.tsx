"use client"
import { calculateOffset, useIsMobile } from "@/lib/utils"
import { Sheet, SheetRef } from "react-modal-sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { X } from "lucide-react"
import { EventForm } from "@/components/EventForm"
import { useMemo, useRef, useState } from "react"
import { useMap } from "react-map-gl/maplibre"

const SNAP_POINTS = [-40, 650, 90]


// TODO: Remove image?
// TODO: Create event form
// TODO: Choose point or area on the map
export default function CreateEventPage() {
	const sheetRef = useRef<SheetRef>(null)
	const [snapIndex, setSnapIndex] = useState(1)
	const map = useMap()
	const isMobile = useIsMobile()


	const handleClose = () => {
		const sheet = sheetRef.current
		if (sheet) {
			sheet.snapTo(2)
		}
	}

	const handleSnap = (index: number) => {
		setSnapIndex(index)
	}


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
								<h1 className="text-2xl">Create Event</h1>
								<Button
									className="bg-neutral-90 hover:bg-neutral-80 text-neutral-0 ml-4"
									size="icon"
									asChild
								>
									<Link href={".."}>
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
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<h1 className="text-2xl font-bold mb-4">Create Event</h1>
			<div className="bg-white p-4 rounded shadow">
				Event Form Placeholder
			</div>
		</div>
	)
}
