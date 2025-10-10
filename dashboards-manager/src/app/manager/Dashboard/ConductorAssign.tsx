"use client";

import React, { useState } from "react";

interface ConductorAssignment {
  id: number;
  conductorNumber: string;
  busNumber: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM or manual entry
  endTime: string; // HH:MM or manual entry
}

export default function ConductorAssign() {
  const [assignments, setAssignments] = useState<ConductorAssignment[]>([
    {
      id: 1,
      conductorNumber: "CN001",
      busNumber: "TS09AB1234",
      date: "2025-09-04",
      startTime: "08:00 AM",
      endTime: "12:00 PM",
    },
    {
      id: 2,
      conductorNumber: "CN002",
      busNumber: "TS09CD5678",
      date: "2025-09-04",
      startTime: "01:00 PM",
      endTime: "05:00 PM",
    },
  ]);

  const [newAssignment, setNewAssignment] = useState({
    conductorNumber: "",
    busNumber: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [editingAssignment, setEditingAssignment] =
    useState<ConductorAssignment | null>(null);

  // Add Assignment
  const addAssignment = () => {
    if (
      !newAssignment.conductorNumber ||
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
        conductorNumber: newAssignment.conductorNumber,
        busNumber: newAssignment.busNumber,
        date: newAssignment.date,
        startTime: newAssignment.startTime,
        endTime: newAssignment.endTime,
      },
    ]);

    setNewAssignment({
      conductorNumber: "",
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
  const startEditing = (assignment: ConductorAssignment) => {
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
      <h2 className="text-2xl font-bold mb-6">Conductor Assignment</h2>

      {/* Add Assignment Form */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Add Assignment</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Conductor Number"
            value={newAssignment.conductorNumber}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                conductorNumber: e.target.value,
              })
            }
            className="border border-gray-300 p-2 rounded w-48"
          />
          <input
            type="text"
            placeholder="Bus Number"
            value={newAssignment.busNumber}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, busNumber: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-44"
          />
          {/*
          <input
            type="date"
            value={newAssignment.date}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, date: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-44 bg-white"
          />*/}
          <input
            type="text"
            placeholder="Start Time (e.g. 08:00 AM)"
            value={newAssignment.startTime}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, startTime: e.target.value })
            }
            className="border border-gray-300 p-2 rounded w-40"
          />
          <input
            type="text"
            placeholder="End Time (e.g. 12:00 PM)"
            value={newAssignment.endTime}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, endTime: e.target.value })
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
                  value={editingAssignment.conductorNumber}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      conductorNumber: e.target.value,
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
               {/*} <input
                  type="date"
                  value={editingAssignment.date}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      date: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded w-full mb-2 bg-white"
                />*/}
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
                <h4 className="font-bold text-lg">{assignment.conductorNumber}</h4>
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
