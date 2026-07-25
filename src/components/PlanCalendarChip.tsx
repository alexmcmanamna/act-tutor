"use client";

import { useState } from "react";
import Link from "next/link";
import { sectionLabel } from "@/data/subtopics";
import { isSameCalendarDay, monthGridDays, weekDays } from "@/lib/calendar";

export interface CalendarPlanItem {
  id: string;
  type: "LESSON" | "PRACTICE";
  section: "ENGLISH" | "MATH" | "READING" | "SCIENCE";
  subtopic: string;
  title: string;
  status: "PENDING" | "DONE";
  scheduledFor: Date | null;
  href: string;
}

function itemsOn(items: CalendarPlanItem[], day: Date): CalendarPlanItem[] {
  return items.filter((i) => i.scheduledFor && isSameCalendarDay(i.scheduledFor, day));
}

export function PlanCalendarChip({ items }: { items: CalendarPlanItem[] }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"week" | "month">("week");
  const today = new Date();

  const thisWeek = weekDays(today).flatMap((d) => itemsOn(items, d));
  const weekDone = thisWeek.filter((i) => i.status === "DONE").length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
      >
        📅 This week: {weekDone}/{thisWeek.length}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your study calendar</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                ✕
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setView("week")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  view === "week" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView("month")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  view === "month" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Month
              </button>
            </div>

            {view === "week" ? <WeekView items={items} today={today} /> : <MonthView items={items} today={today} />}
          </div>
        </div>
      )}
    </>
  );
}

function WeekView({ items, today }: { items: CalendarPlanItem[]; today: Date }) {
  const days = weekDays(today);
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
      {days.map((day) => {
        const dayItems = itemsOn(items, day);
        const isToday = isSameCalendarDay(day, today);
        return (
          <div key={day.toISOString()} className={`rounded-lg border p-2 ${isToday ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200"}`}>
            <p className="mb-1.5 text-xs font-semibold text-slate-500">
              {day.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
            </p>
            <div className="space-y-1">
              {dayItems.length === 0 && <p className="text-xs text-slate-300">—</p>}
              {dayItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block truncate rounded px-1.5 py-1 text-xs ${
                    item.status === "DONE"
                      ? "bg-slate-100 text-slate-400 line-through"
                      : item.section === "SCIENCE"
                        ? "bg-slate-100 text-slate-500"
                        : item.type === "LESSON"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-purple-100 text-purple-700"
                  }`}
                  title={item.title}
                >
                  {sectionLabel(item.section)}: {item.type === "LESSON" ? "Lesson" : "Practice"}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({ items, today }: { items: CalendarPlanItem[]; today: Date }) {
  const days = monthGridDays(today);
  const currentMonth = today.getMonth();
  return (
    <div className="grid grid-cols-7 gap-1">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div key={d} className="pb-1 text-center text-[11px] font-semibold text-slate-400">
          {d}
        </div>
      ))}
      {days.map((day) => {
        const dayItems = itemsOn(items, day);
        const isToday = isSameCalendarDay(day, today);
        const inMonth = day.getMonth() === currentMonth;
        return (
          <div
            key={day.toISOString()}
            className={`min-h-[3.25rem] rounded-lg border p-1 text-xs ${
              isToday ? "border-indigo-400 bg-indigo-50/50" : "border-slate-100"
            } ${inMonth ? "" : "opacity-40"}`}
          >
            <div className="mb-0.5 text-[11px] text-slate-400">{day.getDate()}</div>
            {dayItems.length > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {dayItems.slice(0, 4).map((item) => (
                  <span
                    key={item.id}
                    title={item.title}
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === "DONE"
                        ? "bg-slate-300"
                        : item.section === "SCIENCE"
                          ? "bg-slate-400"
                          : item.type === "LESSON"
                            ? "bg-sky-500"
                            : "bg-purple-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
