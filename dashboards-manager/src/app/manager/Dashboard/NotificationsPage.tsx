// /app/dashboard/NotificationsPage.tsx
"use client";

import React from "react";
import FormField from "../../../Components/FormField";

const NotificationsPage: React.FC = () => (
  <div className="space-y-4 text-black">
    <h2 className="text-2xl font-bold">Notifications</h2>
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="mb-3 font-semibold">Compose Notification</h3>
      <FormField label="Title" placeholder="Service Alert" />
      <label className="mt-2 block">
        <div className="mb-1 text-sm text-gray-600">Message</div>
        <textarea className="h-28 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500" />
      </label>
      <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
        Send
      </button>
    </div>
  </div>
);

export default NotificationsPage;
