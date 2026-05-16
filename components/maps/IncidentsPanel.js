"use client";

import {
  AlertTriangle,
  Users,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                              SEVERITY CONFIG                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function IncidentsPanel({
  incidents = [],
  locations = [],
  onSelectLocation,
  severityFilter = "all",
  setSeverityFilter,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredIncidents =
    severityFilter === "all"
      ? incidents
      : incidents.filter((incident) => incident.severity === severityFilter);

  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );

  function handleSelectIncident(incident) {
    const location = locations.find((loc) => loc.id === incident.location_id);
    if (location) {
      onSelectLocation(location);
    }
  }

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* MOBILE: fixed bottom sheet                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.10)] overflow-hidden">
        {/* Drag handle pill */}
        <div className="flex justify-center pt-2.5 pb-1 bg-white">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Toggle header */}
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

        {/* Scrollable list */}
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
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP: original sidebar — completely unchanged                    */}
      {/* ------------------------------------------------------------------ */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-gray-900">
            Recent Incidents
          </h2>

          <span className="rounded border border-rose-100 bg-rose-50 px-1.5 py-0.5 font-mono text-[9px] text-rose-500">
            {filteredIncidents.length}
          </span>
        </div>

        {/* Incidents */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          {sortedIncidents.length > 0 ? (
            sortedIncidents.map((incident, index) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isNewest={index === 0}
                onClick={() => handleSelectIncident(incident)}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INCIDENT CARD                                */
/* -------------------------------------------------------------------------- */

function IncidentCard({ incident, isNewest, onClick }) {
  const {
    id,
    issue_type,
    severity,
    created_at,
    reference_id,
    reporter_phone,
    health_risk,
    affected_people_count,
    locations,
    communities,
  } = incident;

  const severityConfigItem = severityConfig[severity] || severityConfig.low;

  const formatIssueType = (issueType) => {
    if (!issueType) return "Sanitation Issue";
    return issueType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const location = locations?.name || communities?.name || "Unknown Location";

  return (
    <button
      onClick={onClick}
      className={`
        w-full rounded-xl border p-2.5 md:p-3 text-left shadow-sm
        transition-all duration-200 hover:-translate-x-0.5 hover:shadow-md
        ${severityConfigItem.bgClass} ${severityConfigItem.borderClass}
        ${isNewest ? "ring-1 ring-gray-100" : ""}
      `}
    >
      {/* New Badge */}
      {isNewest && (
        <div className="mb-1.5">
          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-1.5 md:mb-2 flex items-start gap-2">
        <SeverityDot color={severityConfigItem.color} />

        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] md:text-sm font-semibold leading-tight text-gray-700">
            {formatIssueType(issue_type)}
          </h3>
        </div>

        <span
          className={`font-mono text-[9px] font-semibold ${severityConfigItem.textClass}`}
        >
          {severityConfigItem.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1 pl-4">
        {/* Location + Time */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[10px] md:text-[11px] text-gray-500">
            {location}
          </span>

          <span
            className={`flex shrink-0 items-center gap-1 font-mono text-[9px] md:text-[10px] ${
              isNewest ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            <Clock3 className="h-2.5 w-2.5 md:h-3 md:w-3" />
            {getTimeAgo(created_at)}
          </span>
        </div>

        {/* Reference ID */}
        {reference_id && (
          <p className="font-mono text-[9px] md:text-[10px] text-gray-400">
            Ref: {reference_id}
          </p>
        )}

        {/* Reporter Phone */}
        {reporter_phone && (
          <p className="font-mono text-[9px] md:text-[10px] text-gray-400">
            Reporter_No: {reporter_phone}
          </p>
        )}

        {/* Health Risk */}
        {health_risk && (
          <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-rose-600">
            <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span className="font-medium">Health Risk</span>
          </div>
        )}

        {/* Affected People */}
        {affected_people_count && (
          <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-500">
            <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{affected_people_count} people affected</span>
          </div>
        )}
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SEVERITY DOT                                 */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                EMPTY STATE                                 */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <AlertTriangle className="mb-2 h-8 w-8 text-gray-300" />

      <p className="text-sm text-gray-400">No incidents found</p>
    </div>
  );
}
