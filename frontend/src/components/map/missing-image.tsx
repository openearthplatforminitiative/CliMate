"use client"

import { Category } from "@/types/issue"
import { MapLibreEvent } from "maplibre-gl"
import { useEffect } from "react"
import { useMap } from "react-map-gl/maplibre"

const iconNames: { [K in Category]: string } = {
	deforestation: "tree-solid",
	garbage: "trash-solid",
	chemicals: "flask-solid",
	vandalism: "", //TODO
	other: "question-circle-solid",
}

export function MissingImage() {
	const map = useMap()

	const getIconById = (id: Category) => {
		return iconNames[id] || undefined
	}

	useEffect(() => {
		if (!map.current) return
		const mapInstance = map.current.getMap()

		// Handler for missing images
		const handleMissingImage = async (
			e: MapLibreEvent<unknown> & {
				type: "styleimagemissing"
				id: string
			} & object
		) => {
			const id = e.id
			if (!id) return
			if (mapInstance.hasImage(id)) return
			const icon = getIconById(id as Category)
			if (!icon) return

			const image = await mapInstance.loadImage(`/icons/${icon}.png`)
			if (!image) return
			mapInstance.addImage(id, image.data)
		}

		mapInstance.on("styleimagemissing", handleMissingImage)
		return () => {
			mapInstance.off("styleimagemissing", handleMissingImage)
		}
	}, [map])

	return null
}
