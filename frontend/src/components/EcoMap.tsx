"use client";
import { Map, MapProvider } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapLayers } from "./MapLayers";
import { MapUi } from "./MapUi";
import { useEffect, useState } from "react";
import { IssueWithImage } from "@/types/issue";
import { useIssues } from "@/lib/IssuesContext";

export const EcoMap = () => {
  const [clickedPoint, setClickedPoint] = useState<[number, number] | null>(
    null
  );

  const [sheetAddOpen, setSheetAddOpen] = useState(false);
  const [sheetViewOpen, setSheetViewOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueWithImage | null>(
    null
  );

  const { setIssues } = useIssues();

  // Get all issues
  useEffect(() => {
    const fetchData = async () => {
      const retrievedIssues = await fetch("/api/issue");
      const { data } = await retrievedIssues.json();
      console.log("setting issues to ", data);
      setIssues(data);
    };
    fetchData();
  }, []);

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
          id="ecoMap"
        >
          <MapLayers
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
        <MapUi
          sheetAddOpen={sheetAddOpen}
          setSheetAddOpen={setSheetAddOpen}
          sheetViewOpen={sheetViewOpen}
          setSheetViewOpen={setSheetViewOpen}
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
        />
      </MapProvider>
    </div>
  );
};
