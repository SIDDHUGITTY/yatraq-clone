"use client";

import React, { useState } from "react";

interface DriverAssignment {
  id: number;
  driverNumber: string;
  busNumber: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function DriverAssign() {
  const [assignments, setAssignments] = useState<DriverAssignment[]>([
    {
      id: 1,
      driverNumber: "DR001",
      busNumber: "TS09AB1234",
      date: "2025-09-04",
      startTime: "06:00 AM",
      endTime: "02:00 PM",
    },
    {
      id: 2,
      driverNumber: "DR002",
      busNumber: "TS09CD5678",
      date: "2025-09-04",
      startTime: "02:00 PM",
      endTime: "10:00 PM",
    },
  ]);

  const [newAssignment, setNewAssignment] = useState({
    driverNumber: "",
    busNumber: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [editingAssignment, setEditingAssignment] =
    useState<DriverAssignment | null>(null);

  // Add Assignment
  const addAssignment = () => {
    if (
      !newAssignment.driverNumber ||
      !newAssignment.busNumber ||
      !newAssignment.date ||
      !newAssignment.startTime ||
      !newAssignment.endTime
    )
      return;

    setAssignments([
      ...assignments,
      {
        id: Date.now(),
        driverNumber: newAssignment.driverNumber,
        busNumber: newAssignment.busNumber,
        date: newAssignment.date,
        startTime: newAssignment.startTime,
        endTime: newAssignment.endTime,
      },
    ]);

    setNewAssignment({
      driverNumber: "",
      busNumber: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  // Delete Assignment
  const deleteAssignment = (id: number) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  // Edit Assignment
  const startEditing = (assignment: DriverAssignment) => {
    setEditingAssignment(assignment);
  };

  const saveEdit = () => {
    if (editingAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingAssignment.id ? editingAssignment : a
        )
      );
      setEditingAssignment(null);
    }
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-6">Driver Assignment</h2>

      {/* Add Assignment Form */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Add Assignment</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Driver Number"
            value={newAssignment.driverNumber}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                driverNumber: e.target.value,
              })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="Bus Number"
            value={newAssignment.busNumber}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, busNumber: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          {/*<input
            type="date"
            value={newAssignment.date}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, date: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40 bg-white"
          />*/}
          <input
            type="text"
            placeholder="Start Time (e.g. 06:00 AM)"
            value={newAssignment.startTime}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                startTime: e.target.value,
              })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="End Time (e.g. 02:00 PM)"
            value={newAssignment.endTime}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                endTime: e.target.value,
              })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <button
            onClick={addAssignment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white shadow p-4 rounded-lg border border-gray-300"
          >
            {editingAssignment?.id === assignment.id ? (
              <>
                <input
                  type="text"
                  value={editingAssignment.driverNumber}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      driverNumber: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  value={editingAssignment.busNumber}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      busNumber: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                  type="date"
                  value={editingAssignment.date}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      date: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Start Time"
                  value={editingAssignment.startTime}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      startTime: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="End Time"
                  value={editingAssignment.endTime}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      endTime: e.target.value,
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
                    onClick={() => setEditingAssignment(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="font-bold text-lg">{assignment.driverNumber}</h4>
                <p className="text-gray-600">Bus No: {assignment.busNumber}</p>
                <p className="text-gray-600">Date: {assignment.date}</p>
                <p className="text-gray-600">
                  Time: {assignment.startTime} - {assignment.endTime}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEditing(assignment)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAssignment(assignment.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
