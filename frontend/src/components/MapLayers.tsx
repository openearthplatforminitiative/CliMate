import { useCoordinates } from "@/lib/CoordinatesContext"
import { Category, Issue } from "@/types/issue"
import RoomIcon from "@mui/icons-material/Room"
import { useMap, Marker, Source, Layer } from "@vis.gl/react-maplibre"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { MapMouseEvent } from "maplibre-gl"
import { useIssues } from "@/lib/IssuesContext"

interface MapLayersProps {
	clickedPoint: [number, number] | null
	setClickedPoint: (point: [number, number] | null) => void
	setSheetAddOpen: (open: boolean) => void
	setSheetViewOpen: (open: boolean) => void
	setSelectedExample: (example: Issue | null) => void
}

const iconNames: { [K in Category]: string } = {
	deforestation: "tree-solid",
	garbage: "trash-solid",
	chemicals: "flask-solid",
	vandalism: "", //TODO
	other: "question-circle-solid",
}

export const MapLayers = ({
	clickedPoint,
	setClickedPoint,
	setSheetAddOpen,
	setSheetViewOpen,
	setSelectedExample,
}: MapLayersProps) => {
	const { setCoordinates } = useCoordinates()
	const [userLocation, setUserLocation] = useState<[number, number] | null>(
		null
	)
	const map = useMap()
	const { issues } = useIssues()
	const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>({
		type: "FeatureCollection",
		features: [],
	})

	useEffect(() => {
		const handleMapClick = (event: MapMouseEvent) => {
			// Check if the click is on the "issues-layer"
			const clickedFeatures = map.current?.queryRenderedFeatures(event.point, {
				layers: ["issues-labels"],
			})

			if (clickedFeatures && clickedFeatures.length > 0) {
				// Handle feature click
				const clickedFeature = clickedFeatures[0]
				const { id, title, description, image_url, category, resolved } =
					clickedFeature.properties

				if (clickedFeature.geometry.type === "Point") {
					setSelectedExample({
						id,
						title,
						description,
						image_url,
						category,
						resolved,
						location: {
							type: "Point",
							coordinates: clickedFeature.geometry.coordinates,
						},
					})
				}
				setSheetViewOpen(true) // Open the sheet with the selected issue
			} else {
				// If no features are clicked, set the "Add Report" marker
				const { lng, lat } = event.lngLat
				setClickedPoint([lng, lat])
			}
		}

		// Attach the click event listener to the map
		map.current?.on("click", handleMapClick)

		return () => {
			// Clean up the event listener when the component unmounts
			map.current?.off("click", handleMapClick)
		}
	}, [map, setClickedPoint, setSelectedExample, setSheetViewOpen])

	// Set create FeatureCollection of issues
	useEffect(() => {
		setGeoJsonData({
			type: "FeatureCollection",
			features: issues.map((issue) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: issue.location.coordinates,
				},
				properties: {
					id: issue.id,
					title: issue.title,
					category: issue.category,
					description: issue.description,
					image: issue.image_url,
				},
			})),
		})
	}, [issues])

	// Get location of user and go there if allowed
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { latitude, longitude } = position.coords
				setUserLocation([longitude, latitude])
				if (map.current) {
					map.current.getMap().flyTo({
						center: [longitude, latitude],
						zoom: 12,
					})
				}
			})
		}
	}, [])

	const handleAddReport = () => {
		if (clickedPoint) {
			setCoordinates(clickedPoint)
			setSheetAddOpen(true)

			// Make the map center on the clicked place.
			// Centers with an offset such that the pointer is on the top half of the screen.
			if (map.current) {
				const height = map.current.getContainer().clientHeight
				map.current.flyTo({
					center: clickedPoint,
					offset: [0, -height / 5],
				})
			}
		}
	}

	const getIconById = (id: Category): string => {
		return iconNames[id] || iconNames.other
	}

	// Add icons
	useEffect(() => {
		if (!map.current) return
		const mapInstance = map.current.getMap()

		// Handler for missing images
		const handleMissingImage = async (e: any) => {
			const id = e.id as string | undefined
			if (id === undefined) {
				return
			}

			const image = await mapInstance.loadImage(
				`/icons/${getIconById(id as Category)}.png`
			)
			mapInstance.addImage(id, image.data)
		}

		// Add event listener for missing images
		mapInstance.on("styleimagemissing", handleMissingImage)

		return () => {
			// Clean up
			mapInstance.off("styleimagemissing", handleMissingImage)
			Object.keys(iconNames).forEach((key) => {
				if (mapInstance.hasImage(key)) {
					mapInstance.removeImage(key)
				}
			})
		}
	}, [map])

	return (
		<>
			{userLocation && (
				<Marker longitude={userLocation[0]} latitude={userLocation[1]}>
					<div className="w-4 h-4 bg-tertiary-60 rounded-full border-2 border-white"></div>
				</Marker>
			)}
			{clickedPoint && (
				<Marker
					longitude={clickedPoint[0]}
					latitude={clickedPoint[1]}
					anchor="bottom"
				>
					<div className="flex flex-col items-center gap-2">
						<Button
							size="sm"
							className="bg-primary-20 whitespace-nowrap"
							onClick={(e) => {
								e.stopPropagation()
								handleAddReport()
							}}
						>
							Add Report Here
						</Button>
						<RoomIcon />
					</div>
				</Marker>
			)}
			<Source
				id="issues"
				type="geojson"
				data={geoJsonData}
				generateId
				cluster={true}
				clusterMaxZoom={15}
				clusterRadius={20}
			>
				<Layer
					id="clusters"
					type="circle"
					filter={["has", "point_count"]}
					paint={{
						"circle-color": [
							"step",
							["get", "point_count"],
							"#51bbd6", // 0-4 points
							5,
							"#f1f075", // 5-9 points
							10,
							"#f28cb1", // 10+ points
						],
						"circle-radius": [
							"step",
							["get", "point_count"],
							20, // Default radius
							5,
							30, // 5+ points radius
							10,
							40, // 10+ points radius
						],
					}}
				/>

				<Layer
					id="cluster-count"
					type="symbol"
					filter={["has", "point_count"]}
					layout={{
						"text-field": "{point_count_abbreviated}",
						"text-font": ["Noto Sans Italic"],
						"text-size": 12,
					}}
					paint={{
						"text-color": "#ffffff",
					}}
				/>

				<Layer
					id="issues-labels"
					type="symbol"
					filter={["!", ["has", "point_count"]]}
					layout={{
						"icon-image": ["get", "category"],
						"icon-size": [
							"interpolate",
							["linear"],
							["zoom"],
							0,
							0,
							12,
							0.25,
							22,
							0.5,
						],
					}}
				/>
			</Source>
		</>
	)
}
