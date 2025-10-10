"use client";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export interface Manager {
  depot_code: string | null;
  depot_location: string | null;
  depot_name: string | null;
  email: string | null;
  gender: string;
  fullname: string;
  phone: string;
  role: string;
}


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

// interface ApiError {
//   message: string;
//   error: string;
//   statusCode: number;
// }


export default function ManagersPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const [managers, setManagers] = useState<Manager[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<MyToken | null>(null);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newManager, setNewManager] = useState<Omit<Manager, "id">>({
    fullname: "",
    phone: "",
    gender: "",
    role: "MANAGER",
    depot_code: null,
    depot_location: null,
    depot_name: null,
    email: null,
  });

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

  // Add Manager (POST to backend)
  const addManager = async () => {
    // if (!newManager.fullname || !newManager.phone || !newManager.gender) {
    //   toast.error('missing filds, fill all inputs', {
    //     duration: 3000,
    //   });
    //   return;
    // }

    setLoading(true);
    setErrorMsg(null);
    console.log(newManager);
    try {
      console.log(token, 'from admin page')
      if (!token) {
        setErrorMsg("Unauthorized: missing token");
        return;
      }
      const response = await fetch(`${apiUrl}/admin/createmanager`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newManager),
      });
      console.log(response, 'from manager')

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create manager");
      }

      // Reset form
      setNewManager({
        fullname: "",
        phone: "",
        gender: "",
        role: "MANAGER",
        depot_code: null,
        depot_location: null,
        depot_name: null,
        email: null,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  //see all managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        if (!token) {
          toast.error('you are Unauthorized: missing token', {
            duration: 3000,
          })
          return
        }
        const { data } = await axios.get(`${apiUrl}/manager/Allmanager`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(data.result, 'raw data')
        setManagers(data.result)
        // if (!res.ok) {
        //   const text = await res.text();
        //   console.error(`Request failed (${res.status}): ${text || "Unknown error"}`);
        //   return;
        // }
        // const data = await res.json();
        // // Normalize list
        // const list = Array.isArray(data)
        //   ? data
        //   : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   Array.isArray((data as any)?.result)
        //   ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     (data as any).result
        //   : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   Array.isArray((data as any)?.data)
        //   ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     (data as any).data
        //   : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   Array.isArray((data as any)?.result?.result)
        //   ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     (data as any).result.result
        //   : [];
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const normalized: Manager[] = list.map((m: any, idx: number) => ({
        //   id: m.id ?? idx,
        //   fullName: m.fullName ?? m.fullname ?? "",
        //   phone: m.phone ?? "",
        //   Gender: m.Gender ?? m.gender ?? "",
        //   role: m.role ?? "",
        // }));
        // setManagers(normalized);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, [token]);

  useEffect(() => {
    console.log(managers, "updated state data");
  }, [managers]);

  // Delete (local only for now)
  // const deleteManager = (id: number) => {
  //   setManagers(managers.filter((m) => m.id !== id));
  // };
  // Edit (local only for now)
  // const startEditing = (manager: Manager) => {
  //   setEditingManager(manager);
  // };

  // const saveEdit = () => {
  //   if (editingManager) {
  //     setManagers(
  //       managers.map((m) => (m.id === editingManager.id ? editingManager : m))
  //     );
  //     setEditingManager(null);
  //   }
  // };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-6">Managers Management</h2>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMsg}</div>
      )}

      {/* Add Manager Form */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Add Manager</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Full Name"
            value={newManager.fullname}
            onChange={(e) =>
              setNewManager({ ...newManager, fullname: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Phone"
            value={newManager.phone}
            onChange={(e) =>
              setNewManager({ ...newManager, phone: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Gender"
            value={newManager.gender}
            onChange={(e) =>
              setNewManager({ ...newManager, gender: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          {/* <input
            type="text"
            placeholder="Role"
            value={newManager.role}
            onChange={(e) =>
              setNewManager({ ...newManager, role: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          /> */}
          <button
            onClick={addManager}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Managers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {managers.map((manager) => (
          <div
            key={manager.id}
            className="bg-white shadow p-4 rounded-lg border border-gray-300"
          >
            {editingManager?.id === manager.id ? (
              <>
                <input
                  type="text"
                  value={editingManager?.fullname}
                  onChange={(e) =>
                    setEditingManager({
                      ...editingManager,
                      fullname: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  value={editingManager?.phone}
                  onChange={(e) =>
                    setEditingManager({
                      ...editingManager,
                      phone: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  value={editingManager?.Gender}
                  onChange={(e) =>
                    setEditingManager({
                      ...editingManager,
                      Gender: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  value={editingManager?.role}
                  onChange={(e) =>
                    setEditingManager({
                      ...editingManager,
                      role: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingManager(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="font-bold text-lg">{manager.fullname}</h4>
                <p className="text-gray-600">Phone: {manager.phone}</p>
                <p className="text-gray-600">Gender: {manager.Gender}</p>
                <p className="text-gray-600">Role: {manager.role}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEditing(manager)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteManager(manager.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))} */}
        {managers.map((manager, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">{manager.fullname || "N/A"}</h2>
            <p><span className="font-bold">Role:</span> {manager.role}</p>
            <p><span className="font-bold">Phone:</span> {manager.phone}</p>
            <p><span className="font-bold">Email:</span> {manager.email || "N/A"}</p>
            <p><span className="font-bold">Depot:</span> {manager.depot_name || "N/A"}</p>
            <p><span className="font-bold">Location:</span> {manager.depot_location || "N/A"}</p>
            <p><span className="font-bold">Code:</span> {manager.depot_code || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
