"use client";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { REPORT_DATA, STATUS_META, MAP_CENTER, MAP_ZOOM } from "@/lib/data";
import L from "leaflet";

export default function MapArea({ selectedId, onSelectReport }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    import("leaflet/dist/leaflet.css");
  }, []);

  // Create custom map pin icons for each status
  const createCustomIcon = (status) => {
    const color = STATUS_META[status]?.hex || "#6B7280";
    return L.divIcon({
      html: `
        <div style="
          color: ${color};
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: "custom-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  };

  if (!isClient) {
    return (
      <div className="flex-1 bg-stone-50 relative">
        <div className="absolute inset-0 flex items-center justify-center text-stone-400">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="text-sm">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-stone-50 relative">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {REPORT_DATA.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createCustomIcon(report.status)}
            eventHandlers={{
              click: () => onSelectReport?.(report.id),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{report.title}</div>
                <div className="text-gray-600">{report.location}</div>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 rounded text-xs ${STATUS_META[report.status].color}`}
                  >
                    {STATUS_META[report.status].label}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
