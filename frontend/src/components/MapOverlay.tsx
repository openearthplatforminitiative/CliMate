import { useCoordinates } from "@/lib/CoordinatesContext";
import { IssueWithImage, examples } from "@/types/issue";
import RoomIcon from "@mui/icons-material/Room";
import { useMap, Marker } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface MapOverlayProps {
  clickedPoint: [number, number] | null;
  setClickedPoint: (point: [number, number] | null) => void;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  selectedExample: IssueWithImage | null;
  setSelectedExample: (example: IssueWithImage | null) => void;
}

export const MapOverlay = ({
  clickedPoint,
  setClickedPoint,
  sheetOpen,
  setSheetOpen,
  selectedExample,
  setSelectedExample,
}: MapOverlayProps) => {
  const { setCoordinates } = useCoordinates();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const map = useMap();
  const [issues, setIssues] = useState<IssueWithImage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const retrievedIssues = await fetch("/api/issue");
      console.log(retrievedIssues);
      const { data } = await retrievedIssues.json();
      setIssues(data);
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    map.current?.on("zoom", () => {
      if (map.current) {
        // const scalePercent = 1 + (map.current.getZoom() - 8) * 0.4;
        // const element = document.getElementById("example-marker");
        // if (element) {
        //   console.log("transforming to", scalePercent);
        //   element.style.transform = `scale(${scalePercent})`;
        //   element.style.transformOrigin = "bottom";
        // }
        // const zoom = map.current.getZoom();
        // const markers = document.querySelectorAll(".example-marker");
        // markers.forEach((marker) => {
        //   marker.style.transform = `scale(${1 + zoom / 100})`;
        // });
      }
    });
  }, []);

  const handleAddReport = () => {
    if (clickedPoint) {
      setCoordinates(clickedPoint);
      setSheetOpen(true);

      // Make the map center on the clicked place.
      // Centers with an offset such that the pointer is on the top half of the screen.
      if (map.current) {
        const height = map.current.getContainer().clientHeight;
        map.current.flyTo({
          center: clickedPoint,
          zoom: 12,
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
      {issues.map((example) => {
        return (
          <Marker
            key={example.issue_uuid}
            longitude={example.location.coordinates[0]}
            latitude={example.location.coordinates[1]}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedExample(example);
              setSheetOpen(true);
            }}
          >
            {/* <div className="flex items-center justify-center w-8 h-8 bg-[#00391F] rounded-full">
                  <RoomIcon className="text-white" />
                </div> */}
            <div
              id="example-marker"
              className="example-marker flex items-center justify-center w-8 h-8 bg-[#00391F] rounded-full"
            >
              <RoomIcon className="text-white" />
            </div>
          </Marker>
        );
      })}
    </>
  );
};
