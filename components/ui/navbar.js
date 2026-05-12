"use client";

import {
  Bell,
  ChevronDown,
  Droplets,
  Map,
  ClipboardList,
  BarChart2,
  Settings,
  Search,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "map", label: "Map", Icon: Map },
  { id: "reports", label: "Reports", Icon: ClipboardList },
  { id: "analytics", label: "Analytics", Icon: BarChart2 },
  { id: "settings", label: "Settings", Icon: Settings },
];

export default function Topbar({ activeNav, onNavChange }) {
  return (
    <header className="h-[72px] px-6 border-b border-white/40 bg-white/80 backdrop-blur-xl shadow-sm flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Droplets className="w-5 h-5 text-white" />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-stone-900">
              Sani<span className="text-emerald-600">Track</span>
            </h1>

            <p className="text-xs text-stone-500">
              Smart sanitation monitoring
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-stone-200" />

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-2xl
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-stone-900 text-white shadow-md"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                  }
                `}
              >
                <item.Icon
                  className={`w-4 h-4 ${active ? "text-emerald-400" : ""}`}
                />

                {item.label}

                {active && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-2xl px-3 h-11 w-64">
          <Search className="w-4 h-4 text-stone-400" />

          <input
            type="text"
            placeholder="Search reports..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-stone-400"
          />
        </div>

        {/* Notification */}
        <button className="relative w-11 h-11 rounded-2xl border border-stone-200 bg-white hover:bg-stone-100 transition flex items-center justify-center">
          <Bell className="w-5 h-5 text-stone-600" />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>

        {/* User */}
        <button className="flex items-center gap-3 bg-white border border-stone-200 hover:bg-stone-50 transition rounded-2xl px-3 py-2 shadow-sm">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow">
            AI
          </div>

          {/* User Info */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-stone-900 leading-none">
              Amadu Issah
            </p>

            <p className="text-xs text-stone-500 mt-1">WASH Officer</p>
          </div>

          <ChevronDown className="w-4 h-4 text-stone-400" />
        </button>
      </div>
    </header>
  );
}
