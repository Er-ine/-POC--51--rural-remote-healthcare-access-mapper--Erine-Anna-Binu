"use client";

import { useState } from "react";

export default function SyntheticDataDisclaimer() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between text-[11px] text-amber-200">
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        <p className="truncate sm:whitespace-normal">
          <strong className="font-semibold text-white">Demonstration Notice:</strong> Settlement demographics, travel durations, and facility specialties are illustrative synthetic models. Facility names and coordinates represent real municipal references.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss disclaimer"
        className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-amber-300 transition hover:bg-amber-400/20 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}