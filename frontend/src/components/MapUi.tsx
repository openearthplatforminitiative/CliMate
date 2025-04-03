import { IssueWithImage } from "@/types/issue"
import { Form } from "./Form"
import { MenuButton } from "./MenuButton"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "./ui/sheet"
import { CardSlider } from "./CardSlider"

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
			<MenuButton className="absolute bg-primary-20 text-[#DFF7E3]" />

			<div className="absolute bottom-7 left-0 right-0 z-10 flex flex-col gap-4">
				<CardSlider />
			</div>
			<Sheet open={sheetAddOpen} onOpenChange={handleCloseSheet}>
				<SheetContent side="bottom" className="bg-secondary-99">
					<SheetHeader>
						<SheetTitle>Create Report</SheetTitle>
						<SheetDescription>
							<Form
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
								<img
									src={selectedIssue?.image}
									alt={selectedIssue?.title}
									className="mt-5"
								/>
							</div>
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</>
	)
}
