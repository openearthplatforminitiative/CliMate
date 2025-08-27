"use client"

import { Button } from "@/components/ui/button"
import { calculateOffset, useIsMobile } from "@/lib/utils"
import { notFound } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { useMap } from "react-map-gl/maplibre"
import Link from "next/link"
import { ArrowRight, ChevronLeft, X } from "lucide-react"
import { Sheet, SheetRef } from "react-modal-sheet"
import { CliMateEvent } from "@/types/event"
import { center } from "@turf/center"

const SNAP_POINTS = [-40, 400, 90]

export const EventComponent = ({ event }: { event: CliMateEvent }) => {
	if (event === undefined || event === null) notFound()

	const sheetRef = useRef<SheetRef>(null)
	const [snapIndex, setSnapIndex] = useState(1)

	const isMobile = useIsMobile()
	const map = useMap()

	const handleSnap = (index: number) => {
		setSnapIndex(index)
	}

	const offsetY = useMemo(() => {
		return calculateOffset(isMobile, snapIndex, SNAP_POINTS)
	}, [isMobile, snapIndex])

	useEffect(() => {
		const mapRef = map.ecoMap
		if (!event || !mapRef) return
		console.log(event)
		const eventCenter = center(event.location).geometry.coordinates
		mapRef.flyTo({
			center: [eventCenter[0], eventCenter[1]],
			zoom: 12,
			offset: [
				0,
				isMobile && snapIndex != SNAP_POINTS.length - 1 ? offsetY : 0,
			],
			duration: 1000,
		})
	}, [isMobile, event, map.ecoMap, offsetY, snapIndex])

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
				onSnap={handleSnap}
				snapPoints={SNAP_POINTS}
				initialSnap={1}
				className="z-40"
			>
				<Sheet.Container className="rounded-t-4xl bg-primary-99">
					<Sheet.Header />
					<Sheet.Content>
						<div className="flex flex-col h-full px-4">
							<div className="flex justify-between mb-4">
								<h1 className="text-2xl">{event.name}</h1>
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
							<Image
								src={
									event.image_url
										? `${event.image_url}`
										: "/image-placeholder.png"
								}
								width={200}
								height={100}
								className="aspect-video w-full object-cover"
								alt="Picture of issue"
							/>
							{event.start_date && (
								<div className="relative flex self-center -top-5 bg-secondary-95 rounded-xl text-primary-30">
									<div className="flex flex-col size-16 items-center justify-center p-2">
										<span className="text-3xl">
											{new Date(event.start_date).getDate()}
										</span>
										<span className="text-xs">
											{new Date(event.start_date).toLocaleString("en-US", {
												month: "short",
											})}
										</span>
									</div>
									{event.end_date && (
										<>
											<div className="h-full flex justify-center items-center px-2">
												<ArrowRight />
											</div>
											<div className="flex flex-col size-16 items-center justify-center p-2">
												<span className="text-3xl">
													{new Date(event.end_date).getDate()}
												</span>
												<span className="text-xs">
													{new Date(event.end_date).toLocaleString("en-US", {
														month: "short",
													})}
												</span>
											</div>
										</>
									)}
								</div>
							)}
							<div className="flex flex-col gap-4 mt-4 h-full">
								<p>{event.description}</p>
							</div>
						</div>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="flex flex-col bg-primary-99 h-full w-full">
			<div className="relative">
				<Button asChild>
					<Link href={"/dashboard/events"} className="absolute left-2 top-2">
						<ChevronLeft />
					</Link>
				</Button>
				<Image
					src={
						event.image_url ? `${event.image_url}` : "/image-placeholder.png"
					}
					width={200}
					height={100}
					className="aspect-video w-full object-cover"
					alt="Picture of issue"
				/>
			</div>
			<div className="relative flex self-center -top-5 bg-secondary-95 rounded-xl text-primary-30">
				<div className="flex flex-col size-16 items-center justify-center p-2">
					<span className="text-3xl">
						{new Date(event.start_date).getDate()}
					</span>
					<span className="text-xs">
						{new Date(event.start_date).toLocaleString("en-US", {
							month: "short",
						})}
					</span>
				</div>
				{event.end_date && (
					<>
						<div className="h-full flex justify-center items-center px-2">
							<ArrowRight />
						</div>
						<div className="flex flex-col size-16 items-center justify-center p-2">
							<span className="text-3xl">
								{new Date(event.end_date).getDate()}
							</span>
							<span className="text-xs">
								{new Date(event.end_date).toLocaleString("en-US", {
									month: "short",
								})}
							</span>
						</div>
					</>
				)}
			</div>
			<div className="flex flex-col gap-4 p-4 h-full">
				<h1 className="text-3xl">{event.name}</h1>
				{event.start_date && (
					<div className="absolute flex flex-col size-16 items-center justify-center p-2 bg-secondary-95 rounded-xl text-primary-30 -bottom-2 right-2">
						<span className="text-3xl">
							{new Date(event.start_date).getDate()}
						</span>
						<span className="text-xs">
							{new Date(event.start_date).toLocaleString("en-US", {
								month: "short",
							})}
						</span>
					</div>
				)}
				<p>{event.description}</p>
			</div>
		</div>
	)
}
