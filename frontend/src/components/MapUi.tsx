import { IssueWithImage } from "@/types/issue"
import { IssueForm } from "./IssueForm"
import { MenuButton } from "./MenuButton"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "./ui/sheet"
import { CardSlider } from "./CardSlider"
import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

interface MapUiProps {
	sheetAddOpen: boolean
	setSheetAddOpen: (open: boolean) => void
	sheetViewOpen: boolean
	setSheetViewOpen: (open: boolean) => void
	selectedIssue: IssueWithImage | null
	setSelectedIssue: (example: IssueWithImage | null) => void
	setClickedPoint: (point: [number, number] | null) => void
}

export const MapUi = ({
	sheetAddOpen,
	setSheetAddOpen,
	sheetViewOpen,
	setSheetViewOpen,
	selectedIssue,
	setSelectedIssue,
	setClickedPoint,
}: MapUiProps) => {
	const handleCloseSheet = () => {
		setSelectedIssue(null)
		setSheetAddOpen(false)
		setSheetViewOpen(false)
	}

	return (
		<>
			<MenuButton className="absolute bg-primary-20 hover:bg-primary-10 text-[#DFF7E3]" />

			<div className="absolute bottom-7 left-0 right-0 z-10 flex flex-col gap-4">
				<CardSlider />
			</div>
			<Sheet open={sheetAddOpen} onOpenChange={handleCloseSheet}>
				<SheetContent side="bottom" className="bg-secondary-99">
					<SheetHeader>
						<SheetTitle>Create Report</SheetTitle>
						<SheetDescription>
							<IssueForm
								setSheetAddOpen={setSheetAddOpen}
								setClickedPoint={setClickedPoint}
							/>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>

			<Sheet open={sheetViewOpen} onOpenChange={handleCloseSheet}>
				<SheetContent side="bottom" className="bg-secondary-99">
					<SheetHeader>
						<SheetTitle>{selectedIssue?.title}</SheetTitle>
						<SheetDescription>
							<div>
								<p>{selectedIssue?.description}</p>
								{selectedIssue && (
									<Image
										src={selectedIssue.image}
										alt={selectedIssue.title}
										className="mt-5"
									/>
								)}
							</div>
							<Link href={`/issues/${selectedIssue?.id}`}>
								<Button className="bg-primary-20">View Issue</Button>
							</Link>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</>
	)
}
