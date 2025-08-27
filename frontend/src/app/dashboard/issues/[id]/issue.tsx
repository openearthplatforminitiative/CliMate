"use client"

import { Button } from "@/components/ui/button"
import { calculateOffset, useIsMobile } from "@/lib/utils"
import { Issue } from "@/types/issue"
import { notFound, useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { useMap } from "react-map-gl/maplibre"
import Link from "next/link"
import { Check, ChevronLeft, X } from "lucide-react"
import { Sheet, SheetRef } from "react-modal-sheet"
import { useSetAtom } from "jotai"
import { currentIssueAtom } from "@/atoms/issueAtoms"

const SNAP_POINTS = [-40, 400, 90]

export const IssueComponent = ({ issue }: { issue: Issue }) => {
	if (issue === undefined || issue === null) notFound()

	const sheetRef = useRef<SheetRef>(null)
	const [snapIndex, setSnapIndex] = useState(1)
	const setCurrentIssue = useSetAtom(currentIssueAtom)

	const isMobile = useIsMobile()
	const map = useMap()
	const router = useRouter()

	const handleSnap = (index: number) => {
		setSnapIndex(index)
	}

	useEffect(() => {
		setCurrentIssue(issue)
	}, [issue, setCurrentIssue])

	const offsetY = useMemo(() => {
		return calculateOffset(isMobile, snapIndex, SNAP_POINTS)
	}, [isMobile, snapIndex])

	useEffect(() => {
		const mapRef = map.ecoMap
		if (!issue || !mapRef) return
		mapRef.flyTo({
			center: [issue.location.coordinates[0], issue.location.coordinates[1]],
			zoom: 12,
			offset: [
				0,
				isMobile && snapIndex != SNAP_POINTS.length - 1 ? offsetY : 0,
			],
			duration: 1000,
		})
	}, [isMobile, issue, map.ecoMap, offsetY, snapIndex])

	const handleClick = async () => {
		try {
			const putData: Issue = {
				...issue,
				active: !issue.active,
			}
			const response = await fetch("/api/issues", {
				method: "PUT",
				body: JSON.stringify(putData),
			})

			if (!response.ok) {
				throw new Error("Failed to upload the issue.")
			}
			toast(`Successfully updated ${issue.title}`)
			router.refresh()
		} catch (error) {
			toast("Could not update issue")
			console.error("Error updating issue:", error)
		}
	}

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
								<h1 className="text-2xl">{issue.title}</h1>
								<Button
									className="bg-neutral-90 hover:bg-neutral-80 text-neutral-0 ml-4"
									size="icon"
									asChild
								>
									<Link href={"/dashboard/issues"}>
										<X />
									</Link>
								</Button>
							</div>
							<Image
								src={
									issue.image_url
										? `${issue.image_url}`
										: "/image-placeholder.png"
								}
								width={200}
								height={100}
								className="aspect-video w-full object-cover"
								alt="Picture of issue"
							/>
							<div className="flex flex-col gap-4 mt-4 h-full">
								<div>Category: {issue.category}</div>
								<div>{issue.description}</div>
								<Button
									className="bg-neutral-100 hover:bg-neutral-90 text-secondary-20 self-start"
									onClick={handleClick}
								>
									<Check />
									Set as {issue.active ? "resolved" : "unresolved"}
								</Button>
							</div>
						</div>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		)
	}
	return (
		<div className="bg-primary-99 h-full w-full">
			<div className="relative">
				<Button asChild>
					<Link href={"/dashboard/issues"} className="absolute left-2 top-2">
						<ChevronLeft />
					</Link>
				</Button>
				<Image
					src={
						issue.image_url ? `${issue.image_url}` : "/image-placeholder.png"
					}
					width={200}
					height={100}
					className="aspect-video w-full object-cover"
					alt="Picture of issue"
				/>
			</div>

			<div className="flex flex-col gap-4 p-4 h-full">
				<h1 className="text-3xl">{issue.title}</h1>
				<div>Category: {issue.category}</div>
				<div>{issue.description}</div>
				<Button
					className="bg-neutral-100 hover:bg-neutral-90 text-secondary-20 self-start"
					onClick={handleClick}
				>
					<Check />
					Set as {issue.active ? "resolved" : "unresolved"}
				</Button>
			</div>
		</div>
	)
}
