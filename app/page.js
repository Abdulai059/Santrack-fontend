"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Topbar from "@/components/Topbar";
import StatsRow from "@/components/StatsRow";
import ReportSidebar from "@/components/ReportSidebar";

const MapArea = dynamic(() => import("@/components/MapArea"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-stone-50 relative">
      <div className="absolute inset-0 flex items-center justify-center text-stone-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-sm">Loading map...</div>
        </div>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [activeNav, setActiveNav] = useState("map");

  return (
    <div className="flex flex-col h-screen bg-stone-100 overflow-hidden">
      <Topbar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex flex-1 overflow-hidden gap-3 p-3">
        <div className="flex flex-col flex-1 overflow-hidden rounded-xl">
          <StatsRow />
          <MapArea selectedId={selectedId} onSelectReport={setSelectedId} />
        </div>

        <div className="w-96 rounded-xl overflow-hidden flex-shrink-0">
          <ReportSidebar
            selectedId={selectedId}
            onSelectReport={setSelectedId}
          />
        </div>
      </div>
    </div>
  );
}
