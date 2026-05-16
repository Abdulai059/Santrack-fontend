"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";

import { PANEL_TYPES } from "@/lib/mapConstants";

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

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
}) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);

  const [shareState, setShareState] = useState("idle");
  const [showTooltip, setShowTooltip] = useState(false);

  const searchRef = useRef(null);
  const severityDropdownRef = useRef(null);

  /* ---------------------------- search dataset ---------------------------- */

  const dataset = [
    ...locations.map((l) => ({
      ...l,
      category: "Infrastructure",
    })),
    ...communities.map((c) => ({
      ...c,
      category: "Community",
    })),
  ];

  /* ----------------------------- search logic ----------------------------- */

  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = dataset
      .filter((item) =>
        [item.name, item.district, item.region, item.type]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q)),
      )
      .slice(0, 8);

    setResults(filtered);
    setShowResults(true);
  }, [query, locations, communities]);

  /* -------------------------- outside click close ------------------------- */

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (
        severityDropdownRef.current &&
        !severityDropdownRef.current.contains(e.target)
      ) {
        setShowSeverityDropdown(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* ------------------------------ handlers ------------------------------- */

  const handleSelect = useCallback(
    (location) => {
      onSelectLocation(location);
      setQuery("");
      setShowResults(false);
    },
    [onSelectLocation],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setShowResults(false);
  }, []);

  const handleShare = useCallback(async () => {
    if (!activeLocation) return;

    const [lat, lng] = activeLocation.coords;

    const url = `${window.location.origin}/maps?lat=${lat.toFixed(
      5,
    )}&lng=${lng.toFixed(5)}&name=${encodeURIComponent(activeLocation.name)}`;

    const payload = {
      title: `SaniTrack — ${activeLocation.name}`,
      text: `View ${activeLocation.name} on SaniTrack`,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(payload)) {
        await navigator.share(payload);
        setShareState("copied");
      } else {
        await navigator.clipboard.writeText(url);
        setShareState("copied");
        setShowTooltip(true);
      }
    } catch {
      setShareState("idle");
    }

    setTimeout(() => {
      setShareState("idle");
      setShowTooltip(false);
    }, 2000);
  }, [activeLocation]);

  /* ------------------------------- render -------------------------------- */

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-3 sm:h-16 sm:px-4 md:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 animate-pulse text-emerald-500" />

        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-900 sm:text-[11px]">
          Sanitation GIS
        </span>
      </div>

      {/* SEARCH */}
      <div ref={searchRef} className="relative mx-3 flex-1 max-w-md sm:mx-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search locations..."
          className="w-full rounded-lg border border-gray-200 bg-stone-50 py-1.5 pl-9 pr-8 text-xs transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 sm:text-sm"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* RESULTS */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full z-[9999] mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex w-full items-start gap-3 border-b border-gray-100 px-3 py-2.5 text-left hover:bg-stone-50"
              >
                <span
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{
                    background: item.color || "#8b5cf6",
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">
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

        {/* EMPTY */}
        {showResults && query && results.length === 0 && (
          <div className="absolute top-full z-[9999] mt-2 w-full rounded-xl border bg-white p-4 text-center shadow-xl">
            <p className="text-sm text-gray-500">No results found</p>
          </div>
        )}
      </div>

      {/* SEVERITY FILTER */}
      <div className="relative" ref={severityDropdownRef}>
        <button
          onClick={() => setShowSeverityDropdown(!showSeverityDropdown)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs hover:bg-stone-50 transition"
        >
          <span className="font-medium text-gray-700">
            {severityFilter === "all"
              ? "All Severity"
              : severityFilter.toUpperCase()}
          </span>
          <ChevronDown className="h-3 w-3 text-gray-400" />
        </button>

        {showSeverityDropdown && (
          <div className="absolute right-0 top-full z-[9999] mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-xl">
            {["all", "critical", "high", "medium", "low"].map((level) => (
              <button
                key={level}
                onClick={() => {
                  setSeverityFilter(level);
                  setShowSeverityDropdown(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs transition hover:bg-stone-50 ${
                  severityFilter === level
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {level === "all" ? "All Severity" : level.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-2">
        {/* SHARE */}
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
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                Share
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

        {/* PANELS */}
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

        {/* LIVE */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          LIVE
        </div>
      </div>
    </header>
  );
}
