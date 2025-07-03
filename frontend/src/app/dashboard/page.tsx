"use client";

import { IssueGrid } from "@/components/IssueGrid";
import { IssueSlider } from "@/components/IssueSlider";
import { useIsMobile } from "@/lib/utils";
import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

export default function MapPage() {
	const isMobile = useIsMobile();
	const map = useMap();

	useEffect(() => {
		const mapRef = map.ecoMap;
		if (!mapRef) return;
		mapRef.flyTo({
			center: [0, 0],
			zoom: 0,
			duration: 1000,
		});
	}, [map])

	if (isMobile) {
		return (
			<div className="absolute bottom-7 left-0 right-0 z-10 flex flex-col gap-4">
				<IssueSlider />
			</div>
		);
	}
	return (
		<div className="bg-primary-20 h-full px-10 py-5 w-full">
			<IssueGrid />
		</div>
	)
}