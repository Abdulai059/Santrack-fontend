"use client";
import { STATS } from "@/lib/data";
import {
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  Headphones,
  ClockAlert,
  Hourglass,
  Zap,
  UserCheck,
} from "lucide-react";

const config = {
  "bg-red-500": {
    bg: "#fff5f5",
    border: "#fecaca",
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    textColor: "#dc2626",
    Icon: AlertTriangle,
    SubIcon: ClockAlert,
  },
  "bg-amber-400": {
    bg: "#fffbeb",
    border: "#fde68a",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    textColor: "#d97706",
    Icon: ClipboardList,
    SubIcon: Hourglass,
  },
  "bg-green-500": {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    textColor: "#16a34a",
    Icon: CheckCircle,
    SubIcon: Zap,
  },
  "bg-blue-500": {
    bg: "#eff6ff",
    border: "#bfdbfe",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    textColor: "#2563eb",
    Icon: Headphones,
    SubIcon: UserCheck,
  },
};

export default function StatsRow() {
  return (
    <div
      className="grid grid-cols-4 gap-3 p-4 w-full"
      role="region"
      aria-label="Summary statistics"
    >
      {STATS.map((s) => {
        const c = config[s.dotColor] ?? {};
        const { Icon, SubIcon } = c;
        return (
          <div
            key={s.label}
            className="rounded-2xl p-3  border transition-all duration-150 hover:-translate-y-px hover:shadow-lg"
            style={{ background: c.bg, borderColor: c.border }}
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                {s.label}
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: c.iconBg }}
              >
                <Icon size={18} color={c.iconColor} />
              </div>
            </div>

            {/* Value */}
            <div className="text-[32px] font-light leading-none tracking-[-0.03em] text-stone-900 mb-2.5 tabular-nums">
              {s.value}
            </div>

            {/* Sub */}
            <div
              className="flex items-center gap-1.5 text-[11px]"
              style={{ color: c.textColor, fontFamily: "'DM Mono', monospace" }}
            >
              <SubIcon size={12} />
              {s.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
