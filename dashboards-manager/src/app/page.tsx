import React from 'react'
import page from '../Components/login'

function Page() {
  return (
     <div><Page/></div>
    
  )
}

export default page


// import { redirect } from "next/navigation";

// export default function HomePage() {
//   // redirect("/manager/login");
// }
// /app/dashboard/page.tsx
{/*"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar, { DashboardPageKey } from "./admin/Dashboard/Sidebar";

// ✅ make sure these filenames exist inside /app/dashboard/
import DashboardPage from "./admin/Dashboard/DashbordPage";
import DepotsPage from "./admin/Dashboard/DepotsPage";
import NotificationsPage from "./admin/Dashboard/Notificationspage";
import ReportsPage from "./admin/Dashboard/ReportsPage";
import SettingsPage from "./admin/Dashboard/Settingspage";
import ManagersPage from "./admin/Dashboard/ManagersPage";
import BusesPage from "./admin/Dashboard/BusesPage";

export default function Page() {
  const [selected, setSelected] = useState<DashboardPageKey>("Overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Example Admin JWT (replace with real token from backend/localStorage)
  const JWT_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gVXNlciIsInJvbGUiOiJBRE1JTiIsInBob25lIjoiOTAwMDAwMDAwIiwiaWF0IjoxNzU3MDUwMDAwfQ.-admin-demo-token";

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const userInfo = decodeJWT(JWT_TOKEN);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login"; // redirect to Admin login page
  };

  const render = () => {
    switch (selected) {
      case "Overview":
        return <DashboardPage />;
      case "Buses":
        return <BusesPage />;
      case "Managers":
        return <ManagersPage />;
      case "Depot":
        return <DepotsPage />;
      case "Notifications":
        return <NotificationsPage />;
      case "Reports":
        return <ReportsPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selected={selected} onSelect={setSelected} />
      <main className="flex-1 p-0">
        {/* Top Navbar */}
   {/*     <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Brand */}
      {/*      <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                <Image
                  src="/btslogo.png"
                  alt="BTS Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">YatraQ</div>
                <div className="text-xs text-gray-500">Dashboard Admin</div>
              </div>
            </div>

            {/* Profile */}
          {/*  <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-semibold text-sm">
                  {userInfo?.name?.charAt(0) || "A"}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">
                    {userInfo?.name || "Admin"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userInfo?.role || "ADMIN"}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full text-white flex items-center justify-center font-semibold">
                        {userInfo?.name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {userInfo?.name || "Admin"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {userInfo?.phone || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {userInfo?.role || "ADMIN"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">{render()}</div>
      </main>
    </div>
  );
}*/}