"use client";
import { Map, MapProvider, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import RoomIcon from "@mui/icons-material/Room";
import { useEffect, useState } from "react";

export const PickLocation = () => {
  const [userLocation, setUserLocation] = useState([59.913, 10.75]);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);
  return (
    <div className="flex-1 h-1/2 p-2">
      <MapProvider>
        <Map
          initialViewState={{
            longitude: 10.752245,
            latitude: 59.913868,
            zoom: 8,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
          <Marker
            latitude={userLocation[0]}
            longitude={userLocation[1]}
            anchor="bottom"
          >
            <RoomIcon />
          </Marker>
        </Map>
      </MapProvider>
    </div>
  );
};
