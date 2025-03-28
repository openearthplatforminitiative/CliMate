"use client";
import { Map, MapProvider } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapOverlay } from "./MapOverlay";
import { MapUi } from "./MapUi";
import { useState } from "react";
import { IssueWithImage } from "@/types/issue";

export const EcoMap = () => {
  const [clickedPoint, setClickedPoint] = useState<[number, number] | null>(
    null
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueWithImage | null>(
    null
  );

  const handleClick = (e: any) => {
    const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    setClickedPoint(coordinates);
  };

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
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          onClick={handleClick}
          attributionControl={false}
        >
          <MapOverlay
            clickedPoint={clickedPoint}
            setClickedPoint={setClickedPoint}
            sheetOpen={sheetOpen}
            setSheetOpen={setSheetOpen}
            selectedExample={selectedIssue}
            setSelectedExample={setSelectedIssue}
          />
        </Map>
      </MapProvider>
      <MapUi
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
      />
    </div>
  );
};
