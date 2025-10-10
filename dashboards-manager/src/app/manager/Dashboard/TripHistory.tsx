"use client";

import React, { useMemo, useState } from "react";

interface TripHistoryItem {
  dateTime: string;
  busNumber: string;
  route: string;
  status: string;
  issue: string;
  driver: string;
  conductor: string;
}

// 🚍 Dummy Data (replace with API later)
const SAMPLE_HISTORY: TripHistoryItem[] = [
  {
    dateTime: "18 Sept, 10:30 AM",
    busNumber: "TS05AB1234",
    route: "Route 45",
    status: "Trip Completed",
    issue: "+12 mins",
    driver: "rama",
    conductor: "lakshman",
  },
  {
    dateTime: "18 Sept, 02:15 PM",
    busNumber: "TS09XY6789",
    route: "Route 22",
    status: "Trip Started",
    issue: "—",
    driver: "rama",
    conductor: "lakshman",
  },
  {
    dateTime: "17 Sept, 08:45 PM",
    busNumber: "TS07PQ1111",
    route: "Route 18",
    status: "Breakdown (Engine)",
    issue: "N/A",
    driver: "rama",
    conductor: "lakshman",
  },
];

export default function TripHistory() {
  const [query, setQuery] = useState("");

  // 🔍 Search filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_HISTORY;
    return SAMPLE_HISTORY.filter((t) =>
      t.busNumber.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="p-6 text-black space-y-6">
      <h1 className="text-2xl font-bold">Trip History</h1>

      {/* Search Box */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search by Bus Number
        </label>
        <input
          type="text"
          placeholder="e.g., TS05AB1234"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* History Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Date & Time</th>
              <th className="px-4 py-2 border">Bus Number</th>
              <th className="px-4 py-2 border">Route</th>
              <th className="px-4 py-2 border">Status</th>
              {/* <th className="px-4 py-2 border">Delay / Issue</th> */}
              <th className="px-4 py-2 border">Conductor</th>
              <th className="px-4 py-2 border">Driver</th>

            </tr>
          </thead>
          <tbody>
            {filtered.map((trip, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{trip.dateTime}</td>
                <td className="px-4 py-2 border font-semibold">{trip.busNumber}</td>
                <td className="px-4 py-2 border">{trip.route}</td>
                <td
                  className={`px-4 py-2 border ${
                    trip.status.includes("Breakdown")
                      ? "text-red-600 font-bold"
                      : trip.status.includes("Completed")
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {trip.status}
                </td>
                {/* <td className="px-4 py-2 border">{trip.issue}</td> */}
                <td className="px-4 py-2 border font-semibold">{trip.conductor}</td>
                <td className="px-4 py-2 border font-semibold">{trip.driver}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
