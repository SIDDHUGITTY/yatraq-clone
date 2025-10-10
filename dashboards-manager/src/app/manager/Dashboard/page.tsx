"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar, { DashboardPageKey } from "./Sidebar";
import DashboardPage from "./DashboardPage";
import BusesPage from "./BusesPage";
// import RoutesPage from "./";
import ConductorsPage from "./ConductorsPage";
import ConductorAssign from "./ConductorAssign";
import DriversPage from "./DriversPage";
import DriverAssign from "./DriverAssign";
//import ManagersPage from "./ManagersPage";
//import SchedulesPage from "./SchedulesPage";
//import LiveTrackingPage from "./LiveTrackingPage";
//import MaintenancePage from "./MaintainancePage";
import NotificationsPage from "./NotificationsPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import TripHistory from "./TripHistory";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./RoutesPage"), {
    ssr: false,
  });

interface MyToken {
  dateOfBirth: string | null;
  email: string;
  gender: string | null;
  iat: number;
  name: string;
  phone: string;
  profile: string | null;
  role: string;
}

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const [selected, setSelected] = useState<DashboardPageKey>("Overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<MyToken | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);


  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    console.log(storedToken, 'this is token')
    if (storedToken) {
      setToken(storedToken);

      try {
        const decodedToken = jwtDecode<MyToken>(storedToken);
        setDecoded(decodedToken);
        // console.log("Decoded token:", decodedToken);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [token]);

  console.log(decoded, 'this is decoded token')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  

  const render = () => {
    switch (selected) {
      case "Overview":
        return <DashboardPage />;
      case "Buses":
        return <BusesPage />;
      case "Routes":
        return <MapWithNoSSR />;
      case "Conductors":
        return <ConductorsPage />
      case "Conductor Assign":
        return <ConductorAssign />;
      case "Drivers":
        return <DriversPage />;
      case "Drivers Assign":
        return <DriverAssign />;
      case "Trip History":
        return <TripHistory />;
      /*    case "Managers":
            return <ManagersPage />;
         /* case "Schedules":
            return <SchedulesPage />;
          case "Live Tracking":
            return <LiveTrackingPage />;
          case "Maintenance":
            return <MaintenancePage />;*/
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

  const profileUrl = decoded?.profile ? `${apiUrl}uploads/${decoded.profile}` : "/default-avatar.png";
  console.log(profileUrl, 'profile url from manager')
  console.log(decoded?.profile, 'this is profile link')
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selected={selected} onSelect={setSelected} />
      <main className="flex-1 p-0">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">

            {/* Brand */}
            <div className="flex items-center gap-3">
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
                <div className="text-xs text-gray-500">Dashboard {decoded?.role}</div>
              </div>
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-semibold text-sm overflow-hidden">
                  <img
                    src={'https://bustrackingsystemnew-production.up.railway.app/uploads/CommentImages/1758552856843-componentdiagram.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">
                    {decoded?.name || "Manager"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {decoded?.role || "Manager"}
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
                      <div className="w-10 h-10 bg-purple-600 rounded-full text-white flex items-center justify-center font-semibold overflow-hidden">
                        <img
                          src={profileUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          Name:{decoded?.name || "Admin"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Phone no:{decoded?.phone || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          Role:{decoded?.role || "ADMIN"}

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
}

