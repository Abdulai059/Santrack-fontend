"use client";

import { ROLE_COLORS } from "@/lib/mapConstants";

export default function MobileWorkersOverlay({
  isVisible,
  workers,
  currentUserId,
  onSelectWorker,
  onClose,
}) {
  if (!isVisible) return null;

  return (
    <div className="lg:hidden absolute inset-0 z-20 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.22em] uppercase text-gray-900 font-semibold">
            Field Workers
          </span>
          <span className="font-mono text-[10px] text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 font-bold">
            {workers.length} Active
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

      {/* Stats */}
      <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 shrink-0 bg-gray-50">
        <div className="py-3 text-center">
          <div className="text-xl font-bold text-stone-800">{workers.length}</div>
          <div className="font-mono text-[10px] text-stone-400 uppercase tracking-wide">
            Total Active
          </div>
        </div>
        <div className="py-3 text-center">
          <div className="text-xl font-bold text-emerald-600">
            {workers.filter((w) => w.isMoving).length}
          </div>
          <div className="font-mono text-[10px] text-stone-400 uppercase tracking-wide">
            Moving Now
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-300 gap-3 py-12">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <p className="text-sm text-stone-400 text-center font-medium">
              No active field workers
            </p>
          </div>
        ) : (
          workers.map((worker) => {
            const isMe = worker.id === currentUserId;
            const roleColor = ROLE_COLORS[worker.role] ?? ROLE_COLORS.visitor;

            return (
              <button
                key={worker.id}
                onClick={() => onSelectWorker(worker)}
                className="w-full text-left p-3.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-150 active:scale-98"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base font-semibold text-stone-800 truncate">
                        {worker.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                          YOU
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}
                    >
                      {worker.role?.replace("_", " ")}
                    </span>
                  </div>

                  {/* Moving indicator */}
                  <div className="shrink-0 mt-1">
                    {worker.isMoving ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Moving
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-stone-300" />
                        Still
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-2">
                  <span>{worker.lastSeen}</span>
                  {worker.speed > 0.5 && (
                    <span className="font-semibold text-emerald-600">
                      {(worker.speed * 3.6).toFixed(1)} km/h
                    </span>
                  )}
                </div>

                {/* Coords */}
                <div className="pt-2 border-t border-stone-100 font-mono text-[10px] text-stone-400 truncate">
                  📍 {worker.coords[0].toFixed(5)}, {worker.coords[1].toFixed(5)}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
