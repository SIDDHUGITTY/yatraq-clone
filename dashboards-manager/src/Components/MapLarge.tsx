"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// custom bus icon
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30], // adjust for better alignment
  popupAnchor: [0, -30],
});

interface Bus {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

const initialBuses: Bus[] = [
  { id: 1, name: "Bus 101", lat: 17.385044, lng: 78.486671 }, // Hyderabad
  { id: 2, name: "Bus 202", lat: 17.392, lng: 78.479 },
  { id: 3, name: "Bus 303", lat: 17.38, lng: 78.49 },
];

export default function MapLarge() {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 3000); // update every 3 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[17.385044, 78.486671]} // Hyderabad center
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {buses.map((bus) => (
        <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
          <Popup>
            <b>{bus.name}</b> <br />
            Lat: {bus.lat.toFixed(4)} <br />
            Lng: {bus.lng.toFixed(4)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
