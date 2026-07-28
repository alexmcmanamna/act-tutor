import type { LevelInfo } from "@/lib/gamification";

/** Compact level + progress-to-next-level indicator (a shorter-horizon motivator than badges). */
export function LevelBadge({ level }: { level: LevelInfo }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Level</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">
        {level.level} <span className="text-base font-medium text-indigo-600">· {level.title}</span>
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${Math.round(level.progress * 100)}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {level.pointsIntoLevel}/{level.pointsForNextLevel} to level {level.level + 1}
      </p>
    </div>
  );
}
