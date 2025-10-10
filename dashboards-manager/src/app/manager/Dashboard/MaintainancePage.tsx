// /app/dashboard/MaintenancePage.tsx
"use client";

import React from "react";
import FormField from "../../../Components/FormField";

const MaintenancePage: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Maintenance</h2>
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="mb-3 font-semibold">Log Maintenance</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField label="Bus Number" placeholder="TG1234" />
        <FormField label="Issue" placeholder="e.g., Brake check" />
        <FormField label="Date" type="date" />
      </div>
      <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        Save Log
      </button>
    </div>
  </div>
);

export default MaintenancePage;
