import { Layer } from "react-map-gl/maplibre"


export function IssueLayer() {
	return (
		<>
			<Layer
				id="issues-labels"
				type="symbol"
				source="issues"
				filter={["!", ["has", "point_count"]]}
				layout={{
					"icon-image": ["get", "category"],
					"icon-size": [
						"interpolate",
						["linear"],
						["zoom"],
						0,
						0.1,
						12,
						0.25,
						22,
						0.5,
					],
				}}
			/>
		</>
	)
}
