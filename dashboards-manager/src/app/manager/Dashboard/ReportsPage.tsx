"use client";

import React, { useState } from "react";

interface Depot {
  id: number;
  name: string;
  managers: number;
  issues: string[];
}

const depots: Depot[] = [
  {
    id: 1,
    name: "Miyapur Depot",
    managers: 4,
    issues: ["2 buses breakdown", "Late departures"],
  },
  {
    id: 2,
    name: "Uppal Depot",
    managers: 3,
    issues: ["Fuel shortage"],
  },
  {
    id: 3,
    name: "Koti Depot",
    managers: 5,
    issues: ["Staff shortage", "Bus cleaning pending"],
  },
  {
    id: 4,
    name: "Hayathnagar Depot",
    managers: 2,
    issues: ["Minor accidents reported"],
  },
];

export default function ReportsPage() {
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null);
  const [showIssues, setShowIssues] = useState(false);

  return (
    <div className="space-y-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Depot Reports</h1>

      {/* Depot List in Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {depots.map((depot) => (
          <div
            key={depot.id}
            onClick={() => {
              setSelectedDepot(depot);
              setShowIssues(false);
            }}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {depot.name}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Managers: <span className="font-bold">{depot.managers}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Selected Depot Report */}
      {selectedDepot && (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-xl font-bold">{selectedDepot.name} Report</h2>
          <p className="mt-2 text-gray-700">
            Total Managers:{" "}
            <span className="font-semibold">{selectedDepot.managers}</span>
          </p>

          <button
            onClick={() => setShowIssues(true)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Show Issues
          </button>

          {showIssues && (
            <div className="mt-4">
              <h3 className="font-semibold text-red-600">Depot Issues:</h3>
              {selectedDepot.issues.length > 0 ? (
                <ul className="list-disc list-inside mt-2">
                  {selectedDepot.issues.map((issue, idx) => (
                    <li key={idx} className="text-gray-700">
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No issues reported 🎉</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
