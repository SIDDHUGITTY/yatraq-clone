// // /app/dashboard/RoutesPage.tsx
// "use client";

// import React, { useState } from "react";
// import { MapContainer, TileLayer, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// export default function RoutesPage() {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

//   const handleShowRoute = async () => {
//     if (!from || !to) return alert("Please enter both locations");

//     try {
//       // Convert locations into coordinates using Nominatim (OpenStreetMap geocoding)
//       const geocode = async (place: string) => {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
//         );
//         const data = await res.json();
//         if (data.length === 0) throw new Error("Location not found: " + place);
//         return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//       };

//       const fromCoords = await geocode(from);
//       const toCoords = await geocode(to);

//       // Fetch route from OSRM (free routing API)
//       const routeRes = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`
//       );
//       const routeData = await routeRes.json();

//       const coords = routeData.routes[0].geometry.coordinates.map(
//         (c: number[]) => [c[1], c[0]] as [number, number]
//       );

//       setRouteCoords(coords);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch route");
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-xl font-bold">Route Finder</h1>

//       {/* Input fields inside grey border card */}
//       <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex gap-2">
//         <input
//           type="text"
//           placeholder="From (e.g. Hanamkonda)"
//           value={from}
//           onChange={(e) => setFrom(e.target.value)}
//           className="border border-gray-300 rounded p-2 w-1/3"
//         />
//         <input
//           type="text"
//           placeholder="To (e.g. Warangal)"
//           value={to}
//           onChange={(e) => setTo(e.target.value)}
//           className="border border-gray-300 rounded p-2 w-1/3"
//         />
//         <button
//           onClick={handleShowRoute}
//           className="bg-blue-600 text-white px-4 rounded"
//         >
//           Show Route
//         </button>
//       </div>

//       {/* Map inside grey border card */}
//       <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//         <MapContainer
//           center={[17.9949, 79.5715]} // Warangal center
//           zoom={13}
//           className="h-[500px] w-full rounded-lg"
//         >
//           <TileLayer
//             attribution="&copy; OpenStreetMap contributors"
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {routeCoords.length > 0 && (
//             <Polyline positions={routeCoords} color="red" />
//           )}
//         </MapContainer>
//       </div>
//     </div>
//   );
// }
