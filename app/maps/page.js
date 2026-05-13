"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import LocationSlugs from "../../components/maps/LocationSlugs";
import IncidentsPanel from "../../components/maps/IncidentsPanel";
import MapFooter from "../../components/maps/MapFooter";

const MapView = dynamic(() => import("@/components/maps/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50 text-blue-500 font-mono text-xs tracking-widest animate-pulse">
      LOADING MAP...
    </div>
  ),
});

export const locations = [
  {
    id: 1,
    name: "Tamale Central",
    slug: "tamale-central",
    coords: [9.4034, -0.8424],
    incidents: 5,
    color: "#ff4444",
  },
  {
    id: 2,
    name: "Savelugu Township",
    slug: "savelugu-township",
    coords: [9.6247, -0.8253],
    incidents: 2,
    color: "#ffaa00",
  },
  {
    id: 3,
    name: "Yendi Urban Area",
    slug: "yendi-urban-area",
    coords: [9.4423, -0.0095],
    incidents: 1,
    color: "#ff6600",
  },
  {
    id: 4,
    name: "Walewale Community",
    slug: "walewale-community",
    coords: [10.3696, -0.4197],
    incidents: 3,
    color: "#ff4444",
  },
  {
    id: 5,
    name: "Damongo District",
    slug: "damongo-district",
    coords: [9.0833, -1.8167],
    incidents: 1,
    color: "#ffaa00",
  },
  {
    id: 6,
    name: "Bimbilla Area",
    slug: "bimbilla-area",
    coords: [8.8633, -0.05],
    incidents: 2,
    color: "#ff6600",
  },
  {
    id: 7,
    name: "Gushegu Zone",
    slug: "gushegu-zone",
    coords: [9.5167, -0.5167],
    incidents: 0,
    color: "#00cc66",
  },
];

export const recentIncidents = [
  {
    id: 1,
    title: "Flooded Latrine",
    location: "Tamale Central",
    locationId: 1,
    time: "12m ago",
    severity: "high",
  },
  {
    id: 2,
    title: "Contaminated Water Reported",
    location: "Savelugu Township",
    locationId: 2,
    time: "34m ago",
    severity: "high",
  },
  {
    id: 3,
    title: "Toilet Collapse After Heavy Rain",
    location: "Walewale Community",
    locationId: 4,
    time: "1h ago",
    severity: "high",
  },
  {
    id: 4,
    title: "Low Water Supply for Sanitation",
    location: "Damongo District",
    locationId: 5,
    time: "2h ago",
    severity: "medium",
  },
  {
    id: 5,
    title: "Blocked Drain Near School",
    location: "Yendi Urban Area",
    locationId: 3,
    time: "3h ago",
    severity: "medium",
  },
];

export default function MapsPage() {
  const [activeLocation, setActiveLocation] = useState(locations[0]);

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 font-['Syne',sans-serif] overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-gray-900 uppercase">
            Incident Monitor
          </span>
        </div>

        <h1 className="text-sm font-extrabold tracking-[0.4em] uppercase relative text-gray-900">
          Maps
          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-linear-to-r from-brand-primary to-brand-highlight rounded-full" />
        </h1>

        <div className="flex items-center gap-2 font-mono text-[10px] text-gray-00">
          <span className="w-2 h-2 rounded-full bg-green-700 animate-pulse" />
          LIVE
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        <LocationSlugs
          locations={locations}
          activeLocation={activeLocation}
          onSelect={setActiveLocation}
        />

        <MapView
          locations={locations}
          activeLocation={activeLocation}
          onSelectLocation={setActiveLocation}
        />

        <IncidentsPanel
          incidents={recentIncidents}
          locations={locations}
          onSelectLocation={setActiveLocation}
        />
      </div>

      {/* FOOTER */}
      <MapFooter activeLocation={activeLocation} />
    </div>
  );
}
