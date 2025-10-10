// /app/dashboard/SettingsPage.tsx
"use client";

import React from "react";
import FormField from "../../../Components/FormField";

const SettingsPage: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Settings</h2>
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="mb-3 font-semibold">Company Settings</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField label="Company Name" placeholder="TSRTC" />
        <FormField label="Support Email" placeholder="support@example.com" />
      </div>
      <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        Save
      </button>
    </div>
  </div>
);

export default SettingsPage;
