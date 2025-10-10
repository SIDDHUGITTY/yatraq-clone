// /app/admin/Sidebar.tsx
"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  LayoutDashboard,
  Bus,
  UserCheck,
  UserCog,
  Bell,
  FileText,
  Settings,
} from "lucide-react";

const items = [
  { key: "Overview", icon: LayoutDashboard },
  { key: "Buses", icon: Bus },
  { key: "Depot", icon: UserCheck },
  { key: "Managers", icon: UserCog },
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
        Admin Dashboard
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition font-bold ${
              selected === key ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-black"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                selected === key ? "text-white" : "text-black"
              }`}
            />
            {key}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
