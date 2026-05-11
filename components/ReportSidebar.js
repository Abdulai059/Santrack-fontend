"use client";
import { SIDEBAR_IDS, STATUS_META, reportsById } from "@/lib/data";
import ReportItem from "./ReportItem";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";

export default function ReportSidebar({ selectedId, onSelectReport }) {
  const sidebarReports = SIDEBAR_IDS.map((id) => reportsById[id]).filter(
    Boolean,
  );
  const selected = reportsById[selectedId];
  const meta = selected ? STATUS_META[selected.status] : null;

  return (
    <aside
      className="flex flex-col bg-white border-l border-stone-100 overflow-hidden"
      aria-label="Recent reports"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-stone-200 bg-white sticky top-0 z-10">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          {/* Title */}
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              Reports
            </h2>

            <p className="text-xs text-stone-500 mt-0.5">
              Community sanitation reports
            </p>
          </div>

          {/* Count Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>

            <span className="text-xs font-semibold text-emerald-700">
              {sidebarReports.length} Open
            </span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {["All", "Open", "Done"].map((f, i) => (
            <button
              key={f}
              className={`
          px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
          border shadow-sm
          ${
            i === 0
              ? "bg-stone-900 text-white border-stone-900 shadow-md"
              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
          }
        `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto p-1.5 px-5  space-y-0.5"
        role="listbox"
        aria-label="Report list"
      >
        {sidebarReports.map((report) => (
          <ReportItem
            key={report.id}
            report={report}
            isSelected={report.id === selectedId}
            onClick={() => onSelectReport(report.id)}
          />
        ))}
      </div>

      {selected && (
        <div className="p-3 px-5 border-t border-stone-100 shrink-0 space-y-2">
          {/* Actions */}
          <button
            onClick={() => alert(`Assigning operator to ${selected.ticket}`)}
            className="w-full flex items-center justify-between px-3.5 py-2.75 rounded-xl
                 bg-stone-900 hover:bg-stone-800 active:bg-black
                 text-white text-[13px] font-medium transition-colors cursor-pointer"
          >
            <span>Assign operator</span>
            <ArrowRight size={15} className="text-stone-500" />
          </button>

          <button
            onClick={() => alert(`Opening full details for ${selected.ticket}`)}
            className="w-full flex items-center justify-between px-3.5 py-2.75 rounded-xl
                 border border-stone-200 hover:bg-stone-50 active:bg-stone-100
                 text-stone-700 text-[13px] font-medium transition-colors cursor-pointer"
          >
            <span>View full details</span>
            <ExternalLink size={13} className="text-stone-400" />
          </button>
        </div>
      )}
    </aside>
  );
}
