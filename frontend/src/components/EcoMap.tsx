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

  const [sheetAddOpen, setSheetAddOpen] = useState(false);
  const [sheetViewOpen, setSheetViewOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueWithImage | null>(
    null
  );

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
          attributionControl={false}
        >
          <MapOverlay
            clickedPoint={clickedPoint}
            setClickedPoint={setClickedPoint}
            sheetAddOpen={sheetAddOpen}
            setSheetAddOpen={setSheetAddOpen}
            sheetViewOpen={sheetViewOpen}
            setSheetViewOpen={setSheetViewOpen}
            selectedExample={selectedIssue}
            setSelectedExample={setSelectedIssue}
          />
        </Map>
      </MapProvider>
      <MapUi
        sheetAddOpen={sheetAddOpen}
        setSheetAddOpen={setSheetAddOpen}
        sheetViewOpen={sheetViewOpen}
        setSheetViewOpen={setSheetViewOpen}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
      />
    </div>
  );
};
