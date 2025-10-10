// /app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar, { DashboardPageKey } from "./Sidebar";
import DashboardPage from "../Dashboard/DashbordPage";
import DepotsPage from "../Dashboard/DepotsPage";
import NotificationsPage from "../Dashboard/Notificationspage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "../Dashboard/Settingspage";
import ManagersPage from "../Dashboard/ManagersPage";
import BusesPage from "../Dashboard/BusesPage";
import { jwtDecode } from "jwt-decode";

interface MyToken {
  dateOfBirth: string | null;
  email: string;
  gender: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [email, setEmail] = useState(decoded?.email || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  // Example Admin JWT (replace with real token from backend/localStorage)
  // const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gVXNlciIsInJvbGUiOiJBRE1JTiIsInBob25lIjoiOTAwMDAwMDAwIiwiaWF0IjoxNzU3MDUwMDAwfQ.-admin-demo-token";

  // const decodeJWT = (token: string) => {
  //   try {
  //     const base64Url = token.split(".")[1];
  //     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //     const jsonPayload = decodeURIComponent(
  //       atob(base64)
  //         .split("")
  //         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
  //         .join("")
  //     );
  //     return JSON.parse(jsonPayload);
  //   } catch {
  //     return null;
  //   }
  // };

  // const userInfo = decodeJWT(JWT_TOKEN);

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

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

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
  const profileUrl = decoded?.profile ? `${apiUrl}/uploads/CommentImages/${decoded.profile}` : "/default-avatar.png";
// console.log(profileUrl,'from profile')
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
                <div className="text-xs text-gray-500">Dashboard Admin</div>
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
                    src={profileUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">
                    {decoded?.name || "Admin"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {decoded?.role || "ADMIN"}
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full text-left"
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
                        d="M15.232 5.232a2.5 2.5 0 113.536 3.536L7.5 20.036H3v-4.5l12.232-12.304z"
                      />
                    </svg>

                    Update profile
                  </button>

                  {isEditing && (
                    <div className="px-4 py-3 space-y-3 text-black">

                      <div className="flex gap-5">
                        <div className="relative w-20 h-20">
                          <label
                            htmlFor="profile-upload"
                            className="cursor-pointer w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden border-2 border-dashed border-gray-400 hover:bg-gray-300"
                          >
                            {preview ? (
                              <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <svg
                                className="w-10 h-10 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                              </svg>
                            )}
                          </label>
                          <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setPreview(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>

                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">Name</label>
                          <input
                            type="text"
                            defaultValue={decoded?.name}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>

                      {/* Email + Send OTP */}
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 w-full"
                          onClick={() => {
                            // TODO: Call API to send OTP
                            alert(`OTP sent to ${email}`);
                            setOtpSent(true);
                          }}
                        >
                          Send OTP
                        </button>

                      {/* OTP Input (shows only after sending OTP) */}
                      {otpSent && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Enter OTP</label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      )}

                      {/* Gender */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Gender</label>
                        <select
                          defaultValue={decoded?.gender}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="NotToSay">Not to say</option>
                        </select>
                      </div>

                      {/* Save Button */}
                      <button
                        className="w-full bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700"
                        onClick={() => {
                          // TODO: Send email + OTP + other fields to API
                          alert("Profile updated ✅");
                          setIsEditing(false);
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                  
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
