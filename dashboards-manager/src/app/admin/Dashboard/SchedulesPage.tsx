// /app/dashboard/SchedulesPage.tsx
"use client";

import React from "react";
import FormField from "../../../Components/FormField";

const SchedulesPage: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Schedules</h2>
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="mb-3 font-semibold">Create Schedule</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField label="Bus Number" placeholder="e.g., TG1234" />
        <FormField label="Route Name" placeholder="e.g., Hanamkonda to Warangal" />
        <FormField label="Start Time" type="time" />
        <FormField label="End Time" type="time" />
        <FormField label="Frequency" placeholder="Every 20 mins" />
      </div>
      <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        Save Schedule
      </button>
    </div>
  </div>
);

export default SchedulesPage;
