"use client";

import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import MapLarge to avoid SSR issues
const MapLarge = dynamic(() => import("../../../Components/MapLarge"), {
  ssr: false, // Disable server-side rendering
});

// Dummy TSRTC depot data (for potential markers in MapLarge)
export const depots = [
  { name: "Miyapur Depot", coords: [17.4932, 78.3915] },
  { name: "Uppal Depot", coords: [17.4057, 78.5596] },
  { name: "Musheerabad Depot", coords: [17.4083, 78.5010] },
  { name: "Kukatpally Depot", coords: [17.4946, 78.3999] },
  { name: "Secunderabad Depot", coords: [17.4399, 78.4983] },
  { name: "Dilsukhnagar Depot", coords: [17.3717, 78.5250] },
  { name: "Charminar Depot", coords: [17.3616, 78.4747] },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Active Buses</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">128</h2>
          <p className="text-xs text-green-500 mt-1">+5 today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">On-time %</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">92%</h2>
          <p className="text-xs text-gray-400 mt-1">Last 24h</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Incidents</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">3</h2>
          <p className="text-xs text-gray-400 mt-1">Open alerts</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Passenger Load</p>
          <h2 className="text-xl font-bold text-indigo-600 mt-2">Moderate</h2>
          <p className="text-xs text-gray-400 mt-1">System-wide</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-4">Ridership (last 7d)</h3>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            Graph Placeholder
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-4">On-time (last 7d)</h3>
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            Graph Placeholder
          </div>
        </div>
      </div>

      {/* Live Map Section */}
     {/*} <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
        <h3 className="text-lg font-semibold mb-4">Live Map (TSRTC Depots)</h3>
        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapLarge />
        </div>
      </div>*/}
    </div>
  );
}
