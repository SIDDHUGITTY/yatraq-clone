"use client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";


interface Driver {
  id: number;
  fullname: string;
  phone: string;
  Gender: string;
  role: string;
}

interface DecodedToken {
  name?: string;
  email?: string | null;
  dateOfBirth?: string | null;
  gender?: string;
  role?: string;
  profile?: string | null;
  phone?: string;
  iat?: number;
  exp?: number;
}

export default function DriversPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
    const [drivers, setDrivers] = useState<Driver[]>([]);
  const [newDriver, setNewDriver] = useState({
    fullname: "",
    phone: "",
    Gender: "",
    role: "DRIVER",
  });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [infoMsg, setInfoMsg] = useState<string>("");

  const getToken = (): string | null => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return stored || null;
    } catch {
      console.log('this token is invalid')
      return null;
    }
  };

  const decodeJWT = (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
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

  // // Decode token on component mount (commented in fresh form)
  // React.useEffect(() => {
  //   const decoded = decodeJWT(JWT_TOKEN);
  //   setDecodedToken(decoded);
  //   if (decoded) {
  //     console.log('Decoded token:', decoded);
  //   }
  // }, []);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("Unauthorized: missing token");
          return;
        }

        const res = await fetch(`${apiUrl}/driver/AllDrivers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`Request failed (${res.status}): ${text || "Unknown error"}`);
          return;
        }

        const data = await res.json();
        console.log(data,'from all driver page')
        // Try common shapes and normalize
        const list = Array.isArray(data)
          ? data
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Array.isArray((data as any)?.result)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (data as any).result
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.isArray((data as any)?.data)
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (data as any).data
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              Array.isArray((data as any)?.result?.result)
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (data as any).result.result
                : [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized: Driver[] = list.map((d: any, idx: number) => ({
          id: d.id ?? idx,
          fullname: d.fullname ?? d.name ?? "",
          phone: d.phone ?? "",
          Gender: d.Gender ?? d.gender ?? "",
          role: d.role ?? "",
        }));
        setDrivers(normalized);
      } catch (error) {
        console.error("Error fetching driver:", error);
      }
    };

    fetchDriver();
  }, []);


  const deleteDriver = async (phone: string) => {
    try{
      const res = await axios.get(`http://192.168.1.44:3000/manager/Deletebus?busnumber=${phone}`)
      console.log(res.data)
    }catch(err){
      console.log(err,'from catch error')
    }
  };


  // Add Driver
  const addDriver = async () => {
    setErrorMsg("");
    setInfoMsg("");

    // Authorization checks using JWT
    const token = getToken();
    console.log(token,'from driver page this is token')
    if (!token) {
      setErrorMsg("Unauthorized: missing token");
      return;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      setErrorMsg("Unauthorized: invalid token");
      return;
    }
    // if (decoded.exp && Date.now() / 1000 > decoded.exp) {
    //   setErrorMsg("Unauthorized: token expired");
    //   return;
    // }
    if ((decoded.role || "").toUpperCase() !== "MANAGER") {
      setErrorMsg("Role is not matched. Only MANAGER can create drivers.");
      return;
    }

    // Validate input
    if (!newDriver.fullname || !newDriver.phone || !newDriver.Gender || !newDriver.role) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    // Send to API
    console.log(`${apiUrl}/manager/createdriverr ,from driver page`)
    try {
      const res = await fetch(`${apiUrl}/manager/createdriver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDriver),
      });

      if (!res.ok) {
        const text = await res.text();
        setErrorMsg(`Request failed (${res.status}): ${text || "Unknown error"}`);
        console.log(text,'this is text ')
        return;
      }
      console.log(res,'this is res')
      // const data = await res.json().catch(() => ({}));
      // const created = data?.result?.result?.[0] ?? {
      //   id: Date.now(),
      //   ...newDriver,
      // };
      // setDrivers((prev) => [...prev, created]);
      // setInfoMsg("Driver created successfully.");
    } catch {
      setErrorMsg("Network error while creating driver.");
      return;
    }

    // Reset form after success
    setNewDriver({
      fullname: "",
      phone: "",
      Gender: "",
      role: "",
    });
  };
  //render
  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-6">Drivers Management</h2>

      {errorMsg && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded px-4 py-2">
          {errorMsg}
        </div>
      )}
      {infoMsg && (
        <div className="mb-4 bg-green-50 text-green-700 border border-green-200 rounded px-4 py-2">
          {infoMsg}
        </div>
      )}

      {/* Token Information Display - commented in fresh form */}
      {false && (
        <div />
      )}

      {/* Add Driver Form */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Add Driver</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Full Name"
            value={newDriver.fullname}
            onChange={(e) =>
              setNewDriver({ ...newDriver, fullname: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Phone"
            value={newDriver.phone}
            onChange={(e) =>
              setNewDriver({ ...newDriver, phone: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Gender"
            value={newDriver.Gender}
            onChange={(e) =>
              setNewDriver({ ...newDriver, Gender: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Role"
            value={newDriver.role}
            onChange={(e) =>
              setNewDriver({ ...newDriver, role: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <button
            onClick={addDriver}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Drivers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white border border-gray-300 rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold text-lg">{driver.fullname}</h4>
              <p className="text-gray-600">Phone: {driver.phone}</p>
              <p className="text-gray-600">Gender: {driver.Gender}</p>
              <p className="text-gray-600">Role: {driver.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => deleteDriver(driver.phone)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                <Trash2 size={20}  />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
