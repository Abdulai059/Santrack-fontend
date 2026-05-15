"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PANEL_TYPES } from "@/lib/mapConstants";
import { Share2, Check, Copy, MapPin, X } from "lucide-react";

/**
 * MapHeader — top bar with search, share-location, panel switcher, and live badge.
 *
 * @param {Object}   props
 * @param {string}   props.rightPanel        - Active right panel key
 * @param {Function} props.setRightPanel     - Panel setter
 * @param {Array}    props.fieldWorkers      - Live field worker list
 * @param {Array}    props.locations         - Infrastructure locations
 * @param {Array}    props.communities       - Community locations
 * @param {Function} props.onSelectLocation  - Fly-to callback
 * @param {Object}   props.activeLocation    - Currently active location
 */
export default function MapHeader({
  rightPanel,
  setRightPanel,
  fieldWorkers,
  locations = [],
  communities = [],
  onSelectLocation,
  activeLocation,
}) {
  const [searchQuery, setSearchQuery]       = useState("");
  const [showResults, setShowResults]       = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [shareState, setShareState]         = useState("idle"); // idle | copied | error
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const searchRef = useRef(null);

  // ── Searchable pool ──────────────────────────────────────────────────────
  const allLocations = [
    ...locations.map((loc) => ({ ...loc, category: "Infrastructure" })),
    ...communities.map((com) => ({ ...com, category: "Community" })),
  ];

  // ── Filter on query change ───────────────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) {
      setFilteredResults([]);
      setShowResults(false);
      return;
    }

    const results = allLocations
      .filter(
        (loc) =>
          loc.name?.toLowerCase().includes(q) ||
          loc.district?.toLowerCase().includes(q) ||
          loc.region?.toLowerCase().includes(q) ||
          loc.type?.toLowerCase().includes(q)
      )
      .slice(0, 8);

    setFilteredResults(results);
    setShowResults(true);
  }, [searchQuery, locations, communities]);

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectResult = useCallback(
    (location) => {
      onSelectLocation(location);
      setSearchQuery("");
      setShowResults(false);
    },
    [onSelectLocation]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setShowResults(false);
  }, []);

  /**
   * Share the active location as a deep-link URL.
   * Falls back to clipboard copy when Web Share API is unavailable.
   */
  const handleShareLocation = useCallback(async () => {
    if (!activeLocation) return;

    const [lat, lng] = activeLocation.coords;
    const shareUrl = `${window.location.origin}/maps?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&name=${encodeURIComponent(activeLocation.name)}`;

    const shareData = {
      title: `SaniTrack — ${activeLocation.name}`,
      text: `Check out ${activeLocation.name} on SaniTrack GIS`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setShareState("copied");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareState("copied");
        setShowShareTooltip(true);
      }
    } catch {
      // User cancelled or clipboard failed — silently ignore
      setShareState("idle");
    }

    setTimeout(() => {
      setShareState("idle");
      setShowShareTooltip(false);
    }, 2500);
  }, [activeLocation]);

  // ── Severity dot color ───────────────────────────────────────────────────
  const dotColor = (loc) => loc.color ?? "#8b5cf6";

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-14 sm:h-16 bg-white border-b border-gray-200 shrink-0 relative z-20">

      {/* ── Left: brand ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.25em] text-gray-900 uppercase font-semibold">
          Sanitation GIS
        </span>
      </div>

      {/* ── Center: search ──────────────────────────────────────────────── */}
      <div className="flex-1 max-w-md mx-3 sm:mx-4 relative" ref={searchRef}>
        <div className="relative">
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            placeholder="Search locations, districts…"
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white transition-all duration-200"
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Results dropdown ──────────────────────────────────────────── */}
        {showResults && filteredResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl shadow-stone-900/10 max-h-72 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {filteredResults.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelectResult(location)}
                className="w-full px-3 py-2.5 text-left hover:bg-stone-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3 group"
              >
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0 ring-2 ring-offset-1 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: dotColor(location),
                    ringColor: dotColor(location),
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {location.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 font-medium shrink-0">
                      {location.category}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {location.type && (
                      <span className="capitalize">{location.type}</span>
                    )}
                    {location.district && (
                      <span>
                        {" "}· {location.district}
                        {location.region && `, ${location.region}`}
                      </span>
                    )}
                  </div>
                  {location.incidents !== undefined && (
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {location.incidents} incident
                      {location.incidents !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
                <MapPin className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors mt-0.5 shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {showResults && searchQuery && filteredResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl shadow-stone-900/10 p-5 text-center z-50 animate-in fade-in duration-150">
            <svg
              className="w-8 h-8 mx-auto text-gray-300 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-500">No locations found</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Try searching by name, district, or type
            </p>
          </div>
        )}
      </div>

      {/* ── Right: share + panel switcher + live badge ───────────────────── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Share location button */}
        <div className="relative">
          <button
            onClick={handleShareLocation}
            disabled={!activeLocation}
            title={activeLocation ? `Share ${activeLocation.name}` : "Select a location to share"}
            className={`
              flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-medium transition-all duration-200
              ${activeLocation
                ? shareState === "copied"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                : "border-gray-100 bg-stone-50 text-gray-300 cursor-not-allowed"
              }
            `}
            aria-label="Share location"
          >
            {shareState === "copied" ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Tooltip */}
          {showShareTooltip && (
            <div className="absolute right-0 top-full mt-2 bg-stone-800 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-1.5">
                <Copy className="w-3 h-3" />
                Link copied to clipboard
              </div>
              {/* Arrow */}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-stone-800 rotate-45" />
            </div>
          )}
        </div>

        {/* Panel toggle — desktop only */}
        <div className="hidden lg:flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
          <button
            onClick={() => setRightPanel(PANEL_TYPES.INCIDENTS)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 ${
              rightPanel === PANEL_TYPES.INCIDENTS
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setRightPanel(PANEL_TYPES.TRACKING)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 flex items-center gap-1 ${
              rightPanel === PANEL_TYPES.TRACKING
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Field Workers
            {fieldWorkers.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center">
                {fieldWorkers.length}
              </span>
            )}
          </button>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-gray-900">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="hidden sm:inline font-semibold">LIVE</span>
        </div>
      </div>
    </header>
  );
}
