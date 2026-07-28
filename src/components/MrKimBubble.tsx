"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MrKimAvatar } from "./MrKimAvatar";
import { readAccommodations, speak } from "@/lib/accessibility";

/**
 * The consistent "Mr. Kim says" card shell used everywhere he speaks
 * (dashboard, goal-check, round-complete, round-followup, question-types,
 * lesson coaching). Always shows his avatar next to the message.
 *
 * When `text` is provided and Settings > Accessibility > "Read aloud" is on,
 * shows a speaker button using the Web Speech API.
 */
export function MrKimBubble({
  children,
  label = "Mr. Kim says",
  className = "border-indigo-100 bg-indigo-50",
  text,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  text?: string;
}) {
  // readAloud comes from localStorage, unavailable during SSR — start false
  // (matching the server render) and flip after mount, avoiding a hydration
  // mismatch rather than reading it directly during render.
  const [readAloudOn, setReadAloudOn] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadAloudOn(readAccommodations().readAloud);
  }, []);
  const showReadAloud = !!text && readAloudOn;

  return (
    <div className={`flex gap-3 rounded-2xl border p-4 text-left ${className}`}>
      <MrKimAvatar size={36} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          {showReadAloud && (
            <button
              type="button"
              onClick={() => speak(text!)}
              aria-label="Read this message aloud"
              className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-indigo-600"
            >
              🔊
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
