// /app/dashboard/ManagersPage.tsx
{/*"use client";

import React, { useMemo, useState } from "react";
import { BusInfo, Manager } from "@/types";
import Modal from "../../Components/Modal";
import BusCard from "../../Components/BusCard";

const makeBus = (overrides: Partial<BusInfo>): BusInfo => ({
  busNumber: "TG0000",
  basicInfo: {
    driverName: "Driver",
    conductor: "Conductor",
    busType: "Express",
    routeName: "A to B",
    busStatus: "on-time",
  },
  moreInfo: {
    currentLocation: "Depot",
    nextStop: "Stop 1",
    lastUpdated: "Just now",
    etaToNextStop: "5 mins",
    startTime: "06:00 AM",
    endTime: "10:00 PM",
    totalStops: ["Stop 1", "Stop 2", "Stop 3"],
    currentStop: "Stop 1",
    driverContact: "xxxxxx0000",
    busFrequency: "Every 20 mins",
    passengerCountStatus: "Moderate",
    alerts: [],
    isFavorite: false
  },
  ...overrides,
});

const managersSeed: Manager[] = [
  {
    id: "m1",
    name: "Ravi Kumar",
    depot: "Hanamkonda Depot",
    buses: [
      makeBus({
        busNumber: "TG1234",
        basicInfo: {
          driverName: "Raju",
          conductor: "Laxman",
          busType: "Palle Velugu",
          routeName: "Hanamkonda to Warangal",
          busStatus: "on-time",
        },
        moreInfo: {
          currentLocation: "Hanamkonda Bus Stand",
          nextStop: "Kazipet X Road",
          lastUpdated: "2 mins ago",
          etaToNextStop: "7 mins",
          totalStops: ["Hanamkonda Bus Stand", "Kazipet X Road", "Fathe Sagar", "Warangal Bus Stand"],
          currentStop: "Hanamkonda Bus Stand",
          driverContact: "xxxxxx1234",
          busFrequency: "Every 20 mins",
          passengerCountStatus: "Moderate",
          alerts: ["Traffic at Kazipet", "Route Diversion near Fathe Sagar"],
          startTime: "06:00 AM",
          endTime: "10:00 PM",
          isFavorite: false
        },
      }),
      makeBus({
        busNumber: "TG5678",
        basicInfo: {
          driverName: "Suresh",
          conductor: "Manohar",
          busType: "Express",
          routeName: "Warangal to Kazipet",
          busStatus: "delayed",
        },
        moreInfo: {
          currentLocation: "Kazipet X Road",
          nextStop: "Fathe Sagar",
          lastUpdated: "5 mins ago",
          etaToNextStop: "10 mins",
          totalStops: ["Kazipet X Road", "Fathe Sagar", "Warangal Bus Stand"],
          currentStop: "Kazipet X Road",
          driverContact: "xxxxxx5678",
          busFrequency: "Every 30 mins",
          passengerCountStatus: "High",
          alerts: ["Mechanical issue near Fathe Sagar"],
          startTime: "07:00 AM",
          endTime: "11:00 PM",
          isFavorite: false
        },
      }),
    ],
  },
  {
    id: "m2",
    name: "Sita Reddy",
    depot: "Warangal Depot",
    buses: [
      makeBus({
        busNumber: "TG9101",
        basicInfo: {
          driverName: "Kiran",
          conductor: "Anil",
          busType: "Super Express",
          routeName: "Warangal to Kazipet",
          busStatus: "on-time",
        },
        moreInfo: {
          currentLocation: "Warangal Bus Stand",
          nextStop: "Fathe Sagar",
          lastUpdated: "1 min ago",
          etaToNextStop: "5 mins",
          totalStops: ["Warangal Bus Stand", "Fathe Sagar", "Kazipet X Road"],
          currentStop: "Warangal Bus Stand",
          driverContact: "xxxxxx9101",
          busFrequency: "Every 25 mins",
          passengerCountStatus: "Low",
          alerts: [],
          startTime: "06:30 AM",
          endTime: "10:30 PM",
          isFavorite: false
        },
      }),
    ],
  },
];

const ManagersPage: React.FC = () => {
  const [managers] = useState<Manager[]>(managersSeed);
  const [search, setSearch] = useState("");
  const [depot, setDepot] = useState("");
  const [selectedManagerIndex, setSelectedManagerIndex] = useState<number | null>(null);
  const [selectedBusIndex, setSelectedBusIndex] = useState<number | null>(null);

  const depots = useMemo(() => Array.from(new Set(managers.map((m) => m.depot))), [managers]);

  const filtered = useMemo(
    () =>
      managers.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) &&
          (depot ? m.depot === depot : true)
      ),
    [managers, search, depot]
  );

  const selectedManager =
    selectedManagerIndex !== null ? filtered[selectedManagerIndex] : null;
  const selectedBus =
    selectedManager && selectedBusIndex !== null
      ? selectedManager.buses[selectedBusIndex]
      : null;

  const next = () => {
    if (!selectedManager || selectedBusIndex === null) return;
    setSelectedBusIndex((selectedBusIndex + 1) % selectedManager.buses.length);
  };

  const prev = () => {
    if (!selectedManager || selectedBusIndex === null) return;
    setSelectedBusIndex((selectedBusIndex - 1 + selectedManager.buses.length) % selectedManager.buses.length);
  };

  return (
    <div className="space-y-6 text-black">
      <h2 className="text-2xl font-bold">Managers & Depots</h2>

      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by manager name…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-1/2"
        />
        <select
          value={depot}
          onChange={(e) => setDepot(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-1/3"
        >
          <option value="">All Depots</option>
          {depots.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No managers found.</p>
      ) : (
        filtered.map((m, mi) => (
          <div key={m.id} className="rounded-2xl bg-white p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{m.name}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Depot:</span> {m.depot}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {m.buses.map((bus, bi) => (
                <BusCard
                  key={bus.busNumber}
                  bus={bus}
                  onClick={() => {
                    setSelectedManagerIndex(mi);
                    setSelectedBusIndex(bi);
                  }}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <Modal
        open={!!selectedBus && !!selectedManager}
        onClose={() => setSelectedBusIndex(null)}
        title={
          selectedBus && selectedManager
            ? `${selectedBus.busNumber} • ${selectedBus.basicInfo.busType} • Manager: ${selectedManager.name}`
            : undefined
        }
        actions={
          <>
            <button onClick={prev} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
              &larr; Previous
            </button>
            <button onClick={next} className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
              Next &rarr;
            </button>
          </>
        }
      >
        {selectedBus && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p><span className="font-semibold">Driver:</span> {selectedBus.basicInfo.driverName}</p>
              <p><span className="font-semibold">Conductor:</span> {selectedBus.basicInfo.conductor}</p>
              <p><span className="font-semibold">Route:</span> {selectedBus.basicInfo.routeName}</p>
              <p><span className="font-semibold">Status:</span> {selectedBus.basicInfo.busStatus}</p>
              <p><span className="font-semibold">Frequency:</span> {selectedBus.moreInfo.busFrequency}</p>
              <p><span className="font-semibold">Passenger Load:</span> {selectedBus.moreInfo.passengerCountStatus}</p>
            </div>
            <div>
              <p><span className="font-semibold">Current Location:</span> {selectedBus.moreInfo.currentLocation}</p>
              <p><span className="font-semibold">Next Stop:</span> {selectedBus.moreInfo.nextStop}</p>
              <p><span className="font-semibold">ETA:</span> {selectedBus.moreInfo.etaToNextStop}</p>
              <p><span className="font-semibold">Last Updated:</span> {selectedBus.moreInfo.lastUpdated}</p>
              <p><span className="font-semibold">Start-End:</span> {selectedBus.moreInfo.startTime} - {selectedBus.moreInfo.endTime}</p>
              <p><span className="font-semibold">Current Stop:</span> {selectedBus.moreInfo.currentStop}</p>
              <p><span className="font-semibold">Driver Contact:</span> {selectedBus.moreInfo.driverContact}</p>
              {selectedBus.moreInfo.alerts.length > 0 && (
                <p className="font-semibold text-red-600">Alerts: {selectedBus.moreInfo.alerts.join(", ")}</p>
              )}
              <p><span className="font-semibold">Stops:</span> {selectedBus.moreInfo.totalStops.join(" → ")}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagersPage;
*/}