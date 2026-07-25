"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StudyPlanItem } from "@prisma/client";

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

  return (
    <ol className="space-y-2">
      {localItems.map((item, i) => {
        const href =
          item.type === "LESSON"
            ? `/lesson/${item.section}/${item.subtopic}`
            : `/practice/${item.section}/${item.subtopic}`;
        const done = item.status === "DONE";
        return (
          <li
            key={item.id}
            className={`flex items-center gap-3 rounded-xl border p-4 ${
              done ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"
            }`}
          >
            <button
              onClick={() => toggle(item)}
              aria-label="Toggle complete"
              className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border text-xs font-bold ${
                done ? "border-green-500 bg-green-500 text-white" : "border-slate-300 text-transparent"
              }`}
            >
              ✓
            </button>
            <div className="min-w-0 flex-1">
              <Link href={href} className={`font-medium hover:text-indigo-600 ${done ? "text-slate-400 line-through" : "text-slate-900"}`}>
                {i + 1}. {item.title}
              </Link>
              <p className="text-sm text-slate-500">{item.rationale}</p>
            </div>
            <span
              className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                item.type === "LESSON" ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"
              }`}
            >
              {item.type === "LESSON" ? "Lesson" : "Practice"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
