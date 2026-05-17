"use client";

import {
  Share2,
  Check,
  Copy,
  MapPin,
  X,
  Search,
  Activity,
  Users,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { PANEL_TYPES } from "@/lib/mapConstants";
import { useDropdown, useMapSearch, useShare } from "@/hooks/useMapHeader";

export default function MapHeader({
  rightPanel,
  setRightPanel,
  fieldWorkers = [],
  locations = [],
  communities = [],
  onSelectLocation,
  activeLocation,
  severityFilter = "all",
  setSeverityFilter,
  navigationDestination,
  onStopNavigation,
}) {
  const {
    query,
    setQuery,
    results,
    showResults,
    setShowResults,
    searchRef,
    clearSearch,
    handleSelect,
  } = useMapSearch(locations, communities);

  const { shareState, showTooltip, handleShare } = useShare(activeLocation);

  const severityDropdown = useDropdown();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-3 sm:h-16 sm:px-4 md:px-6">
      {/* Brand mark */}
      <div className="flex items-center gap-2 shrink-0">
        <Activity className="h-4 w-4 animate-pulse text-emerald-500" />
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-900 sm:text-[11px]">
          Sanitation GIS
        </span>
      </div>

      {/* Search */}
      <div
        ref={searchRef}
        className="relative mx-3 flex-1 max-w-[220px] sm:max-w-[260px] lg:max-w-[300px]"
      >
        <div className="flex h-9 items-center gap-2 overflow-hidden rounded-full border border-gray-300 bg-white px-1 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
          <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
            placeholder="Search locations..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 pr-1"
          />
          {query ? (
            <button
              onClick={clearSearch}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button className="h-7 rounded-full bg-brand-primary px-3 text-xs font-medium text-gray-900 transition active:scale-95 hover:bg-brand-primary-hover">
              Search
            </button>
          )}
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute top-full z-[9999] mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item, onSelectLocation)}
                className="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-stone-50"
              >
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: item.color || "#8b5cf6" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-gray-800">
                      {item.name}
                    </span>
                    <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {item.type}
                    {item.district && ` · ${item.district}`}
                  </p>
                </div>
                <MapPin className="h-4 w-4 text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {showResults && query && results.length === 0 && (
          <div className="absolute top-full z-[9999] mt-2 w-full rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-xl">
            <p className="text-sm text-gray-500">No results found</p>
          </div>
        )}
      </div>

      {/* Severity filter + navigation */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={severityDropdown.ref}>
          <button
            onClick={() => severityDropdown.setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-stone-50 active:scale-95"
          >
            <span>
              {severityFilter === "all"
                ? "All Severity"
                : severityFilter.toUpperCase()}
            </span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {severityDropdown.open && (
            <div className="absolute right-0 top-full z-[9999] mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {["all", "critical", "high", "medium", "low"].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSeverityFilter(level);
                    severityDropdown.setOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs transition hover:bg-stone-50 ${
                    severityFilter === level
                      ? "bg-emerald-50 font-medium text-emerald-700"
                      : "text-gray-700"
                  }`}
                >
                  {level === "all" ? "All Severity" : level.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-blue-500" />
          {navigationDestination ? (
            <button
              onClick={onStopNavigation}
              title="Stop navigation"
              className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm transition hover:bg-blue-100 active:scale-95"
            >
              <span className="max-w-[120px] truncate">
                {navigationDestination.name}
              </span>
              <X className="h-3 w-3" />
            </button>
          ) : (
            <span className="text-xs text-gray-400">No active route</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={handleShare}
            disabled={!activeLocation}
            className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition ${
              activeLocation
                ? "border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-700"
                : "cursor-not-allowed bg-stone-50 text-gray-300"
            }`}
          >
            {shareState === "copied" ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" /> Share
              </>
            )}
          </button>

          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 rounded-lg bg-black px-2.5 py-1.5 text-[11px] text-white shadow-lg">
              <div className="flex items-center gap-1">
                <Copy className="h-3 w-3" />
                Copied to clipboard
              </div>
            </div>
          )}
        </div>

        {/* Panel switcher — desktop only */}
        <div className="hidden lg:flex items-center gap-1 rounded-lg bg-stone-100 p-1">
          <button
            onClick={() => setRightPanel(PANEL_TYPES.INCIDENTS)}
            className={`rounded-md px-2.5 py-1 text-[10px] ${
              rightPanel === PANEL_TYPES.INCIDENTS
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setRightPanel(PANEL_TYPES.TRACKING)}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] ${
              rightPanel === PANEL_TYPES.TRACKING
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            <Users className="h-3 w-3" />
            {fieldWorkers.length}
          </button>
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          LIVE
        </div>
      </div>
    </header>
  );
}
