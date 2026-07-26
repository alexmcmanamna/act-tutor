export interface SkillRadarEntry {
  key: string;
  label: string;
  mastery: number; // 0..1
  attempts: number;
}

/** Shortens a subtopic label to fit as a spoke label (e.g. "Sentence Structure & Grammar" -> "Sentence Structure"). */
function shortSpokeLabel(label: string): string {
  return label.length > 16 ? label.split(/\s*&\s*/)[0] : label;
}

/**
 * A single skill radar/spider polygon for one ACT section, one spoke per
 * question type (subtopic) within that section. Geometry adapted from the
 * reference app's hand-rolled inline-SVG radar (no chart library needed).
 */
export function SkillRadar({
  title,
  entries,
  accentColor = "#4f46e5",
}: {
  title: string;
  entries: SkillRadarEntry[];
  accentColor?: string;
}) {
  // Extra horizontal margin so edge labels (e.g. "Word Choice & Idiom") have
  // room to render without being clipped by the SVG viewBox.
  const margin = 60;
  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 44;
  const count = entries.length;

  function pointAt(index: number, value: number) {
    const angle = (-90 + index * (360 / count)) * (Math.PI / 180);
    return { x: center + Math.cos(angle) * radius * value, y: center + Math.sin(angle) * radius * value, angle };
  }

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = entries.map((e, i) => pointAt(i, Math.max(0.06, e.mastery)));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-center text-sm font-semibold text-slate-800">{title}</h3>
      <svg viewBox={`${-margin} 0 ${size + margin * 2} ${size}`} className="mx-auto w-full max-w-[380px]">
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={entries.map((_, i) => pointAt(i, level)).map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}
        {entries.map((_, i) => {
          const p = pointAt(i, 1);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth={1} />;
        })}
        <polygon points={dataPolygon} fill={accentColor} fillOpacity={0.18} stroke={accentColor} strokeWidth={2} />
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={entries[i].attempts > 0 ? accentColor : "#94a3b8"}
          />
        ))}
        {entries.map((e, i) => {
          const labelPoint = pointAt(i, 1.28);
          const cos = Math.cos(labelPoint.angle);
          // Anchor away from the chart center so labels near the left/right
          // extremes extend outward into the margin instead of getting
          // clipped by the viewBox edge.
          const textAnchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
          return (
            <text
              key={e.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fontSize={10}
              fill="#475569"
              fontWeight={600}
            >
              {shortSpokeLabel(e.label)}
            </text>
          );
        })}
      </svg>
      <ul className="mt-2 space-y-1">
        {entries.map((e) => (
          <li key={e.key} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{e.label}</span>
            <span className="font-semibold text-slate-700">{Math.round(e.mastery * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
