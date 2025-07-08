"use client";

import { IssueGrid } from "@/components/IssueGrid";
import { IssueSlider } from "@/components/IssueSlider";
import { useIsMobile } from "@/lib/utils";
import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";

const SNAP_POINTS = [-40, 700, 400, 90];

export default function MapPage() {
	const sheetRef = useRef<SheetRef>(null);

	const isMobile = useIsMobile();

	const handleClose = () => {
		const sheet = sheetRef.current
		if (sheet) {
			sheet.snapTo(2)
		}
	}

	if (isMobile) {
		return (
			<Sheet ref={sheetRef} isOpen={true} onClose={handleClose} snapPoints={SNAP_POINTS} initialSnap={2} className="z-40">
				<Sheet.Container className="rounded-t-4xl bg-primary-99">
					<Sheet.Header />
					<Sheet.Content>
						<Sheet.Scroller>
							<h2 className="text-2xl px-4 py-2">Recent Reports</h2>
							<IssueSlider />
							<h2 className="text-2xl px-4 mt-4 mb-2">Events</h2>
							<IssueSlider />
						</Sheet.Scroller>
					</Sheet.Content>
				</Sheet.Container>
			</Sheet>
		);
	}
	return (
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<h1 className="text-2xl text-neutral-100 mb-4">Recent Reports</h1>
			<IssueGrid />
		</div>
	)
}