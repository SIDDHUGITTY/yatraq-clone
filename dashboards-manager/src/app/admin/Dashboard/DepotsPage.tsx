// /app/dashboard/Page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { BusInfo } from "@/types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define Depot type locally if not exported from "@/types"
type Depot = {
  id: string;
  name: string;
  manager: string;
  buses: BusInfo[];
};
import Modal from "../../../Components/Modal";
import BusCard from "../../../Components/BusCard";

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

const depotsSeed: Depot[] = [
  {
    id: "d1",
    name: "Hanamkonda Depot",
    manager: "Ravi Kumar",
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
    id: "d2",
    name: "Warangal Depot",
    manager: "Sita Reddy",
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

const depotLocations = [
  { name: "Miyapur Depot", coords: [17.4932, 78.3915] },
  { name: "Uppal Depot", coords: [17.4057, 78.5596] },
  { name: "Musheerabad Depot", coords: [17.4083, 78.5010] },
  { name: "Kukatpally Depot", coords: [17.4946, 78.3999] },
  { name: "Secunderabad Depot", coords: [17.4399, 78.4983] },
  { name: "Dilsukhnagar Depot", coords: [17.3717, 78.5250] },
  { name: "Charminar Depot", coords: [17.3616, 78.4747] },
];
const DepotsPage: React.FC = () => {
  const [depots] = useState<Depot[]>(depotsSeed);
  const [search, setSearch] = useState("");
  const [manager, setManager] = useState("");
  const [selectedDepotIndex, setSelectedDepotIndex] = useState<number | null>(null);
  const [selectedBusIndex, setSelectedBusIndex] = useState<number | null>(null);

  const managers = useMemo(() => Array.from(new Set(depots.map((d) => d.manager))), [depots]);


  const filtered = useMemo(
    () =>
      depots.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) &&
          (manager ? d.manager === manager : true)
      ),
    [depots, search, manager]
  );

  const selectedDepot =
    selectedDepotIndex !== null ? filtered[selectedDepotIndex] : null;
  const selectedBus =
    selectedDepot && selectedBusIndex !== null
      ? selectedDepot.buses[selectedBusIndex]
      : null;

  const next = () => {
    if (!selectedDepot || selectedBusIndex === null) return;
    setSelectedBusIndex((selectedBusIndex + 1) % selectedDepot.buses.length);
  };

  const prev = () => {
    if (!selectedDepot || selectedBusIndex === null) return;
    setSelectedBusIndex((selectedBusIndex - 1 + selectedDepot.buses.length) % selectedDepot.buses.length);
  };
 
  return (
    <div className="space-y-6 text-black">
      <h2 className="text-2xl font-bold">Depots & Buses</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Add deport</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Depot Id"
            // value={newManager.fullName}
            // onChange={(e) => setNewManager({ ...newManager, fullName: e.target.value })}
            className="border border-gray-300 p-2 rounded w-40"
          />
           <input
            type="text"
            placeholder="Depot Name" 
            // value={newManager.name}
            // onChange={(e) =>
            //   setNewManager({ ...newManager, name: e.target.value })
            // }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Manager Name"
            // value={newManager.phone}
            // onChange={(e) =>
            //   setNewManager({ ...newManager, phone: e.target.value })
            // }
            className="border border-gray-300 p-2 rounded w-40"
          />
          {/* <input
            type="email"
            placeholder="Email"
            // value={newManager.email}
            // onChange={(e) =>
            //   setNewManager({ ...newManager, email: e.target.value })
            // }
            className="border border-gray-300 p-2 rounded w-48"
          />
          <input
            type="text"
            placeholder="Gender"
            // value={newManager.gender}
            // onChange={(e) =>
            //   setNewManager({ ...newManager, gender: e.target.value })
            // }
            className="border border-gray-300 p-2 rounded w-40"
          /> */}
          <button
            // onClick={addManager}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by depot name…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-1/2"
        />
        <select
          value={manager}
          onChange={(e) => setManager(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 md:w-1/3"
        >
          <option value="">All Managers</option>
          {managers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No depots found.</p>
      ) : (
        filtered.map((d, di) => (
          <div key={d.id} className="rounded-2xl bg-white p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{d.name}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Manager:</span> {d.manager}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {d.buses.map((bus, bi) => (
                <BusCard
                  key={bus.busNumber}
                  bus={bus}
                  onClick={() => {
                    setSelectedDepotIndex(di);
                    setSelectedBusIndex(bi);
                  }}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <Modal
        open={!!selectedBus && !!selectedDepot}
        onClose={() => setSelectedBusIndex(null)}
        title={
          selectedBus && selectedDepot
            ? `${selectedBus.busNumber} • ${selectedBus.basicInfo.busType} • Depot: ${selectedDepot.name}`
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
       <MapContainer
                  center={[17.385044, 78.486671]} // Hyderabad center
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                 <TileLayer
                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                  {/* Loop through depotLocations */}
                  {depotLocations.map((depot, i) => (
                    <Marker key={i} position={depot.coords as [number, number]}>
                      <Popup>{depot.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
    </div>
  );
};

export default DepotsPage;
