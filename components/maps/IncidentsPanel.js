"use client";

import {
  AlertTriangle,
  Users,
  Clock3,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
} from "lucide-react";
import { useState } from "react";

/* ─── Config ───────────────────────────────────────────────────────────────── */

const severityConfig = {
  critical: {
    color: "#8b0000",
    label: "CRITICAL",
    bgClass: "bg-rose-100",
    borderClass: "border-rose-200",
    textClass: "text-rose-700",
  },
  high: {
    color: "#ef4444",
    label: "HIGH",
    bgClass: "bg-brand-highlight",
    borderClass: "border-brand-highlight",
    textClass: "text-rose-600",
  },
  medium: {
    color: "#f59e0b",
    label: "MED",
    bgClass: "bg-brand-soft",
    borderClass: "border-brand-soft",
    textClass: "text-amber-600",
  },
  low: {
    color: "#10b981",
    label: "LOW",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-600",
  },
};

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const formatIssueType = (type) => {
  if (!type) return "Sanitation Issue";
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const getTimeAgo = (timestamp) => {
  const diffMs = Date.now() - new Date(timestamp);
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/* ─── Main component ───────────────────────────────────────────────────────── */

export default function IncidentsPanel({
  incidents = [],
  locations = [],
  onSelectLocation,
  severityFilter = "all",
  setSeverityFilter,
  onSelectIncident,
  selectedIncident,
  togglePinLocation,
  pinnedLocation,
  onStartNavigation,
  onStopNavigation,
  navigationDestination,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredIncidents =
    severityFilter === "all"
      ? incidents
      : incidents.filter((i) => i.severity === severityFilter);

  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  function handleSelectIncident(incident) {
    if (onSelectIncident) {
      onSelectIncident(incident);
    } else {
      // Fallback: fly map to the incident's location
      const location = locations.find((loc) => loc.id === incident.location_id);
      if (location) onSelectLocation(location);
    }
  }

  const cardProps = {
    togglePinLocation,
    pinnedLocation,
    onStartNavigation,
    onStopNavigation,
    navigationDestination,
  };

  return (
    <>
      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="flex justify-center pt-2.5 pb-1 bg-white">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex w-full items-center justify-between bg-white px-5 pb-3 pt-1"
        >
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-gray-900">
              Recent Incidents
            </h2>
            <span className="rounded border border-rose-100 bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] text-rose-500">
              {filteredIncidents.length}
            </span>
          </div>
          {mobileOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {mobileOpen && (
          <div className="max-h-[50vh] overflow-y-auto bg-white">
            <div className="flex flex-col gap-2 p-2.5 pb-6">
              {sortedIncidents.length > 0 ? (
                sortedIncidents.map((incident, index) => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    isNewest={index === 0}
                    onClick={() => {
                      handleSelectIncident(incident);
                      setMobileOpen(false);
                    }}
                    {...cardProps}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: pinned sidebar, header stays fixed while cards scroll */}
      <aside className="hidden md:flex w-70 shrink-0 flex-col h-full border-l border-gray-200 bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-gray-900">
            Recent Incidents
          </h2>
          <span className="rounded border border-rose-100 bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] text-rose-500">
            {filteredIncidents.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2 p-3">
            {sortedIncidents.length > 0 ? (
              sortedIncidents.map((incident, index) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  isNewest={index === 0}
                  onClick={() => handleSelectIncident(incident)}
                  {...cardProps}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* ─── Incident card ────────────────────────────────────────────────────────── */

function IncidentCard({
  incident,
  isNewest,
  onClick,
  togglePinLocation,
  pinnedLocation,
  onStartNavigation,
  onStopNavigation,
  navigationDestination,
}) {
  const {
    issue_type,
    severity,
    created_at,
    reference_id,
    reporter_phone,
    health_risk,
    affected_people_count,
    locations,
    status,
    communities,
  } = incident;

  const cfg = severityConfig[severity] || severityConfig.low;
  const locationName =
    locations?.name || communities?.name || "Unknown Location";
  const isPinned = pinnedLocation?.id === locations?.id;
  const isNavigating = navigationDestination?.id === locations?.id;

  function handlePin(e) {
    e.stopPropagation();
    if (locations) togglePinLocation(locations);
  }

  function handleNavigate(e) {
    e.stopPropagation();
    if (!locations) return;
    isNavigating ? onStopNavigation() : onStartNavigation(locations);
  }

  return (
    <div
      onClick={onClick}
      className={`
        w-full rounded-xl border p-2.5 md:p-3 text-left shadow-sm cursor-pointer
        transition-all duration-200 hover:-translate-x-0.5 hover:shadow-md
        ${cfg.bgClass} ${cfg.borderClass}
        ${isNewest ? "ring-1 ring-gray-100" : ""}
      `}
    >
      {isNewest && (
        <div className="mb-1.5">
          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        </div>
      )}

      {/* Header row: severity dot + title + actions */}
      <div className="mb-1.5 md:mb-2 flex items-start gap-2">
        <SeverityDot color={cfg.color} />

        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] md:text-sm font-semibold leading-tight text-gray-700">
            {formatIssueType(issue_type)}
          </h3>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`font-mono text-[9px] font-semibold ${cfg.textClass}`}
          >
            {cfg.label}
          </span>

          {/* Pin button */}
          {/* {togglePinLocation && locations && (
            <button
              onClick={handlePin}
              title={isPinned ? "Unpin location" : "Pin location"}
              className={`p-1 rounded transition-colors ${
                isPinned
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MapPin className="h-3 w-3" />
            </button>
          )} */}

          {/* Navigate button */}
          {onStartNavigation && locations && (
            <button
              onClick={handleNavigate}
              title={isNavigating ? "Stop navigation" : "Navigate to location"}
              className={`p-1 rounded transition-colors ${
                isNavigating
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Navigation className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-1 pl-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[10px] md:text-[11px] text-gray-500">
            {locationName}
          </span>
          <span
            className={`flex shrink-0 items-center gap-1 font-mono text-[9px] md:text-[10px] ${isNewest ? "text-emerald-600" : "text-gray-400"}`}
          >
            <Clock3 className="h-2.5 w-2.5 md:h-3 md:w-3" />
            {getTimeAgo(created_at)}
          </span>
        </div>

        {reference_id && (
          <p className="font-mono text-[9px] md:text-[10px] text-gray-400">
            Ref: {reference_id}
          </p>
        )}

        {reporter_phone && (
          <p className="font-mono text-[9px] md:text-[10px] text-gray-400">
            Reporter: {reporter_phone}
          </p>
        )}

        {status && (
          <p className="text-[9px] md:text-[10px] font-medium capitalize text-gray-600">
            {status}
          </p>
        )}

        {health_risk && (
          <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-rose-600">
            <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span className="font-medium">Health Risk</span>
          </div>
        )}

        {affected_people_count && (
          <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-500">
            <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{affected_people_count} people affected</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function SeverityDot({ color }) {
  return (
    <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <AlertTriangle className="mb-2 h-8 w-8 text-gray-300" />
      <p className="text-sm text-gray-400">No incidents found</p>
    </div>
  );
}
