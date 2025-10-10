// /app/dashboard/LiveTrackingPage.tsx
"use client";

import React from "react";
import MapLarge from "../../../Components/MapLarge";

const LiveTrackingPage: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Live Tracking</h2>
    <MapLarge />
  </div>
);

export default LiveTrackingPage;
