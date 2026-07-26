import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildLessonStages } from "@/lib/lessonContent";
import type { SectionKey } from "@/data/subtopics";
import { LessonWorkspace } from "@/components/LessonWorkspace";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ section: string; subtopic: string }>;
}) {
  const { section, subtopic } = await params;
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  const stages = buildLessonStages(section as SectionKey, subtopic);
  if (!stages) notFound();

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
      <LessonWorkspace stages={stages} planItemId={planItem?.id ?? null} />
    </div>
  );
}
