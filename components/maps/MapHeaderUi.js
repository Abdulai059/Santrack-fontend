
import { PANEL } from "../constants";

export function MapHeader({ rightPanel, fieldWorkers, onSetPanel }) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-14 sm:h-16 bg-white border-b border-gray-200 shrink-0 relative z-10">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.25em] text-gray-900 uppercase font-semibold">
          Sanitation GIS
        </span>
      </div>

      <h1 className="text-sm sm:text-base font-extrabold tracking-[0.2em] sm:tracking-[0.4em] uppercase relative text-gray-900">
        Live Map
        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" />
      </h1>

      <div className="flex items-center gap-2">
        {/* Panel switcher — desktop only */}
        <div className="hidden lg:flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
          <button
            onClick={() => onSetPanel(PANEL.INCIDENTS)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
              rightPanel === PANEL.INCIDENTS
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => onSetPanel(PANEL.TRACKING)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 ${
              rightPanel === PANEL.TRACKING
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

        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-gray-900">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="hidden sm:inline font-semibold">LIVE</span>
        </div>
      </div>
    </header>
  );
}