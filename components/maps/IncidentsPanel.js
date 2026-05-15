"use client";

const severityConfig = {
  high: {
    dot: "#ff4444",
    bgClass: "bg-rose-100",
    borderClass: "border-gray-300",
    label: "HIGH",
    labelColor: "text-red-600",
  },
  medium: {
    dot: "#ffaa00",
    bgClass: "bg-brand-highlight",
    borderClass: "border-gray-300",
    label: "MED",
    labelColor: "text-amber-600",
  },
  low: {
    dot: "#00cc66",
    bgClass: "bg-brand-primary",
    borderClass: "border-emerald-200",
    label: "LOW",
    labelColor: "text-emerald-600",
  },

   
};

export default function IncidentsPanel({
  incidents,
  locations,
  onSelectLocation,
}) {
  function handleClick(inc) {
    const loc = locations.find((l) => l.id === inc.locationId);
    if (loc) onSelectLocation(loc);
  }

  // Sort incidents by time (most recent first) - extra safety
  const sortedIncidents = [...incidents].sort((a, b) => {
    // Parse time strings like "2m ago", "1h ago", "3d ago"
    const getMinutes = (timeStr) => {
      if (timeStr === "Just now") return 0;
      const match = timeStr.match(/(\d+)([mhd])/);
      if (!match) return 999999;
      const [, num, unit] = match;
      const value = parseInt(num);
      if (unit === 'm') return value;
      if (unit === 'h') return value * 60;
      if (unit === 'd') return value * 1440;
      return 999999;
    };
    return getMinutes(a.time) - getMinutes(b.time);
  });

  return (
    <aside className="w-64 shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Label */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        <span className="font-mono text-sm tracking-[0.22em] uppercase text-gray-900">
          Recent Incidence
        </span>
        <span className="font-mono text-[9px] text-rose-500 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5">
          {incidents.length}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 p-3 flex-1 sh">
        {sortedIncidents.map((inc, index) => {
          const s = severityConfig[inc.severity];
          const isNewest = index === 0; // First item is newest
          
          return (
            <button
              key={inc.id}
              onClick={() => handleClick(inc)}
              className={`w-full text-left rounded-lg border shadow-sm p-3 transition-all duration-150 hover:-translate-x-0.5 hover:brightness-95 cursor-pointer ${s.bgClass} ${s.borderClass} ${isNewest ? 'ring-1 shadow-lg ring-gray-100' : ''}`}
            >
              {/* New badge for most recent */}
              {isNewest && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-300 text-white">
                    New
                  </span>
                </div>
              )}
              
              {/* Top row */}
              <div className="flex items-start gap-2 mb-1.5">
                <span className="mt-0.5 relative flex h-2 w-2 shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                    style={{ background: s.dot }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: s.dot }}
                  />
                </span>
                <span className="text-[15px] font-semibold text-gray-500 leading-tight flex-1">
                  {inc.title}
                </span>
                <span
                  className={`font-mono text-[9px] font-semibold shrink-0 mt-0.5 ${s.labelColor}`}
                >
                  {s.label}
                </span>
              </div>

              {/* Meta row */}
              <div className="pl-4 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] text-gray-500 truncate max-w-25">
                    {inc.location}
                  </span>
                  <span className={`font-mono text-[13px] font-semibold ${isNewest ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {inc.time}
                  </span>
                </div>
                {inc.referenceId && (
                  <div className="font-mono text-[10px] text-gray-400">
                    Ref: {inc.referenceId}
                  </div>
                )}
                {inc.healthRisk && (
                  <div className="font-mono text-[10px] text-red-600">
                    ⚠️ Health Risk
                  </div>
                )}
                {inc.affectedPeople && (
                  <div className="font-mono text-[10px] text-gray-500">
                    {inc.affectedPeople} people affected
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
