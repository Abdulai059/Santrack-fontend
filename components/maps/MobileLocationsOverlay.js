"use client";

export default function MobileLocationsOverlay({
  isVisible,
  locations,
  activeLocation,
  onSelectLocation,
  onClose,
}) {
  if (!isVisible) return null;

  return (
    <div className="lg:hidden absolute inset-0 z-20 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <span className="font-mono text-xs tracking-[0.22em] uppercase text-gray-900 font-semibold">
          Locations
        </span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {locations.map((loc) => {
          const isActive = activeLocation.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className={`relative w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 overflow-hidden active:scale-98 ${
                isActive
                  ? "border-slate-300 bg-stone-50 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 active:bg-gray-100"
              }`}
            >
              <span
                className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full"
                style={{ background: loc.color, opacity: isActive ? 1 : 0.4 }}
              />
              <span
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                style={{
                  background: `${loc.color}22`,
                  color: loc.color,
                  border: `1.5px solid ${loc.color}44`,
                }}
              >
                {loc.incidents}
              </span>
              <div className="pl-2 pr-9">
                <div
                  className={`text-base font-semibold leading-tight mb-1.5 ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {loc.name}
                </div>
                <div className="font-mono text-xs text-gray-400">/{loc.slug}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
