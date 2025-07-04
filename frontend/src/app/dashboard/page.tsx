"use client";

import { IssueGrid } from "@/components/IssueGrid";
import { IssueSlider } from "@/components/IssueSlider";
import { useIsMobile } from "@/lib/utils";

export default function MapPage() {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<IssueSlider />
		);
	}
	return (
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<IssueGrid />
		</div>
	)
}