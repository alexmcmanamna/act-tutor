import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { sectionLabel, subtopicLabel, type SectionKey } from "@/data/subtopics";
import { PracticeSession } from "@/components/PracticeSession";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ section: string; subtopic: string }>;
}) {
  const { section, subtopic } = await params;
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  const plan = await prisma.studyPlan.findFirst({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  const planItem = plan?.items.find(
    (i) => i.type === "PRACTICE" && i.section === section && i.subtopic === subtopic
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="mb-1 text-sm font-medium text-indigo-600">
        {sectionLabel(section as SectionKey)} · {subtopicLabel(section as SectionKey, subtopic)}
      </p>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Practice</h1>
      <PracticeSession section={section} subtopic={subtopic} planItemId={planItem?.id ?? null} />
    </div>
  );
}
