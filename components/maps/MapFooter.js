"use client";

export default function MapFooter({ activeLocation }) {
  return (
    <footer className="h-12 shrink-0 bg-white border-t border-gray-200 flex items-center justify-between px-5 font-mono text-[10px] text-gray-400">
      <span>© 2026 MapSys</span>

      <div className="flex items-center gap-4">
        <span>Incident Monitoring Platform</span>
        <span className="text-gray-200">|</span>
        <span>
          Zone:{" "}
          <span className="font-bold" style={{ color: activeLocation.color }}>
            {activeLocation.name}
          </span>
        </span>
        <span className="text-gray-200">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          All systems operational
        </span>
      </div>

      <span>WR · GH</span>
    </footer>
  );
}
