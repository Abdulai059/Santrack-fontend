"use client";

import { INCIDENT_SEVERITY_CONFIG } from "@/lib/mapConstants";

export default function MobileIncidentsOverlay({
  isVisible,
  incidents,
  locations,
  onSelectIncident,
  onClose,
}) {
  if (!isVisible) return null;

  return (
    <div className="lg:hidden absolute inset-0 z-20 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.22em] uppercase text-gray-900 font-semibold">
            Recent Incidents
          </span>
          <span className="font-mono text-[10px] text-rose-500 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5 font-bold">
            {incidents.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-300 gap-3 py-12">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-stone-400 text-center font-medium">No incidents reported</p>
          </div>
        ) : (
          incidents.map((inc) => {
            const s = INCIDENT_SEVERITY_CONFIG[inc.severity] ?? INCIDENT_SEVERITY_CONFIG.medium;
            return (
              <button
                key={inc.id}
                onClick={() => {
                  const loc = locations.find((l) => l.id === inc.locationId);
                  if (loc) onSelectIncident(loc);
                }}
                className="w-full text-left rounded-xl border shadow-sm p-3.5 transition-all duration-150 hover:brightness-95 active:scale-98"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <div className="flex items-start gap-2.5 mb-2">
                  <span className="mt-1 relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                      style={{ background: s.dot }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ background: s.dot }}
                    />
                  </span>
                  <span className="text-base font-semibold text-gray-700 leading-tight flex-1">
                    {inc.title}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold shrink-0 mt-0.5 px-2 py-1 rounded-full"
                    style={{
                      color: s.lc,
                      background: `${s.lc}15`,
                      border: `1px solid ${s.lc}30`,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-5">
                  <span className="font-mono text-xs text-gray-500 truncate">{inc.location}</span>
                  <span className="font-mono text-xs text-gray-400 ml-2">{inc.time}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
