"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps every route's content so navigating between pages animates in
 * (fade + slight rise) instead of snapping. Keyed on pathname so each
 * navigation remounts and replays the animation. Respects the user's
 * reduced-motion preference (both OS-level and the in-app Settings toggle)
 * via the `motion-safe:` variant — the animation class simply doesn't apply
 * when either says to skip it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="motion-safe:animate-[page-in_0.35s_ease-out]">
      {children}
    </div>
  );
}
