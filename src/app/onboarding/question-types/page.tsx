import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { subtopicLabel, sectionLabel } from "@/data/subtopics";
import { generateQuestionTypeChoiceMessage } from "@/lib/mrKimMessages";
import { QuestionTypeChoiceButtons } from "@/components/QuestionTypeChoiceButtons";

export default async function QuestionTypesChoicePage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/");

  const masteryTable = await buildMasteryTable(student);
  const weakest = [...masteryTable].sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  const weakLabel = weakest.map((w) => `${subtopicLabel(w.section, w.subtopic)} (${sectionLabel(w.section)})`).join(", ");

  const { text } = await generateQuestionTypeChoiceMessage(student, weakLabel);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mb-8 grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-indigo-600 text-lg font-bold text-white">
        MK
      </div>
      <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-left">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim says</p>
        <p className="whitespace-pre-line text-slate-800">{text}</p>
      </div>
      <QuestionTypeChoiceButtons />
    </div>
  );
}
