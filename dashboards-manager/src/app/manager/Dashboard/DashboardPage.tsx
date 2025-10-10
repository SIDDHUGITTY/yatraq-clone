"use client";
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";

interface DashboardStats {
  medical_Assistances: string;
  totalBusCount: string;
  totalConductorAssignment: string;
  totalDriverAssignment: string;
  totalbreakdown: string;
  totalfeedbreakdown: string;
  totalwomansafty: string;
}

const OnTimeBarChart = () => {
  const onTimeData = [
    { day: "Mon", onTime: 92 },
    { day: "Tue", onTime: 88 },
    { day: "Wed", onTime: 95 },
    { day: "Thu", onTime: 90 },
    { day: "Fri", onTime: 87 },
    { day: "Sat", onTime: 93 },
    { day: "Sun", onTime: 89 },
  ];

  const maxValue = Math.max(...onTimeData.map(d => d.onTime));

  return (
    <div className="h-40 flex items-end justify-between gap-2">
      {onTimeData.map((data, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="text-xs text-gray-600 mb-1">{data.onTime}%</div>
          <div
            className="w-10 bg-blue-500 rounded-t-sm hover:bg-blue-600"
            style={{ height: `${(data.onTime / maxValue) * 120}px` }}
          ></div>
          <div className="text-xs text-gray-500 mt-1">{data.day}</div>
        </div>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const [numbers, setNumbers] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${apiUrl}/visualizationchat/visualization`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
        );
        setNumbers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <p className="text-gray-500 text-sm">Drivers</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {numbers?.totalDriverAssignment}
          </h2>
          <p className="text-xs text-green-500 mt-1">+1 today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Conductors</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {numbers?.totalConductorAssignment}
          </h2>
          <p className="text-xs text-gray-400 mt-1">+2 today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Mmedical Assistances</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {numbers?.medical_Assistances}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Open alerts</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total Womansafty reports</p>
          <h2 className="text-3xl font-bold text-indigo-600 mt-2">
            {numbers?.totalwomansafty}
          </h2>
          <p className="text-xs text-gray-400 mt-1">System-wide</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total breakdown reports</p>
          <h2 className="text-3xl font-bold text-indigo-600 mt-2">
            {numbers?.totalbreakdown}
          </h2>
          <p className="text-xs text-gray-400 mt-1">System-wide</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total feedbacks</p>
          <h2 className="text-3xl font-bold text-indigo-600 mt-2">
            {numbers?.totalfeedbreakdown}
          </h2>
          <p className="text-xs text-gray-400 mt-1">System-wide</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Total buses</p>
          <h2 className="text-3xl font-bold text-indigo-600 mt-2">
            {numbers?.totalBusCount}
          </h2>
          <p className="text-xs text-gray-400 mt-1">System-wide</p>
        </div>
      </div>
      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-600">
          On-time Performance (last 7d)
        </h3>
        <OnTimeBarChart />
      </div>
    </div>
  );
};

export default DashboardPage;