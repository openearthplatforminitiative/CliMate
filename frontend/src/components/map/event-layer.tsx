import { Layer } from "react-map-gl/maplibre"

export function EventLayer() {
	return (
		<>
			<Layer
				id="events-layer"
				type="circle"
				source="event"
				paint={{
					"circle-color": "#DFF7E3",
					"circle-radius": 20,
				}}
			/>
			<Layer
				id="events-date-layer"
				type="symbol"
				source="event"
				layout={{
					"text-field": ["get", "date"],
					"text-font": ["Noto Sans Regular"],
					"text-size": 16,
					"text-anchor": "bottom",
					"text-offset": [0, 0.3],
					"text-allow-overlap": true,
					"text-ignore-placement": true,
				}}
				paint={{
					"text-color": "#005230",
				}}
			/>
			<Layer
				id="events-month-layer"
				type="symbol"
				source="event"
				layout={{
					"text-field": ["get", "month"],
					"text-font": ["Noto Sans Regular"],
					"text-size": 9,
					"text-offset": [0, 0.3],
					"text-anchor": "top",
					"text-allow-overlap": true,
					"text-ignore-placement": true,
				}}
				paint={{
					"text-color": "#005230",
				}}
			/>
		</>
	)
}
