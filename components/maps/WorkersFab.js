"use client";

import { Users } from "lucide-react";

/**
 * Floating Action Button for mobile field workers access
 */
export default function WorkersFab({ fieldWorkers = [], onClick, isVisible }) {
  if (!isVisible) return null;

  const count = fieldWorkers.length;
  const hasWorkers = count > 0;

  return (
    <button
      onClick={onClick}
      className="
        lg:hidden fixed bottom-6 right-6 z-30
        w-14 h-14 rounded-full
        bg-emerald-500 hover:bg-emerald-600
        text-white shadow-lg shadow-emerald-500/30
        flex items-center justify-center
        transition-all duration-200 active:scale-95
      "
    >
      <div className="relative">
        <Users className="w-6 h-6" />

        {hasWorkers && (
          <span
            className="
              absolute -top-1 -right-1
              w-5 h-5 rounded-full
              bg-red-500 text-white
              text-[10px] font-bold
              flex items-center justify-center
              border-2 border-white
            "
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
