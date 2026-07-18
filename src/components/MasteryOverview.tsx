import { SECTIONS, subtopicLabel } from "@/data/subtopics";
import type { SubtopicMasteryEntry } from "@/lib/studyPlan";

function masteryColor(mastery: number): string {
  if (mastery < 0.4) return "bg-red-400";
  if (mastery < 0.65) return "bg-amber-400";
  return "bg-green-500";
}

export function MasteryOverview({ masteryTable }: { masteryTable: SubtopicMasteryEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SECTIONS.map(({ key: section, label }) => {
        const rows = masteryTable.filter((m) => m.section === section);
        return (
          <div key={section} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-slate-800">{label}</h3>
            <div className="space-y-2.5">
              {rows.map((r) => (
                <div key={r.subtopic}>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{subtopicLabel(r.section, r.subtopic)}</span>
                    <span>{Math.round(r.mastery * 100)}%</span>
                  </div>
                  <div className="mastery-bar-track h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full ${masteryColor(r.mastery)}`}
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
