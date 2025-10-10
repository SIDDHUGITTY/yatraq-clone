// /app/dashboard/BusesPage.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BusInfo } from "@/types";
import Modal from "../../../Components/Modal";

const initialBuses: BusInfo[] = [
  {
    busNumber: "TG1234",
    basicInfo: {
      driverName: "Raju Kumar",
      conductor: "Laxman Reddy",
      busType: "Palle Velugu",
      routeName: "Hanamkonda to Warangal",
      busStatus: "on-time",
    },
    moreInfo: {
      currentLocation: "Hanamkonda Bus Stand",
      nextStop: "Kazipet X Road",
      lastUpdated: "2 mins ago",
      etaToNextStop: "7 mins",
      startTime: "06:00 AM",
      endTime: "10:00 PM",
      totalStops: [
        "Hanamkonda Bus Stand",
        "Kazipet X Road",
        "Fathe Sagar",
        "Warangal Bus Stand",
      ],
      currentStop: "Hanamkonda Bus Stand",
      driverContact: "xxxxxx1234",
      busFrequency: "Every 20 mins",
      passengerCountStatus: "Moderate",
      alerts: ["Traffic at Kazipet", "Route Diversion near Fathe Sagar"],
      isFavorite: false,
    },
  },
  {
    busNumber: "TG5678",
    basicInfo: {
      driverName: "Suresh Kumar",
      conductor: "Manohar Singh",
      busType: "Express",
      routeName: "Warangal to Kazipet",
      busStatus: "delayed",
    },
    moreInfo: {
      currentLocation: "Kazipet X Road",
      nextStop: "Fathe Sagar",
      lastUpdated: "5 mins ago",
      etaToNextStop: "10 mins",
      startTime: "07:00 AM",
      endTime: "11:00 PM",
      totalStops: ["Kazipet X Road", "Fathe Sagar", "Warangal Bus Stand"],
      currentStop: "Kazipet X Road",
      driverContact: "xxxxxx5678",
      busFrequency: "Every 30 mins",
      passengerCountStatus: "High",
      alerts: ["Mechanical issue near Fathe Sagar"],
      isFavorite: false,
    },
  },
  {
    busNumber: "TG9012",
    basicInfo: {
      driverName: "Ramesh Patel",
      conductor: "Krishna Rao",
      busType: "City Bus",
      routeName: "Secunderabad to Dilsukhnagar",
      busStatus: "on-time",
    },
    moreInfo: {
      currentLocation: "Secunderabad Station",
      nextStop: "Paradise Circle",
      lastUpdated: "1 min ago",
      etaToNextStop: "3 mins",
      startTime: "05:30 AM",
      endTime: "11:30 PM",
      totalStops: [
        "Secunderabad Station",
        "Paradise Circle",
        "Begumpet",
        "Ameerpet",
        "Dilsukhnagar",
      ],
      currentStop: "Secunderabad Station",
      driverContact: "xxxxxx9012",
      busFrequency: "Every 15 mins",
      passengerCountStatus: "High",
      alerts: [],
      isFavorite: false,
    },
  },
  {
    busNumber: "TG3456",
    basicInfo: {
      driverName: "Venkatesh Goud",
      conductor: "Srinivas Yadav",
      busType: "Deluxe",
      routeName: "Hyderabad to Karimnagar",
      busStatus: "on-time",
    },
    moreInfo: {
      currentLocation: "JBS Bus Stand",
      nextStop: "Uppal",
      lastUpdated: "4 mins ago",
      etaToNextStop: "8 mins",
      startTime: "08:00 AM",
      endTime: "09:00 PM",
      totalStops: [
        "JBS Bus Stand",
        "Uppal",
        "Ghatkesar",
        "Suryapet",
        "Karimnagar",
      ],
      currentStop: "JBS Bus Stand",
      driverContact: "xxxxxx3456",
      busFrequency: "Every 2 hours",
      passengerCountStatus: "Low",
      alerts: [],
      isFavorite: false,
    },
  },
  {
    busNumber: "TG7890",
    basicInfo: {
      driverName: "Mohan Das",
      conductor: "Ravi Teja",
      busType: "AC Bus",
      routeName: "Hyderabad to Vijayawada",
      busStatus: "delayed",
    },
    moreInfo: {
      currentLocation: "MGBS Bus Stand",
      nextStop: "LB Nagar",
      lastUpdated: "6 mins ago",
      etaToNextStop: "12 mins",
      startTime: "09:00 AM",
      endTime: "08:00 PM",
      totalStops: [
        "MGBS Bus Stand",
        "LB Nagar",
        "Choutuppal",
        "Nalgonda",
        "Vijayawada",
      ],
      currentStop: "MGBS Bus Stand",
      driverContact: "xxxxxx7890",
      busFrequency: "Every 3 hours",
      passengerCountStatus: "Moderate",
      alerts: ["Heavy traffic on NH65"],
      isFavorite: false,
    },
  },
  {
    busNumber: "TG2345",
    basicInfo: {
      driverName: "Anil Kumar",
      conductor: "Prakash Reddy",
      busType: "Mini Bus",
      routeName: "Kukatpally to HiTech City",
      busStatus: "on-time",
    },
    moreInfo: {
      currentLocation: "Kukatpally Bus Stop",
      nextStop: "Miyapur",
      lastUpdated: "3 mins ago",
      etaToNextStop: "5 mins",
      startTime: "06:30 AM",
      endTime: "10:30 PM",
      totalStops: [
        "Kukatpally Bus Stop",
        "Miyapur",
        "JNTU",
        "HiTech City",
      ],
      currentStop: "Kukatpally Bus Stop",
      driverContact: "xxxxxx2345",
      busFrequency: "Every 25 mins",
      passengerCountStatus: "High",
      alerts: [],
      isFavorite: false,
    },
  },
];

interface NormalizedBus {
  busNumber: string;
  basicInfo: {
    driverName: string;
    conductor: string;
    busType: string;
    routeName: string;
    busStatus: "on-time" | "inactive";
  };
  moreInfo: {
    currentLocation: string;
    nextStop: string;
    lastUpdated: string;
    etaToNextStop: string;
    startTime: string;
    endTime: string;
    totalStops: string[];
    currentStop: string;
    driverContact: string;
    busFrequency: string;
    passengerCountStatus: string;
    alerts: string[];
    isFavorite: boolean;
  };
}

interface Stop {
  arrival_time: string;
  departure_time: string;
  status: "ACTIVE" | "INACTIVE";
  stop_name: string;
}

interface ApiBus {
  arrival_time: string;
  bus_number: string;
  bus_type: string;
  capacity: number;
  conductor_code: string;
  conductor_phonenumber: string;
  departure_time: string;
  depo_id: string;
  destination_location_id: string;
  driver_code: string;
  driver_phonenumber: string;
  latitude: number;
  manager_contact_number: string;
  source_location_id: string;
  status: "ACTIVE" | "INACTIVE";
  stops: Stop[];
  trip_date: string;
}

const BusesPage: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
    const [buses, setBuses] = useState<NormalizedBus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await fetch(`${apiUrl}/bustable/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch buses", res.statusText);
          return;
        }
        const data = await res.json();

        const normalized: NormalizedBus[] = (data.buses || []).map(
          (bus: ApiBus) => ({
            busNumber: bus.bus_number,
            basicInfo: {
              driverName: bus.driver_code,
              conductor: bus.conductor_code,
              busType: bus.bus_type,
              routeName: `${bus.source_location_id} → ${bus.destination_location_id}`,
              busStatus: bus.status === "ACTIVE" ? "on-time" : "inactive",
            },
            moreInfo: {
              currentLocation: bus.source_location_id,
              nextStop: bus.destination_location_id,
              lastUpdated: "just now", // mock
              etaToNextStop: "N/A", // mock
              startTime: bus.departure_time,
              endTime: bus.arrival_time,
              totalStops: bus.stops.map((s: Stop) => s.stop_name),
              currentStop: bus.stops[0]?.stop_name || "N/A",
              driverContact: bus.driver_phonenumber,
              busFrequency: "N/A", // mock
              passengerCountStatus: "N/A", // mock
              alerts: [],
              isFavorite: false,
            },
          })
        );
        setBuses(normalized);
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    };
    fetchBuses();
  }, []);

  const filteredBuses = useMemo(
    () => buses.filter((bus) =>
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.basicInfo.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.basicInfo.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.basicInfo.conductor.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [buses, searchTerm]
  );

  const selectedBus = selectedIndex !== null ? filteredBuses[selectedIndex] : null;

  const next = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredBuses.length);
  };

  const prev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredBuses.length) % filteredBuses.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-gray-800 font-bold">Buses</h2>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search buses, routes, drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border bg-white text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Button */}
          <button
            onClick={() => setSearchTerm("")}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Clear Search
          </button>
        </div>
      </div>

      {/* Search Results Count */}
      {searchTerm && (
        <div className="text-sm text-gray-600">
          Found {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''} matching {searchTerm}
        </div>
      )}

      {/* Buses in Card Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBuses.map((bus, i) => (
          <div
            key={bus.busNumber}
            onClick={() => setSelectedIndex(i)}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {bus.busNumber} • {bus.basicInfo.busType}
            </h3>
            <p className="text-gray-600 text-sm">{bus.basicInfo.routeName}</p>
            <p
              className={`mt-2 text-sm font-semibold ${bus.basicInfo.busStatus === "on-time"
                  ? "text-green-600"
                  : "text-red-600"
                }`}
            >
              Status: {bus.basicInfo.busStatus}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Driver: {bus.basicInfo.driverName}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Conductor: {bus.basicInfo.conductor}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Frequency: {bus.moreInfo.busFrequency}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Passenger Load: {bus.moreInfo.passengerCountStatus}
            </p>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredBuses.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No buses found matching your search.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Clear search and show all buses
          </button>
        </div>
      )}

      {/* Modal for Bus Details */}
      <Modal
        open={!!selectedBus}
        onClose={() => setSelectedIndex(null)}
        title={
          selectedBus
            ? `${selectedBus.busNumber} • ${selectedBus.basicInfo.busType}`
            : ""
        }
        actions={
          <>
            <button
              onClick={prev}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 text-black"
            >
              ← Previous
            </button>
            <button
              onClick={next}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 text-black"
            >
              Next →
            </button>
          </>
        }
      >
        {selectedBus && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-black">
            <div>
              <p>
                <span className="font-semibold">Driver:</span>{" "}
                {selectedBus.basicInfo.driverName}
              </p>
              <p>
                <span className="font-semibold">Conductor:</span>{" "}
                {selectedBus.basicInfo.conductor}
              </p>
              <p>
                <span className="font-semibold">Route:</span>{" "}
                {selectedBus.basicInfo.routeName}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedBus.basicInfo.busStatus}
              </p>
              <p>
                <span className="font-semibold">Frequency:</span>{" "}
                {selectedBus.moreInfo.busFrequency}
              </p>
              <p>
                <span className="font-semibold">Passenger Load:</span>{" "}
                {selectedBus.moreInfo.passengerCountStatus}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Current Location:</span>{" "}
                {selectedBus.moreInfo.currentLocation}
              </p>
              <p>
                <span className="font-semibold">Next Stop:</span>{" "}
                {selectedBus.moreInfo.nextStop}
              </p>
              <p>
                <span className="font-semibold">ETA:</span>{" "}
                {selectedBus.moreInfo.etaToNextStop}
              </p>
              <p>
                <span className="font-semibold">Last Updated:</span>{" "}
                {selectedBus.moreInfo.lastUpdated}
              </p>
              <p>
                <span className="font-semibold">Start-End:</span>{" "}
                {selectedBus.moreInfo.startTime} - {selectedBus.moreInfo.endTime}
              </p>
              <p>
                <span className="font-semibold">Driver Contact:</span>{" "}
                {selectedBus.moreInfo.driverContact}
              </p>
              {selectedBus.moreInfo.alerts.length > 0 && (
                <p className="font-semibold text-red-600">
                  Alerts: {selectedBus.moreInfo.alerts.join(", ")}
                </p>
              )}
              <p>
                <span className="font-semibold">Stops:</span>{" "}
                {selectedBus.moreInfo.totalStops.join(" → ")}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BusesPage;
