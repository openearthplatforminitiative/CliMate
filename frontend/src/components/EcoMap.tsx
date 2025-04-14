"use client"
import { Map, MapProvider } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapLayers } from "./MapLayers"
import { MapUi } from "./MapUi"
import { useState } from "react"
import { IssueWithImage } from "@/types/issue"
import { mapStyle } from "@/utils/mapStyle"

export const EcoMap = () => {
	const [clickedPoint, setClickedPoint] = useState<[number, number] | null>(
		null
	)

	const [sheetAddOpen, setSheetAddOpen] = useState(false)
	const [sheetViewOpen, setSheetViewOpen] = useState(false)
	const [selectedIssue, setSelectedIssue] = useState<IssueWithImage | null>(
		null
	)

	const [mapLoaded, setMapLoaded] = useState(false)

	const handleMapLoad = () => {
		setMapLoaded(true)
	}

	return (
		<div className="fixed inset-0">
			<MapProvider>
				<Map
					initialViewState={{
						longitude: 10.752245,
						latitude: 59.913868,
						zoom: 8,
					}}
					style={{ width: "100%", height: "100%" }}
					mapStyle={mapStyle}
					attributionControl={false}
					id="ecoMap"
					onLoad={handleMapLoad}
				>
					<MapLayers
						clickedPoint={clickedPoint}
						setClickedPoint={setClickedPoint}
						setSheetAddOpen={setSheetAddOpen}
						setSheetViewOpen={setSheetViewOpen}
						setSelectedExample={setSelectedIssue}
					/>
				</Map>
				{mapLoaded ? (
					<MapUi
						sheetAddOpen={sheetAddOpen}
						setSheetAddOpen={setSheetAddOpen}
						sheetViewOpen={sheetViewOpen}
						setSheetViewOpen={setSheetViewOpen}
						selectedIssue={selectedIssue}
						setSelectedIssue={setSelectedIssue}
						setClickedPoint={setClickedPoint}
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center bg-white">
						<p className="text-gray-500">Loading map...</p>
					</div>
				)}
			</MapProvider>
		</div>
	)
}
