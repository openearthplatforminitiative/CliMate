"use client";
import { Map, MapProvider, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import RoomIcon from "@mui/icons-material/Room";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { useCoordinates } from "@/lib/CoordinatesContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "./Form";
import { MenuButton } from "./MenuButton";

export const EcoMap = () => {
  const [clickedPoint, setClickedPoint] = useState<[number, number] | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setCoordinates } = useCoordinates();
  const mapRef = useRef<any>(null);

  const handleClick = (e: any) => {
    const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    setClickedPoint(coordinates);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
  };

  const handleAddReport = () => {
    if (clickedPoint) {
      setCoordinates(clickedPoint);
      setSheetOpen(true);

      // Make the map center on the clicked place.
      // Centers with an offset such that the pointer is on the top half of the screen.
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        const height = map.getContainer().clientHeight;
        map.flyTo({
          center: clickedPoint,
          zoom: 12,
          offset: [0, -height / 5],
        });
      }
    }
  };
  return (
    <div className="fixed inset-0">
      <MapProvider>
        <Map
          ref={mapRef}
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
          {clickedPoint && (
            <Marker
              longitude={clickedPoint[0]}
              latitude={clickedPoint[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center gap-2">
                <Button
                  size="sm"
                  className="mb-2 bg-[#00391F] whitespace-nowrap"
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
        </Map>
      </MapProvider>
      <MenuButton className="absolute bg-[#00391F] text-[#DFF7E3]" />

      <div className="absolute bottom-7 right-4 z-10 flex flex-col gap-4">
        {/* <CardSlider /> */}
        {/* <Card>Test</Card> */}
      </div>
      <Sheet open={sheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent side="bottom" className="bg-[#F5FFF4]">
          <SheetHeader>
            <SheetTitle>Create Report</SheetTitle>
            <SheetDescription>
              <Form />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
