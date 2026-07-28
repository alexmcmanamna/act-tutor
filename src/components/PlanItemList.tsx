"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StudyPlanItem } from "@prisma/client";

/**
 * Timeline/path layout (Khan Academy course-map style) instead of a flat
 * list — a connecting line runs through every plan item, with the current
 * "up next" item visually called out. Same data and actions as before
 * (toggle complete, navigate to lesson/practice), just a different shell.
 */
export function PlanItemList({ items }: { items: StudyPlanItem[] }) {
  const router = useRouter();
  const [localItems, setLocalItems] = useState(items);

  async function toggle(item: StudyPlanItem) {
    const nextStatus = item.status === "DONE" ? "PENDING" : "DONE";
    setLocalItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i)));
    await fetch("/api/plan/item", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, status: nextStatus }),
    });
    // Keeps the "today's goal"/streak widgets and the NavBar's calendar chip
    // (this week x/y) in sync with the change instead of only updating this
    // checkbox locally.
    router.refresh();
  }

  const firstPendingIndex = localItems.findIndex((i) => i.status !== "DONE");

  return (
    <ol className="relative">
      {/* the connecting path line */}
      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-200" aria-hidden="true" />

      {localItems.map((item, i) => {
        const href =
          item.type === "LESSON"
            ? `/lesson/${item.section}/${item.subtopic}`
            : `/practice/${item.section}/${item.subtopic}`;
        const done = item.status === "DONE";
        const isUpNext = i === firstPendingIndex;

        return (
          <li key={item.id} className="relative flex gap-4 pb-4">
            <button
              onClick={() => toggle(item)}
              aria-label="Toggle complete"
              className={`relative z-10 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-all motion-safe:hover:scale-110 ${
                done
                  ? "border-green-500 bg-green-500 text-white"
                  : isUpNext
                    ? "border-indigo-500 bg-white text-indigo-600 shadow-[0_0_0_4px_rgba(99,102,241,0.15)] motion-safe:animate-pulse"
                    : "border-slate-300 bg-white text-slate-400"
              }`}
            >
              {done ? "✓" : i + 1}
            </button>

            <div
              className={`min-w-0 flex-1 rounded-xl border p-4 transition-colors ${
                isUpNext ? "border-indigo-300 bg-indigo-50/60" : done ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {isUpNext && <p className="mb-0.5 text-xs font-bold uppercase tracking-wide text-indigo-500">Up next</p>}
                  <Link
                    href={href}
                    className={`font-medium hover:text-indigo-600 ${done ? "text-slate-400 line-through" : "text-slate-900"}`}
                  >
                    {item.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-slate-500">{item.rationale}</p>
                </div>
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.type === "LESSON" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {item.type === "LESSON" ? "Lesson" : "Practice"}
                </span>
              </div>
              {isUpNext && (
                <Link
                  href={href}
                  className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Start →
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
