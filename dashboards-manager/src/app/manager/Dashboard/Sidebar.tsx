// /app/dashboard/Sidebar.tsx
"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  LayoutDashboard,
  Bus,
  Map,
  Users,
  UserCheck,
  //UserCog,
  Bell,
  FileText,
  Settings,
  UserPlus,
  History,
} from "lucide-react";

const items = [
  { key: "Overview", icon: LayoutDashboard },
  { key: "Buses", icon: Bus },
  { key: "Routes", icon: Map },
  { key: "Conductors", icon: Users },
  { key: "Drivers", icon: UserCheck },
  { key: "Conductor Assign", icon: UserPlus },
  { key: "Drivers Assign", icon: UserPlus },
  { key: "Trip History", icon: History },
//  { key: "Managers", icon: UserCog },
  { key: "Notifications", icon: Bell },
  { key: "Reports", icon: FileText },
  { key: "Settings", icon: Settings },
] as const;

export type DashboardPageKey = (typeof items)[number]["key"];

interface SidebarProps {
  selected: DashboardPageKey;
  onSelect: Dispatch<SetStateAction<DashboardPageKey>>;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="h-24 flex items-center justify-center bg-blue-600 text-white text-2xl font-bold shadow-md">
        Manager Dashboard
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition text-black font-bold ${
              selected === key ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            <Icon className={`h-5 w-5 ${selected === key ? "text-white" : "text-black"}`} />
            {key}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
