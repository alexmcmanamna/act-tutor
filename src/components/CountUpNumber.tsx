"use client";

import { useEffect, useState } from "react";

/** Animates a number counting up from 0 to `value` over `durationMs`, via requestAnimationFrame. */
export function CountUpNumber({
  value,
  durationMs = 1200,
  className,
}: {
  value: number | null;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value == null) return;
    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * (value as number)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  if (value == null) return <span className={className}>—</span>;
  return <span className={className}>{display}</span>;
}
