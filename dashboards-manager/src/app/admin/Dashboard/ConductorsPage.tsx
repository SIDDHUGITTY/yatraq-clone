// "use client";

// import React, { useState } from "react";
// import { Pencil, Trash2, UserPlus } from "lucide-react";

// interface Conductor {
//   id: number;
//   name: string;
//   phone: string;
//   shift: string;
// }

// export default function ConductorsPage() {
//   const [conductors, setConductors] = useState<Conductor[]>([]);
//   const [newConductor, setNewConductor] = useState({ name: "", phone: "", shift: "" });
//   const [editingId, setEditingId] = useState<number | null>(null);

//   const addConductor = () => {
//     if (!newConductor.name || !newConductor.phone || !newConductor.shift) return;
//     setConductors([
//       ...conductors,
//       { id: Date.now(), ...newConductor }
//     ]);
//     setNewConductor({ name: "", phone: "", shift: "" });
//   };

//   const deleteConductor = (id: number) => {
//     setConductors(conductors.filter(c => c.id !== id));
//   };

//   const startEdit = (id: number) => {
//     const conductor = conductors.find(c => c.id === id);
//     if (conductor) {
//       setNewConductor({ name: conductor.name, phone: conductor.phone, shift: conductor.shift });
//       setEditingId(id);
//     }
//   };

//   const saveEdit = () => {
//     if (!newConductor.name || !newConductor.phone || !newConductor.shift) return;
//     setConductors(conductors.map(c => 
//       c.id === editingId ? { ...c, ...newConductor } : c
//     ));
//     setNewConductor({ name: "", phone: "", shift: "" });
//     setEditingId(null);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Manage Conductors</h1>

//       {/* Add/Edit Form inside grey card */}
//       <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-wrap gap-2">
//         <input
//           type="text"
//           placeholder="Conductor Name"
//           className="border border-gray-300 rounded px-2 py-1"
//           value={newConductor.name}
//           onChange={(e) => setNewConductor({ ...newConductor, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Phone Number"
//           className="border border-gray-300 rounded px-2 py-1"
//           value={newConductor.phone}
//           onChange={(e) => setNewConductor({ ...newConductor, phone: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Shift (Morning/Evening)"
//           className="border border-gray-300 rounded px-2 py-1"
//           value={newConductor.shift}
//           onChange={(e) => setNewConductor({ ...newConductor, shift: e.target.value })}
//         />

//         {editingId ? (
//           <button
//             className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
//             onClick={saveEdit}
//           >
//             Save
//           </button>
//         ) : (
//           <button
//             className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
//             onClick={addConductor}
//           >
//             <UserPlus size={16} className="mr-1" /> Add
//           </button>
//         )}
//       </div>

//       {/* List of Conductors in grey border cards */}
//       <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//         {conductors.map((conductor) => (
//           <div
//             key={conductor.id}
//             className="bg-white border border-gray-200 rounded-lg shadow p-4 flex justify-between items-center"
//           >
//             <div>
//               <p className="font-semibold">{conductor.name}</p>
//               <p className="text-sm text-gray-600">{conductor.phone}</p>
//               <p className="text-sm text-gray-600">Shift: {conductor.shift}</p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => startEdit(conductor.id)}
//                 className="bg-yellow-500 text-white px-2 py-1 rounded"
//               >
//                 <Pencil size={16} />
//               </button>
//               <button
//                 onClick={() => deleteConductor(conductor.id)}
//                 className="bg-red-500 text-white px-2 py-1 rounded"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
