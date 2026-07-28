"use client";

import { useEffect } from "react";
import { playCelebrationSound } from "@/lib/sounds";

const STORAGE_KEY = "act-tutor-seen-badges";

/** Plays a celebration sound the first time a newly-earned badge is seen on this device (tracked via localStorage, since badges aren't persisted server-side). */
export function NewBadgeCelebration({ earnedKeys }: { earnedKeys: string[] }) {
  useEffect(() => {
    const seen = new Set(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[]);
    const hasNew = earnedKeys.some((k) => !seen.has(k));
    if (hasNew && seen.size > 0) playCelebrationSound();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(earnedKeys));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earnedKeys.join(",")]);

  return null;
}
