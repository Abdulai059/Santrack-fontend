"use client";
import { STATUS_META } from "@/lib/data";
import { School, Building2 } from "lucide-react";

const LOC_ICON = {
  school: School,
  community: Building2,
};

export default function ReportItem({ report, isSelected, onClick }) {
  const meta = STATUS_META[report.status];
  const LocIcon = LOC_ICON[report.locType] ?? Building2;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`
        flex items-stretch gap-3 p-3.5 rounded-xl border cursor-pointer
        transition-all duration-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${
          isSelected
            ? "bg-blue-50 border-blue-200"
            : "bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50"
        }
      `}
    >
      {/* Accent bar */}
      <div
        className="w-[3px] rounded-full flex-shrink-0 self-stretch"
        style={{ background: meta.accentColor }}
      />

      <div className="flex-1 min-w-0">
        {/* Ticket + badge */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono font-medium text-stone-400">
            {report.ticket}
          </span>
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${meta.bgColor} ${meta.textColor}`}
          >
            {meta.label}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <LocIcon size={12} className="text-stone-400 flex-shrink-0" />
          <span className="text-[13px] font-medium text-stone-800 truncate">
            {report.location}
          </span>
        </div>

        {/* Type + time */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-stone-500">{report.type}</span>
          <span className="text-[10px] font-mono text-stone-400">
            {report.time}
          </span>
        </div>
      </div>
    </div>
  );
}
