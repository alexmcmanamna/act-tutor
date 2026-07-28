"use client";

import { useEffect, useState } from "react";
import {
  ACCOMMODATION_OPTIONS,
  applyAccommodations,
  readAccommodations,
  writeAccommodations,
  type AccommodationPreferences,
} from "@/lib/accessibility";

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

/**
 * Accessibility accommodations panel — ported from the reference fork's
 * Settings tab (same 8 accommodations). Stored in localStorage (no account
 * system to tie server-side prefs to per-device here) and applied instantly
 * to <html> via data attributes that globals.css keys off of.
 */
export function AccessibilitySettings() {
  // Lazy initializer: reads real localStorage on the client, defaults during
  // SSR (no window there) — safe because rendering stays gated behind
  // `mounted` (below) until after hydration, so this never causes a mismatch.
  const [prefs, setPrefs] = useState<AccommodationPreferences>(() => readAccommodations());
  const [mounted, setMounted] = useState(false);

  // One-time post-hydration reveal (see comment above) — not a per-render reset.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    applyAccommodations(prefs);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function update(key: keyof AccommodationPreferences, value: boolean) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    writeAccommodations(next);
    applyAccommodations(next);
  }

  if (!mounted) return null;

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {ACCOMMODATION_OPTIONS.map(([key, label, detail]) => (
        <label key={key} className="flex items-center justify-between gap-4 p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-800">{label}</span>
            <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>
          </span>
          <ToggleSwitch checked={prefs[key]} onChange={(v) => update(key, v)} label={label} />
        </label>
      ))}
    </div>
  );
}
