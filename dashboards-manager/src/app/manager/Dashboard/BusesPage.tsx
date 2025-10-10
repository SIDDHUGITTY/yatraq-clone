"use client";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../Components/Modal";


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

const BusesPage = () => {
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
    () =>
      buses.filter(
        (bus) =>
          bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bus.basicInfo.routeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bus.basicInfo.driverName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          bus.basicInfo.conductor
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
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
    setSelectedIndex(
      (selectedIndex - 1 + filteredBuses.length) % filteredBuses.length
    );
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

          {/* Clear Button */}
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
          Found {filteredBuses.length} bus
          {filteredBuses.length !== 1 ? "es" : ""} matching {searchTerm}
        </div>
      )}

      {/* Bus Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBuses.map((bus, i) => (
          <div
            key={`${bus.busNumber}-${i}`}
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
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBuses.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No buses found matching your search.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Clear search and show all buses
          </button>
        </div>
      )}

      {/* Modal for Details */}
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
            </div>
            <div>
              <p>
                <span className="font-semibold">Start-End:</span>{" "}
                {selectedBus.moreInfo.startTime} - {selectedBus.moreInfo.endTime}
              </p>
              <p>
                <span className="font-semibold">Driver Contact:</span>{" "}
                {selectedBus.moreInfo.driverContact}
              </p>
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
