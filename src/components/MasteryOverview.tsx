import { SECTIONS, subtopicLabel } from "@/data/subtopics";
import type { SubtopicMasteryEntry } from "@/lib/studyPlan";

function masteryColor(mastery: number): string {
  if (mastery < 0.4) return "bg-red-400";
  if (mastery < 0.65) return "bg-amber-400";
  return "bg-green-500";
}

// Science is shown last and visually quieter, reflecting that it counts for
// less toward the composite score than English/Math/Reading.
const SECTION_ORDER = [...SECTIONS].sort((a, b) => (a.key === "SCIENCE" ? 1 : b.key === "SCIENCE" ? -1 : 0));

export function MasteryOverview({ masteryTable }: { masteryTable: SubtopicMasteryEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SECTION_ORDER.map(({ key: section, label }) => {
        const rows = masteryTable.filter((m) => m.section === section);
        const isScience = section === "SCIENCE";
        return (
          <div
            key={section}
            className={`rounded-xl border p-4 ${isScience ? "border-slate-100 bg-slate-50/60" : "border-slate-200 bg-white"}`}
          >
            <h3 className={`mb-3 font-semibold ${isScience ? "text-slate-500" : "text-slate-800"}`}>
              {label}
              {isScience && <span className="ml-2 text-xs font-normal text-slate-400">lower composite weight</span>}
            </h3>
            <div className="space-y-2.5">
              {rows.map((r) => (
                <div key={r.subtopic}>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{subtopicLabel(r.section, r.subtopic)}</span>
                    <span>{Math.round(r.mastery * 100)}%</span>
                  </div>
                  <div className="mastery-bar-track h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full ${isScience ? "bg-slate-300" : masteryColor(r.mastery)}`}
                      style={{ width: `${Math.round(r.mastery * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
