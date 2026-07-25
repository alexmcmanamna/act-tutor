import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { getLesson, youtubeSearchUrl } from "@/data/lessons";
import { sectionLabel, subtopicLabel, type SectionKey } from "@/data/subtopics";
import { SkipToPracticeLink } from "@/components/SkipToPracticeLink";
import { MrKimInlineHelp } from "@/components/MrKimInlineHelp";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ section: string; subtopic: string }>;
}) {
  const { section, subtopic } = await params;
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  const lesson = getLesson(section as SectionKey, subtopic);
  if (!lesson) notFound();

  const plan = await prisma.studyPlan.findFirst({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  const planItem = plan?.items.find(
    (i) => i.type === "LESSON" && i.section === section && i.subtopic === subtopic
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="mb-1 text-sm font-medium text-indigo-600">
        {sectionLabel(section as SectionKey)} · {subtopicLabel(section as SectionKey, subtopic)}
      </p>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">{lesson.title}</h1>

      <div className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700 shadow-sm">
        {lesson.body}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-semibold text-slate-900">Key takeaways</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          {lesson.keyTakeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <a
        href={youtubeSearchUrl(lesson.youtubeSearchQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm hover:border-red-300 hover:text-red-600"
      >
        ▶ Watch related videos on YouTube
      </a>

      <div className="mt-4">
        <MrKimInlineHelp
          initialPrompt={`Can you explain "${subtopicLabel(section as SectionKey, subtopic)}" (${sectionLabel(
            section as SectionKey
          )}) a different way, maybe with a simpler example?`}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <SkipToPracticeLink section={section} subtopic={subtopic} itemId={planItem?.id ?? null} />
      </div>
    </div>
  );
}
