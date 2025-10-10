"use client";
import React, { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import axios from "axios";

interface Conductor {
  id: number;
  fullname: string;
  phone: string;
  gender: string;
  role: string;
}

export default function ConductorsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const [conductors, setConductors] = useState<Conductor[]>([]);
  const [newConductor, setNewConductor] = useState({
    fullname: "",
    phone: "",
    gender: "",
    role: "CONDUCTOR",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [infoMsg, setInfoMsg] = useState<string>("");

  const getToken = (): string | null => {
    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      return stored || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchConductors = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${apiUrl}/driver/AllCondutor`, {
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
        console.log(res, 'form res of manager dashboard')
        const data = await res.json();
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
        const normalized: Conductor[] = list.map((c: any, idx: number) => ({
          id: c.id ?? idx,
          fullname: c.fullname ?? c.name ?? "",
          phone: c.phone ?? "",
          gender: c.gender ?? c.Gender ?? "",
          role: c.role ?? "",
        }));

        setConductors(normalized);
      } catch (e) {
        console.error("Error fetching conductors", e);
      }
    };

    fetchConductors();
  }, []);

  const addConductor = async () => {
    setErrorMsg("");
    setInfoMsg("");

    // Validate fields
    if (!newConductor.fullname || !newConductor.phone || !newConductor.gender || !newConductor.role) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setErrorMsg("Unauthorized: missing token");
        return;
      }

      const response = await axios.post(`${apiUrl}/manager/createdriver`,{
          fullname: newConductor.fullname,
          phone: newConductor.phone,
          gender: newConductor.gender,
          role: newConductor.role,
        },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response, "from response");

      // if (!response.ok) {
      //   const text = await response.text();
      //   setErrorMsg(`Request failed (${response.status}): ${text || "Unknown error"}`);
      //   return;
      // }

      // const data = await response.json().catch(() => ({}));
      // console.log(data.message, "from data");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const createdRaw: any =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // (data as any)?.result?.result?.[0] ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // (data as any)?.result ??
        // data;

      // const created: Conductor = {
      //   id: createdRaw?.id ?? Date.now(),
      //   fullname: createdRaw?.fullname ?? newConductor.fullname,
      //   phone: createdRaw?.phone ?? newConductor.phone,
      //   gender: createdRaw?.gender ?? newConductor.gender,
      //   role: createdRaw?.role ?? newConductor.role,
      // };

      // setConductors((prev) => [...prev, created]);
      setInfoMsg("Conductor created successfully.");
      setNewConductor({
        fullname: "",
        phone: "",
        gender: "",
        role: "CONDUCTOR"
      });
    } catch {
      setErrorMsg("Network error while creating conductor.");
    }
  };

  const deleteConductor = (id: number) => {
    setConductors(conductors.filter((c) => c.id !== id));
  };

  const saveEdit = () => {
    if (!newConductor.fullname || !newConductor.phone || !newConductor.gender || !newConductor.role) return;

    setConductors(
      conductors.map((c) =>
        c.id === editingId ? { ...c, ...newConductor } : c
      )
    );
    setNewConductor({ fullname: "", phone: "", gender: "", role: "CONDUCTOR" });
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6 text-black">
      <h1 className="text-2xl font-bold">Manage Conductors</h1>

      {/* Error and Info Messages */}
      {errorMsg && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded px-4 py-2">
          {errorMsg}
        </div>
      )}
      {infoMsg && (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded px-4 py-2">
          {infoMsg}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 rounded px-2 py-1"
          value={newConductor.fullname}
          onChange={(e) =>
            setNewConductor({ ...newConductor, fullname: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="border border-gray-300 rounded px-2 py-1"
          value={newConductor.phone}
          onChange={(e) =>
            setNewConductor({ ...newConductor, phone: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Gender"
          className="border border-gray-300 rounded px-2 py-1"
          value={newConductor.gender}
          onChange={(e) =>
            setNewConductor({ ...newConductor, gender: e.target.value })
          }
        />
        {/* <input
          type="text"
          placeholder="Role"
          className="border border-gray-300 rounded px-2 py-1"
          value={newConductor.role}
          onChange={(e) =>
            setNewConductor({ ...newConductor, role: e.target.value })
          }
        /> */}

        {editingId ? (
          <button
            className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
            onClick={saveEdit}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
            onClick={addConductor}
          >
            <UserPlus size={16} className="mr-1" /> Add
          </button>
        )}
      </div>

      {/* Conductors List */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {conductors.map((conductor) => (
          <div
            key={conductor.id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{conductor.fullname}</p>
              <p className="text-sm text-gray-600">Phone: {conductor.phone}</p>
              <p className="text-sm text-gray-600">Gender: {conductor.gender}</p>
              <p className="text-sm text-gray-600">Role: {conductor.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => deleteConductor(conductor.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
