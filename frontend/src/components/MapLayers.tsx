import { useCoordinates } from "@/lib/CoordinatesContext";
import { IssueWithImage } from "@/types/issue";
import RoomIcon from "@mui/icons-material/Room";
import { useMap, Marker, Source, Layer } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MapMouseEvent } from "maplibre-gl";
import { useIssues } from "@/lib/IssuesContext";

interface MapLayersProps {
  clickedPoint: [number, number] | null;
  setClickedPoint: (point: [number, number] | null) => void;
  sheetAddOpen: boolean;
  setSheetAddOpen: (open: boolean) => void;
  sheetViewOpen: boolean;
  setSheetViewOpen: (open: boolean) => void;
  selectedExample: IssueWithImage | null;
  setSelectedExample: (example: IssueWithImage | null) => void;
}

export const MapLayers = ({
  clickedPoint,
  setClickedPoint,
  sheetAddOpen,
  setSheetAddOpen,
  sheetViewOpen,
  setSheetViewOpen,
  selectedExample,
  setSelectedExample,
}: MapLayersProps) => {
  const { setCoordinates } = useCoordinates();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const map = useMap();
  const { issues } = useIssues();
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const handleMapClick = (event: MapMouseEvent) => {
      // Check if the click is on the "issues-layer"
      const clickedFeatures = map.current?.queryRenderedFeatures(event.point, {
        layers: ["issues-layer"],
      });

      if (clickedFeatures && clickedFeatures.length > 0) {
        // Handle feature click
        const clickedFeature = clickedFeatures[0];
        const { id, title, description, image, category, active } =
          clickedFeature.properties;

        if (clickedFeature.geometry.type === "Point") {
          setSelectedExample({
            id,
            title,
            description,
            image,
            category,
            active,
            location: {
              type: "Point",
              coordinates: clickedFeature.geometry.coordinates,
            },
          });
        }
        setSheetViewOpen(true); // Open the sheet with the selected issue
      } else {
        // If no features are clicked, set the "Add Report" marker
        const { lng, lat } = event.lngLat;
        setClickedPoint([lng, lat]);
      }
    };

    // Attach the click event listener to the map
    map.current?.on("click", handleMapClick);

    return () => {
      // Clean up the event listener when the component unmounts
      map.current?.off("click", handleMapClick);
    };
  }, [map, setClickedPoint, setSelectedExample, setSheetViewOpen]);

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
          description: issue.description,
          image: issue.image,
        },
      })),
    });
  }, [issues]);

  // Get location of user and go there if allowed
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        if (map.current) {
          map.current.getMap().flyTo({
            center: [longitude, latitude],
            zoom: 12,
          });
        }
      });
    }
  }, []);

  const handleAddReport = () => {
    if (clickedPoint) {
      setCoordinates(clickedPoint);
      setSheetAddOpen(true);

      // Make the map center on the clicked place.
      // Centers with an offset such that the pointer is on the top half of the screen.
      if (map.current) {
        const height = map.current.getContainer().clientHeight;
        map.current.flyTo({
          center: clickedPoint,
          offset: [0, -height / 5],
        });
      }
    }
  };

  return (
    <>
      {userLocation && (
        <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
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
              className="bg-[#00391F] whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                handleAddReport();
              }}
            >
              Add Report Here
            </Button>
            <RoomIcon />
          </div>
        </Marker>
      )}
      <Source id="issues" type="geojson" data={geoJsonData} generateId>
        <Layer
          id="issues-layer"
          type="circle"
          paint={{
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              4, // At zoom level 0, radius is 4
              12,
              8, // At zoom level 12, radius is 8
              22,
              16, // At zoom level 22, radius is 16
            ],
            "circle-color": "#00391F",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
          }}
        />
      </Source>
    </>
  );
};
