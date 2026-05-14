"use client";

import ChevronIcon from "./ChevronIcon";

export default function MobileControls({
  locations,
  recentIncidents,
  fieldWorkers,
  activeLocation,
  showLocations,
  setShowLocations,
  showIncidents,
  setShowIncidents,
  isTracking,
  onStartTracking,
  onStopTracking,
  profile,
}) {
  return (
    <div className="lg:hidden flex flex-col gap-2 p-2 bg-gray-50 border-b border-gray-200 shrink-0 relative z-10">
      {/* Top row: Locations and Incidents toggles */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setShowLocations(!showLocations);
            setShowIncidents(false);
          }}
          className="flex-1 flex items-center justify-between px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors active:scale-95"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: activeLocation.color }} />
            <span className="text-xs sm:text-sm">Locations ({locations.length})</span>
          </span>
          <ChevronIcon isOpen={showLocations} />
        </button>

        <button
          onClick={() => {
            setShowIncidents(!showIncidents);
            setShowLocations(false);
          }}
          className="flex-1 flex items-center justify-between px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors active:scale-95"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs sm:text-sm">Incidents ({recentIncidents.length})</span>
          </span>
          <ChevronIcon isOpen={showIncidents} />
        </button>
      </div>

      {/* GPS Tracking button */}
      {profile?.id ? (
        <button
          onClick={isTracking ? onStopTracking : onStartTracking}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 active:scale-95 shadow-sm ${
            isTracking
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          {isTracking ? (
            <>
              <span className="w-2.5 h-2.5 rounded-sm bg-white/90 animate-pulse" />
              <span>Stop Sharing Location</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Share My Location</span>
            </>
          )}
        </button>
      ) : (
        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 active:scale-95 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Login to Share Location</span>
        </button>
      )}

      {/* Active field workers strip */}
      {fieldWorkers.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800">
              {fieldWorkers.length} Field Worker{fieldWorkers.length !== 1 ? "s" : ""} Active
            </span>
          </div>
          <span className="text-xs text-emerald-600 font-medium">
            {fieldWorkers.filter((w) => w.isMoving).length} Moving
          </span>
        </div>
      )}
    </div>
  );
}